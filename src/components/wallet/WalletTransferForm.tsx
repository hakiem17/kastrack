"use client"

import { useEffect, useMemo, useState, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { transferBetweenWallets } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

interface WalletOption {
    id: string
    name: string
}

interface WalletTransferFormProps {
    wallets: WalletOption[]
    activeWalletId: string | null
}

const initialState = {
    error: null,
    success: null,
}

export function WalletTransferForm({ wallets, activeWalletId }: WalletTransferFormProps) {
    const today = useMemo(() => format(new Date(), "yyyy-MM-dd"), [])
    const [state, formAction] = useActionState(transferBetweenWallets, initialState)
    const [fromWalletId, setFromWalletId] = useState(activeWalletId || "")
    const [toWalletId, setToWalletId] = useState("")

    useEffect(() => {
        setFromWalletId(activeWalletId || "")
        if (activeWalletId && toWalletId === activeWalletId) {
            setToWalletId("")
        }
    }, [activeWalletId, toWalletId])

    const toWalletOptions = wallets.filter((wallet) => wallet.id !== fromWalletId)

    return (
        <form action={formAction} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dari dompet</label>
                    <Select value={fromWalletId} onValueChange={setFromWalletId}>
                        <SelectTrigger className="h-11 border-2 focus:border-blue-500 transition-colors">
                            <SelectValue placeholder="Pilih dompet asal" />
                        </SelectTrigger>
                        <SelectContent>
                            {wallets.map((wallet) => (
                                <SelectItem key={wallet.id} value={wallet.id}>
                                    {wallet.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input type="hidden" name="fromWalletId" value={fromWalletId} />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ke dompet</label>
                    <Select value={toWalletId} onValueChange={setToWalletId}>
                        <SelectTrigger className="h-11 border-2 focus:border-blue-500 transition-colors">
                            <SelectValue placeholder="Pilih dompet tujuan" />
                        </SelectTrigger>
                        <SelectContent>
                            {toWalletOptions.map((wallet) => (
                                <SelectItem key={wallet.id} value={wallet.id}>
                                    {wallet.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input type="hidden" name="toWalletId" value={toWalletId} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Jumlah</label>
                    <Input
                        type="number"
                        min="0"
                        step="0.01"
                        name="amount"
                        placeholder="0"
                        className="h-11 border-2 focus:border-blue-500 transition-colors"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tanggal</label>
                    <Input
                        type="date"
                        name="date"
                        defaultValue={today}
                        className="h-11 border-2 focus:border-blue-500 transition-colors"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Keterangan (opsional)</label>
                <Textarea
                    name="description"
                    placeholder="Catatan transfer..."
                    className="border-2 focus:border-blue-500 transition-colors min-h-[90px]"
                />
            </div>

            {state?.error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                    {state.error}
                </div>
            )}

            {state?.success && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                    {state.success}
                </div>
            )}

            <TransferButton disabled={!fromWalletId || !toWalletId} />
        </form>
    )
}

function TransferButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            disabled={pending || disabled}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200"
        >
            {pending ? "Memproses..." : "Transfer Sekarang"}
        </Button>
    )
}
