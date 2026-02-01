"use client"

import { useEffect, useRef, useState } from "react"
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
    const formRef = useRef<HTMLFormElement>(null)
    const [selectedWallet, setSelectedWallet] = useState(activeWalletId || "")

    useEffect(() => {
        setSelectedWallet(activeWalletId || "")
    }, [activeWalletId])

    if (wallets.length === 0) return null

    const handleChange = (value: string) => {
        setSelectedWallet(value)
        const form = formRef.current
        if (form) {
            form.requestSubmit()
        }
    }

    return (
        <form action={setActiveWallet} ref={formRef} className="w-full max-w-xs">
            <input type="hidden" name="walletId" value={selectedWallet} />
            <input type="hidden" name="redirectTo" value={pathname} />
            <Select value={selectedWallet} onValueChange={handleChange}>
                <SelectTrigger className="h-11 border-2 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Pilih dompet" />
                </SelectTrigger>
                <SelectContent>
                    {wallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.id}>
                            {wallet.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </form>
    )
}
