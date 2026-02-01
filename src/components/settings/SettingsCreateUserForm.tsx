"use client"

import { useState, useRef, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { createUserByAdmin } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import type { WalletWithRole } from "@/lib/data"
import { UserPlus } from "lucide-react"

interface SettingsCreateUserFormProps {
    allWalletsWithRole: WalletWithRole[]
    adminWallets: WalletWithRole[]
}

export function SettingsCreateUserForm({ allWalletsWithRole, adminWallets }: SettingsCreateUserFormProps) {
    const [open, setOpen] = useState(false)
    const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)
    const [enabled, setEnabled] = useState<Record<string, boolean>>({})
    const [assignments, setAssignments] = useState<Record<string, string>>({})
    const formRef = useRef<HTMLFormElement>(null)

    const adminWalletIds = new Set(adminWallets.map((w) => w.id))

    // Saat dialog dibuka: reset form dan state agar isian kosong (hanya placeholder terlihat)
    useEffect(() => {
        if (open) {
            formRef.current?.reset()
            setResult(null)
            setEnabled({})
            setAssignments({})
        }
    }, [open])

    async function handleSubmit(formData: FormData) {
        setResult(null)
        const walletAssignments: { walletId: string; role: string }[] = []
        for (const w of adminWallets) {
            if (!enabled[w.id]) continue
            const role = assignments[w.id] ?? "viewer"
            if (role && role !== "none") {
                walletAssignments.push({ walletId: w.id, role })
            }
        }
        formData.set("walletAssignments", JSON.stringify(walletAssignments))
        const res = await createUserByAdmin(formData)
        if (res?.error) setResult({ error: res.error })
        else if (res?.success) {
            setResult({ success: true, message: res.message ?? "Akun berhasil dibuat." })
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Tambah akun baru
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" /> Tambah User Baru
                    </DialogTitle>
                </DialogHeader>
                <p className="text-sm text-slate-600 dark:text-slate-400 -mt-2">
                    Buat akun (email + password) dan pilih wallet yang boleh diakses. User hanya melihat wallet yang Anda centang.
                </p>
                <form ref={formRef} action={handleSubmit} className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="new-user-email">Email</Label>
                            <Input
                                id="new-user-email"
                                name="email"
                                type="email"
                                placeholder="(isi email)"
                                required
                                autoComplete="off"
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-user-password">Password</Label>
                            <Input
                                id="new-user-password"
                                name="password"
                                type="password"
                                placeholder="(isi password)"
                                required
                                minLength={6}
                                autoComplete="new-password"
                                className="h-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Pilih wallet yang boleh diakses user (centang + atur role)</Label>
                        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-3 max-h-[320px] overflow-y-auto">
                            {allWalletsWithRole.map((w) => {
                                const isAdmin = adminWalletIds.has(w.id)
                                return (
                                    <div
                                        key={w.id}
                                        className={`flex flex-wrap items-center justify-between gap-2 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 ${!isAdmin ? "opacity-70" : ""}`}
                                    >
                                        <label className={`flex items-center gap-2 ${isAdmin ? "cursor-pointer" : "cursor-not-allowed"}`}>
                                            <input
                                                type="checkbox"
                                                checked={enabled[w.id] ?? false}
                                                onChange={(e) =>
                                                    isAdmin && setEnabled((prev) => ({ ...prev, [w.id]: e.target.checked }))
                                                }
                                                disabled={!isAdmin}
                                                className="rounded border-slate-300"
                                            />
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                {w.name}
                                            </span>
                                            {!isAdmin && (
                                                <span className="text-xs text-slate-500 dark:text-slate-400" title="Hanya admin wallet yang bisa memilih wallet ini untuk user baru">
                                                    (Anda: {w.role.charAt(0).toUpperCase() + w.role.slice(1)} — tidak bisa dipilih)
                                                </span>
                                            )}
                                        </label>
                                        <Select
                                            value={assignments[w.id] ?? "viewer"}
                                            onValueChange={(v) =>
                                                isAdmin && setAssignments((prev) => ({ ...prev, [w.id]: v }))
                                            }
                                            disabled={!isAdmin || !enabled[w.id]}
                                        >
                                            <SelectTrigger className="h-9 w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="viewer">Viewer</SelectItem>
                                                <SelectItem value="editor">Editor</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )
                            })}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Semua wallet tampil di atas. Hanya wallet dimana Anda <strong>Admin</strong> yang bisa dicentang. User baru hanya akan melihat wallet yang dicentang.
                        </p>
                    </div>

                    {result?.error && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                            {result.error}
                        </div>
                    )}
                    {result?.success && result?.message && (
                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm text-green-700 dark:text-green-300">
                            {result.message}
                        </div>
                    )}

                    <CreateUserButton />
                </form>
            </DialogContent>
        </Dialog>
    )
}

function CreateUserButton() {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            disabled={pending}
            className="h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
            {pending ? "Membuat akun…" : "Buat Akun User"}
        </Button>
    )
}
