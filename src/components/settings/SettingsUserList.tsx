import type { ActiveUserWithWallets } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface SettingsUserListProps {
    users: ActiveUserWithWallets[]
    currentUserId: string | null
}

function shortId(id: string) {
    return id.slice(0, 8) + "…"
}

export function SettingsUserList({ users, currentUserId }: SettingsUserListProps) {
    return (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold">Daftar User Aktif</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    User yang punya akses ke wallet yang Anda admin, beserta role dan wallet yang dibolehkan.
                </p>
            </CardHeader>
            <CardContent>
                {users.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">
                        Belum ada user lain di wallet yang Anda admin.
                    </p>
                ) : (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                        User
                                    </TableHead>
                                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                        Rule (role per wallet)
                                    </TableHead>
                                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                        Wallet yang dibolehkan
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow
                                        key={u.user_id}
                                        className="border-b border-slate-100 dark:border-slate-800"
                                    >
                                        <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                                            {u.user_id === currentUserId ? (
                                                <span>Anda</span>
                                            ) : (
                                                shortId(u.user_id)
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-700 dark:text-slate-300">
                                            <ul className="list-none space-y-1">
                                                {u.wallets.map((w) => (
                                                    <li key={w.walletId} className="text-sm">
                                                        <span className="font-medium text-slate-600 dark:text-slate-400">
                                                            {w.walletName}:
                                                        </span>{" "}
                                                        <span
                                                            className={
                                                                w.role === "admin"
                                                                    ? "text-amber-600 dark:text-amber-400"
                                                                    : w.role === "editor"
                                                                      ? "text-blue-600 dark:text-blue-400"
                                                                      : "text-slate-500 dark:text-slate-400"
                                                            }
                                                        >
                                                            {w.role.charAt(0).toUpperCase() + w.role.slice(1)}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell className="text-slate-700 dark:text-slate-300">
                                            <div className="flex flex-wrap gap-1">
                                                {u.wallets.map((w) => (
                                                    <span
                                                        key={w.walletId}
                                                        className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300"
                                                    >
                                                        {w.walletName}
                                                    </span>
                                                ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
