import { getActiveWallet, getPeriodReport, type PeriodReportType, type PeriodReportResult } from "@/lib/data"
import { PeriodTypeTabs } from "@/components/reports/PeriodTypeTabs"
import { OverviewChart } from "@/components/dashboard/OverviewChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react"

const VALID_TYPES: PeriodReportType[] = ["mtd", "ytd", "yoy", "ttm"]

type SearchParams = { [key: string]: string | string[] | undefined }

export default async function ReportsPeriodPage({
    searchParams,
}: {
    searchParams?: SearchParams | Promise<SearchParams>
}) {
    const wallet = await getActiveWallet()
    if (!wallet) {
        return (
            <div className="space-y-6">
                <p className="text-slate-600 dark:text-slate-400">Dompet tidak ditemukan. Pilih atau buat dompet terlebih dahulu.</p>
                <Link href="/wallets" className="text-blue-600 dark:text-blue-400 hover:underline">Ke Dompet</Link>
            </div>
        )
    }

    const params = searchParams && typeof (searchParams as Promise<SearchParams>).then === 'function'
        ? await (searchParams as Promise<SearchParams>)
        : (searchParams ?? {})
    const typeParam = params?.type
    const type: PeriodReportType = typeof typeParam === "string" && VALID_TYPES.includes(typeParam as PeriodReportType)
        ? (typeParam as PeriodReportType)
        : "mtd"

    const report = await getPeriodReport(wallet.id, type)

    return (
        <div className="space-y-8">
            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Link
                        href="/reports"
                        className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Laporan
                    </Link>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-sky-700 to-indigo-600 dark:from-slate-100 dark:via-sky-300 dark:to-indigo-300 bg-clip-text text-transparent">
                        Laporan Periode
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        MTD, YTD, YoY, dan TTM untuk analisis tren
                    </p>
                </div>
                <PeriodTypeTabs currentType={type} />
            </div>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 via-white to-sky-50/50 dark:from-slate-900 dark:to-slate-950">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{report.label}</CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{report.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                        Periode: {report.periodStart} – {report.periodEnd}
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <SummaryCard
                            title="Pemasukan"
                            value={report.income}
                            variant="income"
                        />
                        <SummaryCard
                            title="Pengeluaran"
                            value={report.expense}
                            variant="expense"
                        />
                        <SummaryCard
                            title="Bersih"
                            value={report.net}
                            variant="net"
                        />
                    </div>

                    {report.type === "yoy" && report.previous && (
                        <YoYComparison report={report} />
                    )}

                    {report.type === "ttm" && report.monthlyData && report.monthlyData.length > 0 && (
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                                Tren 12 bulan (TTM)
                            </h3>
                            <OverviewChart data={report.monthlyData} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

function SummaryCard({
    title,
    value,
    variant,
}: {
    title: string
    value: number
    variant: "income" | "expense" | "net"
}) {
    const isIncome = variant === "income"
    const isNet = variant === "net"
    const isPositive = isNet ? value >= 0 : isIncome
    const display = isIncome ? `+${formatCurrency(value)}` : isNet ? (value >= 0 ? `+${formatCurrency(value)}` : formatCurrency(value)) : `-${formatCurrency(value)}`
    return (
        <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 p-4">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
            <p
                className={`text-2xl font-bold mt-1 ${
                    isNet
                        ? isPositive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        : isIncome
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                }`}
            >
                {display}
            </p>
        </div>
    )
}

function YoYComparison({ report }: { report: PeriodReportResult }) {
    if (report.type !== "yoy" || !report.previous) return null
    const { previous, growthIncomePercent, growthExpensePercent } = report
    return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4 space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Perbandingan dengan {previous.label}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Pemasukan {previous.label}: {formatCurrency(previous.income)}
                    </p>
                    <GrowthBadge value={growthIncomePercent} />
                </div>
                <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Pengeluaran {previous.label}: {formatCurrency(previous.expense)}
                    </p>
                    <GrowthBadge value={growthExpensePercent} label="expense" />
                </div>
            </div>
        </div>
    )
}

function GrowthBadge({ value, label = "income" }: { value?: number; label?: "income" | "expense" }) {
    if (value === undefined || Number.isNaN(value)) return null
    const isPositive = value >= 0
    const isExpense = label === "expense"
    const good = isExpense ? !isPositive : isPositive
    return (
        <span
            className={`inline-flex items-center gap-1 text-sm font-medium mt-1 ${
                good ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}
        >
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {isPositive ? "+" : ""}
            {value.toFixed(1)}% YoY
        </span>
    )
}
