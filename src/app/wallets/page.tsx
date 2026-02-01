import { getActiveWallet, getWalletSummaries } from "@/lib/data"
import { WalletSwitcher } from "@/components/wallet/WalletSwitcher"
import { WalletTransferForm } from "@/components/wallet/WalletTransferForm"
import { CreateWalletForm } from "@/components/wallet/CreateWalletForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { createWalletAndStay, setActiveWallet } from "@/lib/actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default async function WalletsPage() {
    const [activeWallet, wallets] = await Promise.all([
        getActiveWallet(),
        getWalletSummaries(),
    ])

    if (wallets.length === 0) {
        return <CreateWalletForm />
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                        Dompet
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Kelola dan pindah antar dompet</p>
                </div>
                <WalletSwitcher wallets={wallets} activeWalletId={activeWallet?.id || null} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold">Overview Semua Wallet</CardTitle>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Saldo total per dompet</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {wallets.map((wallet) => (
                            <div
                                key={wallet.id}
                                className="flex flex-col gap-3 rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/60 dark:bg-slate-900/70"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                            {wallet.name}
                                        </span>
                                        {wallet.id === activeWallet?.id && (
                                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                Aktif
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{wallet.currency}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2 sm:items-end">
                                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                        {formatCurrency(wallet.totalBalance)}
                                    </div>
                                    {wallet.id !== activeWallet?.id && (
                                        <form action={setActiveWallet}>
                                            <input type="hidden" name="walletId" value={wallet.id} />
                                            <input type="hidden" name="redirectTo" value="/wallets" />
                                            <Button
                                                type="submit"
                                                size="sm"
                                                className="h-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                                            >
                                                Jadikan Aktif
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold">Transfer Antar Wallet</CardTitle>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Pindahkan saldo antar dompet</p>
                    </CardHeader>
                    <CardContent>
                        <WalletTransferForm
                            wallets={wallets.map((wallet) => ({ id: wallet.id, name: wallet.name }))}
                            activeWalletId={activeWallet?.id || null}
                        />
                    </CardContent>
                </Card>
            </div>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold">Tambah Dompet Baru</CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Buat dompet tambahan dengan cepat</p>
                </CardHeader>
                <CardContent>
                    <form action={createWalletAndStay} className="flex flex-col gap-3 md:flex-row">
                        <Input
                            name="name"
                            placeholder="Nama dompet (cth: Kas Operasional)"
                            required
                            className="h-11 border-2 focus:border-blue-500 transition-colors"
                        />
                        <Button
                            type="submit"
                            className="h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200"
                        >
                            Tambah Dompet
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
