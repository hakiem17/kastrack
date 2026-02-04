"use client"

import Link from "next/link"
import { type PeriodReportType } from "@/lib/data"
import { cn } from "@/lib/utils"

const TABS: { value: PeriodReportType; label: string }[] = [
    { value: "mtd", label: "MTD" },
    { value: "ytd", label: "YTD" },
    { value: "yoy", label: "YoY" },
    { value: "ttm", label: "TTM" },
]

export function PeriodTypeTabs({ currentType }: { currentType: PeriodReportType }) {
    return (
        <nav className="relative z-10 flex flex-wrap gap-2" aria-label="Pilih periode laporan">
            {TABS.map((tab) => {
                const isActive = currentType === tab.value
                return (
                    <Link
                        key={tab.value}
                        href={`/reports/period?type=${tab.value}`}
                        className={cn(
                            "inline-flex items-center justify-center rounded-md px-4 py-2 min-h-[36px] text-sm font-medium transition-colors cursor-pointer select-none",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            "touch-manipulation",
                            isActive
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:opacity-90"
                                : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        {tab.label}
                    </Link>
                )
            })}
        </nav>
    )
}
