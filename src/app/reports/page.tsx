import Link from "next/link"
import { getActiveWallet, getMonthlyReport, getCategoryBreakdown, getCategoryMonthlyComparison } from "@/lib/data"
import { ExportButton } from "@/components/reports/ExportButton"
import { CategoryReport } from "@/components/reports/CategoryReport"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { BarChart3 } from "lucide-react"

export default async function ReportsPage() {
    const wallet = await getActiveWallet()

    if (!wallet) return <div>Dompet tidak ditemukan</div>

    const data = await getMonthlyReport(wallet.id)
    const incomeBreakdown = await getCategoryBreakdown(wallet.id, 'income')
    const expenseBreakdown = await getCategoryBreakdown(wallet.id, 'expense')
    const incomeMonthlyComparison = await getCategoryMonthlyComparison(wallet.id, 'income', 6)
    const expenseMonthlyComparison = await getCategoryMonthlyComparison(wallet.id, 'expense', 6)

    return (
        <div className="space-y-12">
            {/* Monthly Report Section */}
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                            Laporan Bulanan
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">Analisis keuangan 12 bulan terakhir</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href="/reports/period"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <BarChart3 className="h-4 w-4" />
                            Laporan Periode (MTD, YTD, YoY, TTM)
                        </Link>
                        <ExportButton data={data} />
                    </div>
                </div>

                <div className="rounded-xl border-0 shadow-lg bg-white dark:bg-slate-900 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-0">
                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Bulan</TableHead>
                                <TableHead className="text-right font-semibold text-green-600 dark:text-green-400">Pemasukan</TableHead>
                                <TableHead className="text-right font-semibold text-red-600 dark:text-red-400">Pengeluaran</TableHead>
                                <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Bersih</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row) => {
                                const net = row.Income - row.Expense
                                return (
                                    <TableRow key={row.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800">
                                        <TableCell className="font-semibold text-slate-900 dark:text-slate-100">{row.name}</TableCell>
                                        <TableCell className="text-right font-medium text-green-600 dark:text-green-400">{formatCurrency(row.Income)}</TableCell>
                                        <TableCell className="text-right font-medium text-red-600 dark:text-red-400">{formatCurrency(row.Expense)}</TableCell>
                                        <TableCell className={`text-right font-bold text-lg ${net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {net >= 0 ? '+' : ''}{formatCurrency(net)}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Category Report Section */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                <CategoryReport
                    incomeBreakdown={incomeBreakdown}
                    expenseBreakdown={expenseBreakdown}
                    incomeMonthlyComparison={incomeMonthlyComparison}
                    expenseMonthlyComparison={expenseMonthlyComparison}
                />
            </div>
        </div>
    )
}
