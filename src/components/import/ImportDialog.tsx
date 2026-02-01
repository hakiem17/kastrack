"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, FileText, AlertCircle, CheckCircle2, Download } from "lucide-react"
import { parseCSV, validateAndConvertRows } from "@/lib/import"
import { importTransactions, ImportTransactionData } from "@/lib/actions"
import { generateImportTemplate, downloadCSV } from "@/lib/export"

interface ImportDialogProps {
    walletId: string
}

export function ImportDialog({ walletId }: ImportDialogProps) {
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState<{ valid: number; errors: string[] } | null>(null)
    const [result, setResult] = useState<{ success: boolean; message: string; errors?: string[] } | null>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        setFile(selectedFile)
        setPreview(null)
        setResult(null)

        // Read and validate file
        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const content = event.target?.result as string
                const rows = parseCSV(content)
                const validation = validateAndConvertRows(rows)
                setPreview({
                    valid: validation.valid.length,
                    errors: validation.errors
                })
            } catch (error) {
                setPreview({
                    valid: 0,
                    errors: [`Error membaca file: ${error instanceof Error ? error.message : 'Unknown error'}`]
                })
            }
        }
        reader.readAsText(selectedFile, 'UTF-8')
    }

    const handleImport = async () => {
        if (!file || !preview || preview.valid === 0) return

        setLoading(true)
        setResult(null)

        try {
            const reader = new FileReader()
            reader.onload = async (event) => {
                try {
                    const content = event.target?.result as string
                    const rows = parseCSV(content)
                    const validation = validateAndConvertRows(rows)

                    if (validation.valid.length === 0) {
                        setResult({
                            success: false,
                            message: 'Tidak ada data valid untuk diimpor',
                            errors: validation.errors
                        })
                        setLoading(false)
                        return
                    }

                    // Convert to import format
                    const importData: ImportTransactionData[] = validation.valid.map(tx => ({
                        date: tx.Tanggal,
                        categoryName: tx.Kategori,
                        type: tx.Tipe === 'Pemasukan' ? 'income' : 'expense',
                        amount: typeof tx.Jumlah === 'number' ? tx.Jumlah : parseFloat(tx.Jumlah.toString()),
                        description: tx.Keterangan || ''
                    }))

                    const response = await importTransactions(walletId, importData)

                    if (response.error) {
                        setResult({
                            success: false,
                            message: response.error,
                            errors: []
                        })
                    } else {
                        setResult({
                            success: true,
                            message: response.message || 'Import berhasil',
                            errors: response.errors
                        })
                        // Reset form after successful import
                        setTimeout(() => {
                            setFile(null)
                            setPreview(null)
                            setResult(null)
                            setOpen(false)
                        }, 2000)
                    }
                } catch (error) {
                    setResult({
                        success: false,
                        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        errors: []
                    })
                } finally {
                    setLoading(false)
                }
            }
            reader.readAsText(file, 'UTF-8')
        } catch (error) {
            setResult({
                success: false,
                message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                errors: []
            })
            setLoading(false)
        }
    }

    const handleDownloadTemplate = () => {
        const template = generateImportTemplate()
        downloadCSV(template, 'template-import-transaksi.csv')
    }

    const handleClose = () => {
        if (!loading) {
            setOpen(false)
            setTimeout(() => {
                setFile(null)
                setPreview(null)
                setResult(null)
            }, 300)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Data
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Import Transaksi dari CSV</DialogTitle>
                    <DialogDescription>
                        Upload file CSV untuk mengimpor transaksi. Format harus sesuai dengan template.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Download Template */}
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-slate-500" />
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    Download Template
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Gunakan template ini sebagai panduan format
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            Pilih File CSV
                        </label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileSelect}
                            className="block w-full text-sm text-slate-500 dark:text-slate-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                dark:file:bg-blue-900/30 dark:file:text-blue-300
                                dark:hover:file:bg-blue-900/50
                                cursor-pointer"
                        />
                    </div>

                    {/* Preview */}
                    {preview && (
                        <div className={`p-4 rounded-lg border ${
                            preview.errors.length > 0
                                ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                                : 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                        }`}>
                            <div className="flex items-start gap-2">
                                {preview.errors.length > 0 ? (
                                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                                ) : (
                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                                )}
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${
                                        preview.errors.length > 0
                                            ? 'text-red-900 dark:text-red-100'
                                            : 'text-green-900 dark:text-green-100'
                                    }`}>
                                        {preview.valid} transaksi valid ditemukan
                                    </p>
                                    {preview.errors.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            <p className="text-xs font-medium text-red-700 dark:text-red-300">
                                                {preview.errors.length} error ditemukan:
                                            </p>
                                            <ul className="text-xs text-red-600 dark:text-red-400 space-y-1 max-h-32 overflow-y-auto">
                                                {preview.errors.slice(0, 10).map((error, idx) => (
                                                    <li key={idx}>• {error}</li>
                                                ))}
                                                {preview.errors.length > 10 && (
                                                    <li>... dan {preview.errors.length - 10} error lainnya</li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Result */}
                    {result && (
                        <div className={`p-4 rounded-lg border ${
                            result.success
                                ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                                : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                        }`}>
                            <div className="flex items-start gap-2">
                                {result.success ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                                )}
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${
                                        result.success
                                            ? 'text-green-900 dark:text-green-100'
                                            : 'text-red-900 dark:text-red-100'
                                    }`}>
                                        {result.message}
                                    </p>
                                    {result.errors && result.errors.length > 0 && (
                                        <ul className="mt-2 text-xs text-red-600 dark:text-red-400 space-y-1 max-h-32 overflow-y-auto">
                                            {result.errors.slice(0, 10).map((error, idx) => (
                                                <li key={idx}>• {error}</li>
                                            ))}
                                            {result.errors.length > 10 && (
                                                <li>... dan {result.errors.length - 10} error lainnya</li>
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
                        Batal
                    </Button>
                    <Button
                        onClick={handleImport}
                        disabled={!file || !preview || preview.valid === 0 || loading}
                    >
                        {loading ? 'Mengimpor...' : 'Import Transaksi'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
