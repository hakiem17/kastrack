export interface ImportTransaction {
    Tanggal: string
    Kategori: string
    Tipe: string
    Jumlah: number | string
    Keterangan: string
}

export interface ParsedCSVRow {
    [key: string]: string
}

/**
 * Parse CSV content to array of objects
 */
export function parseCSV(content: string): ParsedCSVRow[] {
    const lines = content.split('\n').filter(line => line.trim())
    if (lines.length === 0) return []

    // Parse header
    const headers = parseCSVLine(lines[0])
    if (headers.length === 0) return []

    // Parse rows
    const rows: ParsedCSVRow[] = []
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i])
        if (values.length === 0) continue

        const row: ParsedCSVRow = {}
        headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim() || ''
        })
        rows.push(row)
    }

    return rows
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                // Escaped quote
                current += '"'
                i++
            } else {
                // Toggle quote state
                inQuotes = !inQuotes
            }
        } else if (char === ',' && !inQuotes) {
            // Field separator
            result.push(current)
            current = ''
        } else {
            current += char
        }
    }

    // Add last field
    result.push(current)
    return result
}

/**
 * Validate and convert CSV rows to import transactions
 */
export function validateAndConvertRows(rows: ParsedCSVRow[]): { valid: ImportTransaction[]; errors: string[] } {
    const valid: ImportTransaction[] = []
    const errors: string[] = []

    rows.forEach((row, index) => {
        const rowNum = index + 2 // +2 because index is 0-based and we skip header

        // Check required fields
        const tanggal = row['Tanggal'] || row['tanggal'] || row['TANGGAL']
        const kategori = row['Kategori'] || row['kategori'] || row['KATEGORI']
        const tipe = row['Tipe'] || row['tipe'] || row['TIPE'] || row['Type'] || row['type'] || row['TYPE']
        const jumlah = row['Jumlah'] || row['jumlah'] || row['JUMLAH'] || row['Amount'] || row['amount'] || row['AMOUNT']
        const keterangan = row['Keterangan'] || row['keterangan'] || row['KETERANGAN'] || row['Description'] || row['description'] || row['DESCRIPTION'] || ''

        // Validate required fields
        if (!tanggal) {
            errors.push(`Baris ${rowNum}: Tanggal tidak boleh kosong`)
            return
        }

        if (!kategori) {
            errors.push(`Baris ${rowNum}: Kategori tidak boleh kosong`)
            return
        }

        if (!tipe) {
            errors.push(`Baris ${rowNum}: Tipe tidak boleh kosong`)
            return
        }

        if (!jumlah) {
            errors.push(`Baris ${rowNum}: Jumlah tidak boleh kosong`)
            return
        }

        // Validate date format
        const date = new Date(tanggal)
        if (isNaN(date.getTime())) {
            errors.push(`Baris ${rowNum}: Format tanggal tidak valid: ${tanggal}`)
            return
        }

        // Validate type
        const normalizedType = tipe.toLowerCase()
        if (normalizedType !== 'pemasukan' && normalizedType !== 'pengeluaran' && 
            normalizedType !== 'income' && normalizedType !== 'expense') {
            errors.push(`Baris ${rowNum}: Tipe harus "Pemasukan" atau "Pengeluaran": ${tipe}`)
            return
        }

        // Validate amount
        const amount = parseFloat(jumlah.toString().replace(/[^\d.-]/g, ''))
        if (isNaN(amount) || amount <= 0) {
            errors.push(`Baris ${rowNum}: Jumlah harus berupa angka positif: ${jumlah}`)
            return
        }

        valid.push({
            Tanggal: tanggal,
            Kategori: kategori,
            Tipe: normalizedType === 'pemasukan' || normalizedType === 'income' ? 'Pemasukan' : 'Pengeluaran',
            Jumlah: amount,
            Keterangan: keterangan
        })
    })

    return { valid, errors }
}
