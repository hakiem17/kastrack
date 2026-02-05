"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { saveWalletNote } from "@/lib/actions"
import { Textarea } from "@/components/ui/textarea"

interface StickyNoteEditorProps {
    walletId: string
    initialContent: string
}

export function StickyNoteEditor({ walletId, initialContent }: StickyNoteEditorProps) {
    const router = useRouter()
    const [content, setContent] = useState(initialContent)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<"saved" | "error" | null>(null)
    const [errorText, setErrorText] = useState<string | null>(null)

    const handleSave = useCallback(async () => {
        setSaving(true)
        setMessage(null)
        setErrorText(null)
        const result = await saveWalletNote(walletId, content)
        setSaving(false)
        if (result?.error) {
            setMessage("error")
            setErrorText(result.error)
        } else {
            setMessage("saved")
            setErrorText(null)
            router.refresh()
            setTimeout(() => setMessage(null), 2000)
        }
    }, [walletId, content, router])

    return (
        <div className="rounded-2xl border-2 border-blue-200 dark:border-blue-800/50 bg-blue-50/80 dark:bg-slate-900/80 shadow-lg shadow-blue-200/20 dark:shadow-blue-900/10 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-blue-200/60 dark:border-blue-800/40 bg-blue-100/50 dark:bg-blue-950/40 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Catatan</span>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? "Menyimpan…" : "Simpan"}
                    </button>
                    {message === "saved" && (
                        <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Tersimpan</span>
                    )}
                    {message === "error" && (
                        <span className="text-sm text-red-600 dark:text-red-400">{errorText || "Gagal menyimpan"}</span>
                    )}
                </div>
            </div>
            <div className="p-4 flex-1 min-h-0">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Ketik di sini... log transaksi, pengingat, atau catatan apa saja."
                    className="min-h-[280px] resize-y border-blue-200 dark:border-blue-800/50 bg-white/80 dark:bg-slate-900/50 focus-visible:ring-blue-500 placeholder:text-slate-400"
                    rows={12}
                />
            </div>
            {/* Bar Simpan tetap di bawah, selalu terlihat */}
            <div className="p-4 pt-2 border-t border-blue-200/60 dark:border-blue-800/40 bg-blue-100/30 dark:bg-blue-950/30">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 py-3 px-4 text-base font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {saving ? "Menyimpan…" : "Simpan catatan"}
                </button>
                {message === "saved" && (
                    <p className="text-center text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-2">Tersimpan</p>
                )}
                {message === "error" && (
                    <p className="text-center text-sm text-red-600 dark:text-red-400 mt-2">{errorText || "Gagal menyimpan"}</p>
                )}
            </div>
        </div>
    )
}
