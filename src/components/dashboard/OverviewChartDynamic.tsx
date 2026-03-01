"use client"

import dynamic from "next/dynamic"

const OverviewChart = dynamic(
    () => import("@/components/dashboard/OverviewChart").then((m) => ({ default: m.OverviewChart })),
    {
        loading: () => <div className="h-[320px] animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />,
        ssr: false,
    }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function OverviewChartDynamic({ data, isDaily }: { data: any[]; isDaily?: boolean }) {
    return <OverviewChart data={data} isDaily={isDaily} />
}
