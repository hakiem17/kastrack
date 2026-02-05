import { getActiveWallet, getWalletNote } from "@/lib/data"
import { CreateWalletForm } from "@/components/wallet/CreateWalletForm"
import { StickyNoteEditorClient } from "@/components/catatan/StickyNoteEditorClient"

export default async function CatatanPage() {
    const wallet = await getActiveWallet()

    if (!wallet) {
        return <CreateWalletForm />
    }

    const initialContent = await getWalletNote(wallet.id)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-sky-700 to-indigo-600 dark:from-slate-100 dark:via-sky-300 dark:to-indigo-300 bg-clip-text text-transparent">
                    Catatan
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Ketik catatan seperti sticky note. Satu catatan per dompet.
                </p>
            </div>

            <StickyNoteEditorClient walletId={wallet.id} initialContent={initialContent} />
        </div>
    )
}
