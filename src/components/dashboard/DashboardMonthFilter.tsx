"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "lucide-react"

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]

export function DashboardMonthFilter({
  currentMonth,
  currentYear,
}: {
  currentMonth: number
  currentYear: number
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const monthParam = searchParams.get("month")
  const yearParam = searchParams.get("year")
  const month = monthParam ? parseInt(monthParam, 10) : currentMonth
  const year = yearParam ? parseInt(yearParam, 10) : currentYear

  const handleMonthChange = (value: string) => {
    const next = new URLSearchParams(searchParams.toString())
    next.set("month", value)
    if (!next.has("year")) next.set("year", String(currentYear))
    router.push(`/dashboard?${next.toString()}`)
  }

  const handleYearChange = (value: string) => {
    const next = new URLSearchParams(searchParams.toString())
    next.set("year", value)
    if (!next.has("month")) next.set("month", String(currentMonth))
    router.push(`/dashboard?${next.toString()}`)
  }

  const currentYearNum = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYearNum - 2 + i)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
      <Select value={String(month)} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue placeholder="Bulan" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((label, i) => (
            <SelectItem key={i} value={String(i + 1)}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={String(year)} onValueChange={handleYearChange}>
        <SelectTrigger className="w-[100px] h-9">
          <SelectValue placeholder="Tahun" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
