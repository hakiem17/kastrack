"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, Database, FileSpreadsheet } from "lucide-react"
import { transactionsToCSV, downloadCSV, createBackupData, exportBackup } from "@/lib/export"
import { Transaction } from "@/lib/data"

interface ExportMenuProps {
    transactions: Transaction[]
    walletName?: string
    backupData?: {
        wallet: { name: string; currency: string }
        categories: Array<{ name: string; type: string }>
        transactions: Transaction[]
    }
}

export function ExportMenu({ transactions, walletName, backupData }: ExportMenuProps) {
    const handleExportCSV = () => {
        if (transactions.length === 0) {
            alert('Tidak ada data untuk diekspor')
            return
        }

        const csv = transactionsToCSV(transactions)
        const filename = `transaksi-${walletName || 'export'}-${new Date().toISOString().split('T')[0]}.csv`
        downloadCSV(csv, filename)
    }

    const handleExportBackup = () => {
        if (!backupData) {
            alert('Fungsi backup tidak tersedia')
            return
        }

        try {
            const backup = createBackupData(backupData.wallet, backupData.categories, backupData.transactions)
            exportBackup(backup, `backup-${backupData.wallet.name}`)
        } catch (error) {
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Export Data</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExportCSV} disabled={transactions.length === 0}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>Export CSV</span>
                </DropdownMenuItem>
                {backupData && (
                    <DropdownMenuItem onClick={handleExportBackup}>
                        <Database className="mr-2 h-4 w-4" />
                        <span>Backup Lengkap (JSON)</span>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
