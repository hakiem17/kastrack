import { getActiveWallet, getDashboardStats, getMonthlyReport } from "@/lib/data"
import { OverviewChart } from "@/components/dashboard/OverviewChart"
import { DashboardMonthFilter } from "@/components/dashboard/DashboardMonthFilter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { CreateWalletForm } from "@/components/wallet/CreateWalletForm"

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const wallet = await getActiveWallet()

  if (!wallet) {
    return <CreateWalletForm />
  }

  const now = new Date()
  const monthParam = searchParams?.month
  const yearParam = searchParams?.year
  const month = monthParam ? parseInt(String(monthParam), 10) : now.getMonth() + 1
  const year = yearParam ? parseInt(String(yearParam), 10) : now.getFullYear()
  const validMonth = month >= 1 && month <= 12 ? month : now.getMonth() + 1
  const validYear = year >= 2000 && year <= 2100 ? year : now.getFullYear()

  const [stats, monthlyData] = await Promise.all([
    getDashboardStats(wallet.id, { month: validMonth, year: validYear }),
    getMonthlyReport(wallet.id, { month: validMonth, year: validYear }),
  ])

  const periodLabel = `${MONTH_NAMES[validMonth - 1]} ${validYear}`

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-slate-50 via-white to-sky-50 p-6 shadow-sm dark:border-slate-800/60 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-fuchsia-400/20 to-purple-500/20 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-28 w-28 rounded-full bg-gradient-to-br from-sky-400/20 to-blue-500/20 blur-2xl" />
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-sky-700 to-indigo-600 dark:from-slate-100 dark:via-sky-300 dark:to-indigo-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Ringkasan keuangan Anda</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-blue-950/40 dark:via-slate-900 dark:to-sky-950/40 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Saldo</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(stats.totalBalance)}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Saldo keseluruhan</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-teal-950/30 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Pemasukan</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">+{formatCurrency(stats.monthIncome)}</div>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-2">{periodLabel}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 via-white to-orange-50 dark:from-rose-950/30 dark:via-slate-900 dark:to-orange-950/30 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-rose-700 dark:text-rose-300">Pengeluaran</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center shadow-md">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">-{formatCurrency(stats.monthExpense)}</div>
            <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-2">{periodLabel}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
          <CardHeader className="pb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Overview Keuangan</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Tren 12 bulan sampai {periodLabel}</p>
            </div>
            <DashboardMonthFilter currentMonth={validMonth} currentYear={validYear} />
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={monthlyData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
