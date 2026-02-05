"use client"

import dynamic from "next/dynamic"

const StickyNoteEditor = dynamic(
    () => import("@/components/catatan/StickyNoteEditor").then((m) => m.StickyNoteEditor),
    {
        ssr: false,
        loading: () => (
            <div className="rounded-2xl border-2 border-blue-200 dark:border-blue-800/50 bg-blue-50/80 dark:bg-slate-900/80 shadow-lg overflow-hidden animate-pulse">
                <div className="p-4 border-b border-blue-200/60 dark:border-blue-800/40 bg-blue-100/50 dark:bg-blue-950/40">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Catatan</span>
                </div>
                <div className="p-4 min-h-[360px] bg-white/50 dark:bg-slate-900/30 rounded" />
            </div>
        ),
    }
)

interface Props {
    walletId: string
    initialContent: string
}

export function StickyNoteEditorClient({ walletId, initialContent }: Props) {
    return <StickyNoteEditor walletId={walletId} initialContent={initialContent} />
}
