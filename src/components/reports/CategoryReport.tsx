"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CategoryBreakdown, CategoryMonthlyComparison } from "@/lib/data"
import { TrendingUp, TrendingDown, PieChart as PieChartIcon } from "lucide-react"

interface CategoryReportProps {
    incomeBreakdown: CategoryBreakdown[]
    expenseBreakdown: CategoryBreakdown[]
    incomeMonthlyComparison: CategoryMonthlyComparison[]
    expenseMonthlyComparison: CategoryMonthlyComparison[]
}

const COLORS = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
    '#ef4444', '#06b6d4', '#f97316', '#6366f1', '#14b8a6'
]

export function CategoryReport({ incomeBreakdown, expenseBreakdown, incomeMonthlyComparison, expenseMonthlyComparison }: CategoryReportProps) {
    const [selectedType, setSelectedType] = useState<'income' | 'expense'>('expense')
    const [viewMode, setViewMode] = useState<'breakdown' | 'comparison'>('breakdown')

    const currentBreakdown = selectedType === 'income' ? incomeBreakdown : expenseBreakdown
    const currentComparison = selectedType === 'income' ? incomeMonthlyComparison : expenseMonthlyComparison

    // Prepare pie chart data
    const total = currentBreakdown.reduce((sum, cat) => sum + cat.total, 0)
    const pieData = currentBreakdown.map((cat, index) => ({
        name: cat.categoryName,
        value: cat.total,
        percentage: total > 0 ? (cat.total / total) * 100 : 0,
        color: COLORS[index % COLORS.length]
    }))

    // Prepare bar chart data for monthly comparison
    const allCategoryNames = new Set<string>()
    currentComparison.forEach(month => {
        month.categories.forEach(cat => allCategoryNames.add(cat.categoryName))
    })

    const barChartData = currentComparison.map(month => {
        const data: Record<string, number> = { month: month.month }
        month.categories.forEach(cat => {
            data[cat.categoryName] = cat.total
        })
        return data
    })

    type TooltipPayloadItem = { name?: string; value?: number; color?: string; payload?: { fill?: string; percentage?: number } }
    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) => {
        if (active && payload && payload.length) {
            const data = payload[0]
            return (
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{data.name}</p>
                    <p className="text-sm font-medium" style={{ color: data.payload.fill || data.color }}>
                        {formatCurrency(data.value)}
                    </p>
                    {data.payload.percentage !== undefined && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {data.payload.percentage.toFixed(1)}% dari total
                        </p>
                    )}
                </div>
            )
        }
        return null
    }

    const formatYAxis = (value: number) => {
        if (value >= 1000000) {
            return `Rp ${(value / 1000000).toFixed(1)}Jt`
        } else if (value >= 1000) {
            return `Rp ${(value / 1000).toFixed(0)}rb`
        } else {
            return `Rp ${value.toFixed(0)}`
        }
    }

    // Get top 5 categories
    const topCategories = currentBreakdown.slice(0, 5)

    return (
        <div className="space-y-6">
            {/* Header with Controls */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                        Laporan Kategori
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Analisis pengeluaran dan pemasukan per kategori
                    </p>
                </div>
                <div className="flex gap-2">
                    <Select value={selectedType} onValueChange={(value) => setSelectedType(value as 'income' | 'expense')}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="expense">Pengeluaran</SelectItem>
                            <SelectItem value="income">Pemasukan</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={viewMode} onValueChange={(value) => setViewMode(value as 'breakdown' | 'comparison')}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="breakdown">Breakdown</SelectItem>
                            <SelectItem value="comparison">Perbandingan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {viewMode === 'breakdown' ? (
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Pie Chart */}
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChartIcon className="h-5 w-5" />
                                Distribusi {selectedType === 'income' ? 'Pemasukan' : 'Pengeluaran'} per Kategori
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend
                                            formatter={(value) => value}
                                            wrapperStyle={{ fontSize: '12px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-[300px] text-slate-500 dark:text-slate-400">
                                    Tidak ada data untuk ditampilkan
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Top Categories */}
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {selectedType === 'income' ? (
                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                ) : (
                                    <TrendingDown className="h-5 w-5 text-red-500" />
                                )}
                                Top 5 Kategori Terbesar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {topCategories.length > 0 ? (
                                <div className="space-y-4">
                                    {topCategories.map((cat, index) => {
                                        const total = currentBreakdown.reduce((sum, c) => sum + c.total, 0)
                                        const percentage = total > 0 ? (cat.total / total) * 100 : 0
                                        return (
                                            <div key={cat.categoryId} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-4 h-4 rounded"
                                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                        />
                                                        <span className="font-medium text-slate-900 dark:text-slate-100">
                                                            {cat.categoryName}
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {formatCurrency(cat.total)}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div
                                                        className="h-2 rounded-full transition-all"
                                                        style={{
                                                            width: `${percentage}%`,
                                                            backgroundColor: COLORS[index % COLORS.length]
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                                    <span>{cat.transactionCount} transaksi</span>
                                                    <span>{percentage.toFixed(1)}% dari total</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-[300px] text-slate-500 dark:text-slate-400">
                                    Tidak ada data untuk ditampilkan
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ) : (
                /* Monthly Comparison */
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
                    <CardHeader>
                        <CardTitle>
                            Perbandingan {selectedType === 'income' ? 'Pemasukan' : 'Pengeluaran'} per Kategori (6 Bulan Terakhir)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {barChartData.length > 0 && allCategoryNames.size > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        className="dark:text-slate-400"
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={formatYAxis}
                                        className="dark:text-slate-400"
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    {Array.from(allCategoryNames).map((catName, index) => (
                                        <Bar
                                            key={catName}
                                            dataKey={catName}
                                            fill={COLORS[index % COLORS.length]}
                                            radius={[4, 4, 0, 0]}
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[400px] text-slate-500 dark:text-slate-400">
                                Tidak ada data untuk ditampilkan
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Breakdown Table */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
                <CardHeader>
                    <CardTitle>Breakdown Lengkap per Kategori</CardTitle>
                </CardHeader>
                <CardContent>
                    {currentBreakdown.length > 0 ? (
                        <div className="rounded-xl border-0 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-0">
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Kategori</TableHead>
                                        <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Total</TableHead>
                                        <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Jumlah Transaksi</TableHead>
                                        <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Persentase</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentBreakdown.map((cat, index) => (
                                        <TableRow
                                            key={cat.categoryId}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800"
                                        >
                                            <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded"
                                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                    />
                                                    {cat.categoryName}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-slate-900 dark:text-slate-100">
                                                {formatCurrency(cat.total)}
                                            </TableCell>
                                            <TableCell className="text-right text-slate-600 dark:text-slate-400">
                                                {cat.transactionCount}
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-slate-600 dark:text-slate-400">
                                                {cat.percentage.toFixed(1)}%
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-[200px] text-slate-500 dark:text-slate-400">
                            Tidak ada data untuk ditampilkan
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
