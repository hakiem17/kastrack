"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const MONTHS = [
    { value: "0", label: "Semua Bulan" },
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
]

export function ReportsMonthFilter({ currentMonth }: { currentMonth: number }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Read current value from URL (client-side) so it stays in sync after navigation
    const monthParam = searchParams.get("month")
    const selectedValue = monthParam ?? String(currentMonth === 0 ? "0" : currentMonth)

    const handleMonthChange = (value: string) => {
        const next = new URLSearchParams(searchParams.toString())
        if (value === "0") {
            next.delete("month")
        } else {
            next.set("month", value)
        }
        router.push(`/reports?${next.toString()}`)
        router.refresh()
    }

    return (
        <Select value={selectedValue} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
                {MONTHS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                        {m.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
