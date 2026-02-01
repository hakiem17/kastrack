import { Transaction } from './data'
import { format } from 'date-fns'

export interface ExportTransaction {
    Tanggal: string
    Kategori: string
    Tipe: string
    Jumlah: number
    Keterangan: string
}

export interface ExportCategory {
    Nama: string
    Tipe: string
}

export interface BackupData {
    wallet: {
        name: string
        currency: string
    }
    categories: ExportCategory[]
    transactions: ExportTransaction[]
    exportedAt: string
}

/**
 * Convert transactions to CSV format
 */
export function transactionsToCSV(transactions: Transaction[]): string {
    if (transactions.length === 0) return ''

    const headers = ['Tanggal', 'Kategori', 'Tipe', 'Jumlah', 'Keterangan']
    const rows = transactions.map(tx => [
        format(new Date(tx.date), 'yyyy-MM-dd'),
        tx.categories?.name || 'Tanpa Kategori',
        tx.categories?.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        tx.amount.toString(),
        tx.description || ''
    ])

    return [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n')
}

/**
 * Convert transactions to export format
 */
export function transactionsToExport(transactions: Transaction[]): ExportTransaction[] {
    return transactions.map(tx => ({
        Tanggal: format(new Date(tx.date), 'yyyy-MM-dd'),
        Kategori: tx.categories?.name || 'Tanpa Kategori',
        Tipe: tx.categories?.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        Jumlah: tx.amount,
        Keterangan: tx.description || ''
    }))
}

/**
 * Download CSV file
 */
export function downloadCSV(content: string, filename: string) {
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' }) // BOM for Excel UTF-8
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
}

/**
 * Create backup data structure
 */
export function createBackupData(
    wallet: { name: string; currency: string },
    categories: Array<{ name: string; type: string }>,
    transactions: Transaction[]
): BackupData {
    return {
        wallet: {
            name: wallet.name,
            currency: wallet.currency
        },
        categories: categories.map(cat => ({
            Nama: cat.name,
            Tipe: cat.type === 'income' ? 'Pemasukan' : 'Pengeluaran'
        })),
        transactions: transactionsToExport(transactions),
        exportedAt: new Date().toISOString()
    }
}

/**
 * Export backup as JSON
 */
export function exportBackup(backup: BackupData, filename: string = 'backup') {
    const content = JSON.stringify(backup, null, 2)
    const blob = new Blob([content], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.json`
    a.click()
    window.URL.revokeObjectURL(url)
}

/**
 * Generate import template CSV
 */
export function generateImportTemplate(): string {
    const headers = ['Tanggal', 'Kategori', 'Tipe', 'Jumlah', 'Keterangan']
    const exampleRows = [
        ['2024-01-15', 'Gaji', 'Pemasukan', '5000000', 'Gaji bulan Januari'],
        ['2024-01-16', 'Makan', 'Pengeluaran', '50000', 'Makan siang'],
        ['2024-01-17', 'Transport', 'Pengeluaran', '20000', 'Ojek online']
    ]

    const csv = [
        headers.join(','),
        ...exampleRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    return csv
}
