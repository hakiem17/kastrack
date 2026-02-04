"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { setActiveWallet } from "@/lib/actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WalletOption {
    id: string
    name: string
    currency: string
}

interface WalletSwitcherProps {
    wallets: WalletOption[]
    activeWalletId: string | null
}

export function WalletSwitcher({ wallets, activeWalletId }: WalletSwitcherProps) {
    const pathname = usePathname()
    const [selectedWallet, setSelectedWallet] = useState(activeWalletId || "")
    const [isSwitching, setIsSwitching] = useState(false)

    useEffect(() => {
        setSelectedWallet(activeWalletId || "")
    }, [activeWalletId])

    if (wallets.length === 0) return null

    const handleChange = async (value: string) => {
        if (value === activeWalletId) return
        setSelectedWallet(value)
        setIsSwitching(true)
        try {
            const formData = new FormData()
            formData.set("walletId", value)
            formData.set("redirectTo", pathname)
            const result = await setActiveWallet(formData)
            if (result && "redirectTo" in result && result.redirectTo) {
                window.location.href = result.redirectTo
                return
            }
            setSelectedWallet(activeWalletId || "")
        } catch {
            setSelectedWallet(activeWalletId || "")
        } finally {
            setIsSwitching(false)
        }
    }

    return (
        <div className="w-full max-w-xs">
            <Select
                value={selectedWallet}
                onValueChange={handleChange}
                disabled={isSwitching}
            >
                <SelectTrigger className="h-11 border-2 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder={isSwitching ? "Memuat…" : "Pilih dompet"} />
                </SelectTrigger>
                <SelectContent>
                    {wallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.id}>
                            {wallet.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
