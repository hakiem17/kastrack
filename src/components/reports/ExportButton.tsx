"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { downloadCSV } from "@/lib/export"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ExportButton({ data }: { data: any[] }) {
    const handleExport = () => {
        if (!data || data.length === 0) return

        const headers = Object.keys(data[0]).join(',')
        const rows = data.map(obj => Object.values(obj).map(val => `"${val}"`).join(','))
        const csv = [headers, ...rows].join('\n')

        const filename = `laporan-bulanan-${new Date().toISOString().split('T')[0]}.csv`
        downloadCSV(csv, filename)
    }

    return (
        <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
        </Button>
    )
}
