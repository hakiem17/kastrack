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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                            Laporan Bulanan
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">Analisis keuangan 6 bulan terakhir</p>
                    </div>
                    <ExportButton data={data} />
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
