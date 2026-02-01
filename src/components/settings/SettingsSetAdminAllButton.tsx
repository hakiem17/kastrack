"use client"

import { useState } from "react"
import { setSelfAdminAllWallets } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { ShieldCheck } from "lucide-react"

interface SettingsSetAdminAllButtonProps {
    /** Jumlah wallet dimana user belum admin (kalau 0, tombol tidak perlu ditampilkan) */
    nonAdminCount: number
}

export function SettingsSetAdminAllButton({ nonAdminCount }: SettingsSetAdminAllButtonProps) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

    if (nonAdminCount === 0) return null

    async function handleClick() {
        setLoading(true)
        setMessage(null)
        const res = await setSelfAdminAllWallets()
        setLoading(false)
        if (res?.error) {
            setMessage({ type: "error", text: res.error })
            return
        }
        setMessage({ type: "success", text: "Peran diperbarui. Halaman akan dimuat ulang." })
        window.location.reload()
    }

    return (
        <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                Anda anggota di {nonAdminCount} wallet dengan peran bukan Admin. Jika Anda seharusnya admin di semua wallet, klik tombol di bawah untuk memperbarui peran.
            </p>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClick}
                disabled={loading}
                className="border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40"
            >
                <ShieldCheck className="h-4 w-4 mr-2" />
                {loading ? "Memperbarui…" : "Jadikan saya admin di semua wallet"}
            </Button>
            {message && (
                <p className={`mt-2 text-sm ${message.type === "error" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                    {message.text}
                </p>
            )}
        </div>
    )
}
