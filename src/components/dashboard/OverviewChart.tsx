"use client"

import { useState } from "react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp } from "lucide-react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function OverviewChart({ data }: { data: any[] }) {
    const [chartType, setChartType] = useState<'bar' | 'line'>('bar')

    // Format untuk YAxis - format singkat untuk chart
    const formatYAxis = (value: number) => {
        if (value >= 1000000) {
            return `Rp ${(value / 1000000).toFixed(1)}Jt`
        } else if (value >= 1000) {
            return `Rp ${(value / 1000).toFixed(0)}rb`
        } else {
            return `Rp ${value.toFixed(0)}`
        }
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg">
                    <p className="font-semibold mb-2 text-slate-900 dark:text-slate-100">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            <span className="font-medium">{entry.name === 'Income' ? 'Pemasukan' : 'Pengeluaran'}:</span>{' '}
                            {formatCurrency(entry.value)}
                        </p>
                    ))}
                    {payload.length === 2 && (
                        <p className="text-sm font-semibold mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                            Bersih: {formatCurrency(payload[0].value - payload[1].value)}
                        </p>
                    )}
                </div>
            )
        }
        return null
    }

    return (
        <div className="space-y-4">
            {/* Chart Type Toggle */}
            <div className="flex justify-end gap-2">
                <Button
                    variant={chartType === 'bar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('bar')}
                    className="h-8"
                >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Bar Chart
                </Button>
                <Button
                    variant={chartType === 'line' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('line')}
                    className="h-8"
                >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Line Chart
                </Button>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={350}>
                {chartType === 'bar' ? (
                    <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                        <XAxis
                            dataKey="name"
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
                        <Legend 
                            formatter={(value) => value === 'Income' ? 'Pemasukan' : 'Pengeluaran'}
                            wrapperStyle={{ paddingTop: '20px' }}
                        />
                        <Bar 
                            dataKey="Income" 
                            fill="#22c55e" 
                            radius={[4, 4, 0, 0]}
                            name="Pemasukan"
                        />
                        <Bar 
                            dataKey="Expense" 
                            fill="#ef4444" 
                            radius={[4, 4, 0, 0]}
                            name="Pengeluaran"
                        />
                    </BarChart>
                ) : (
                    <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                        <XAxis
                            dataKey="name"
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
                        <Legend 
                            formatter={(value) => value === 'Income' ? 'Pemasukan' : 'Pengeluaran'}
                            wrapperStyle={{ paddingTop: '20px' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="Income" 
                            stroke="#22c55e" 
                            strokeWidth={3}
                            dot={{ fill: '#22c55e', r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Pemasukan"
                        />
                        <Line 
                            type="monotone" 
                            dataKey="Expense" 
                            stroke="#ef4444" 
                            strokeWidth={3}
                            dot={{ fill: '#ef4444', r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Pengeluaran"
                        />
                    </LineChart>
                )}
            </ResponsiveContainer>
        </div>
    )
}
