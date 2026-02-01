"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { acceptWalletInvite } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function InviteAcceptClient({ token }: { token: string }) {
    const router = useRouter()
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState<string>("")

    useEffect(() => {
        let cancelled = false
        acceptWalletInvite(token).then((result) => {
            if (cancelled) return
            if (result?.success) {
                setStatus("success")
                setMessage("Anda sekarang punya akses ke wallet. Mengalihkan…")
                router.push("/wallets")
                router.refresh()
            } else {
                setStatus("error")
                setMessage(result?.error || "Gagal menerima undangan.")
            }
        })
        return () => {
            cancelled = true
        }
    }, [token, router])

    return (
        <Card className="w-full max-w-md border-0 shadow-xl">
            <CardHeader>
                <CardTitle>Menerima undangan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {status === "loading" && (
                    <p className="text-slate-600 dark:text-slate-400">
                        Memproses undangan…
                    </p>
                )}
                {status === "success" && (
                    <p className="text-green-600 dark:text-green-400">{message}</p>
                )}
                {status === "error" && (
                    <>
                        <p className="text-red-600 dark:text-red-400">{message}</p>
                        <Button asChild className="w-full">
                            <Link href="/wallets">Ke Dompet</Link>
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
