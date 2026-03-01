import Link from "next/link"
import { getActiveWallet, getMonthlyReport, getCategoryBreakdown, getCategoryMonthlyComparison } from "@/lib/data"
import { ExportButton } from "@/components/reports/ExportButton"
import { ReportsYearFilter } from "@/components/reports/ReportsYearFilter"
import { ReportsMonthFilter } from "@/components/reports/ReportsMonthFilter"
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
import { startOfMonth, endOfMonth } from "date-fns"

export const dynamic = 'force-dynamic'

export default async function ReportsPage({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const wallet = await getActiveWallet()

    if (!wallet) return <div>Dompet tidak ditemukan</div>

    const params = await searchParams
    const now = new Date()
    const yearParam = params?.year
    const monthParam = params?.month
    const selectedYear = yearParam ? parseInt(String(yearParam), 10) : now.getFullYear()
    const validYear = selectedYear >= 2000 && selectedYear <= 2100 ? selectedYear : now.getFullYear()

    const selectedMonth = monthParam ? parseInt(String(monthParam), 10) : 0
    const validMonth = selectedMonth >= 1 && selectedMonth <= 12 ? selectedMonth : 0

    // Build date range for category breakdown filter
    let categoryStartDate: string | undefined
    let categoryEndDate: string | undefined

    if (validMonth > 0) {
        // Filter by specific month
        const refDate = new Date(validYear, validMonth - 1, 1)
        categoryStartDate = startOfMonth(refDate).toISOString()
        categoryEndDate = endOfMonth(refDate).toISOString()
    } else {
        // Filter by full year
        categoryStartDate = new Date(validYear, 0, 1).toISOString()
        categoryEndDate = new Date(validYear, 11, 31, 23, 59, 59, 999).toISOString()
    }

    const [data, incomeBreakdown, expenseBreakdown, incomeMonthlyComparison, expenseMonthlyComparison] = await Promise.all([
        getMonthlyReport(wallet.id, { year: validYear, yearOnly: true }),
        getCategoryBreakdown(wallet.id, 'income', categoryStartDate, categoryEndDate),
        getCategoryBreakdown(wallet.id, 'expense', categoryStartDate, categoryEndDate),
        getCategoryMonthlyComparison(wallet.id, 'income', 6),
        getCategoryMonthlyComparison(wallet.id, 'expense', 6),
    ])

    return (
        <div className="space-y-12">
            {/* Monthly Report Section */}
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                            Laporan Bulanan
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">Analisis keuangan per tahun (Jan–Des)</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <ReportsYearFilter currentYear={validYear} />
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

                <div className="rounded-xl border-0 shadow-lg bg-white dark:bg-slate-900 overflow-hidden overflow-x-auto">
                    <Table className="min-w-[320px]">
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
                <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Filter grafik kategori:
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                        <ReportsYearFilter currentYear={validYear} />
                        <ReportsMonthFilter currentMonth={validMonth} />
                    </div>
                </div>
                <CategoryReport
                    incomeBreakdown={incomeBreakdown}
                    expenseBreakdown={expenseBreakdown}
                    incomeMonthlyComparison={incomeMonthlyComparison}
                    expenseMonthlyComparison={expenseMonthlyComparison}
                    selectedYear={validYear}
                    selectedMonth={validMonth}
                />
            </div>
        </div>
    )
}

