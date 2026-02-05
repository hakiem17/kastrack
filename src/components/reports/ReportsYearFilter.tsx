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

export function ReportsYearFilter({ currentYear }: { currentYear: number }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const yearParam = searchParams.get("year")
    const year = yearParam ? parseInt(yearParam, 10) : currentYear

    const currentYearNum = new Date().getFullYear()
    const years = Array.from({ length: 6 }, (_, i) => currentYearNum - 2 + i)

    const handleYearChange = (value: string) => {
        const next = new URLSearchParams(searchParams.toString())
        next.set("year", value)
        router.push(`/reports?${next.toString()}`)
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <Select value={String(year)} onValueChange={handleYearChange}>
                <SelectTrigger className="w-[120px] h-9">
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
