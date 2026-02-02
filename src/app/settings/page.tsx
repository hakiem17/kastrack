import { createClient } from "@/lib/supabase/server"
import {
    getWalletsWithRole,
    getActiveUsersWithWallets,
} from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { SettingsCreateUserForm } from "@/components/settings/SettingsCreateUserForm"
import { SettingsSetAdminAllButton } from "@/components/settings/SettingsSetAdminAllButton"
import { SettingsUserList } from "@/components/settings/SettingsUserList"

export default async function SettingsPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const walletsWithRole = await getWalletsWithRole()
    const adminWallets = walletsWithRole.filter((w) => w.role === "admin")

    if (adminWallets.length === 0) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                        Pengaturan
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Kelola user dan akses wallet
                    </p>
                </div>
                <Card className="border-0 shadow-lg">
                    <CardContent className="py-12 text-center">
                        <p className="text-slate-600 dark:text-slate-400">
                            Anda bukan admin wallet manapun. Hanya admin yang dapat menambah user dan mengatur akses wallet.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const adminWalletIds = adminWallets.map((w) => w.id)
    const activeUsers = await getActiveUsersWithWallets(adminWalletIds)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    Pengaturan
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Buat akun user dan pilih wallet yang boleh diakses. Lihat daftar user aktif, rule, dan wallet yang dibolehkan.
                </p>
            </div>

            <SettingsSetAdminAllButton
                nonAdminCount={walletsWithRole.length - adminWallets.length}
            />

            <SettingsCreateUserForm
                allWalletsWithRole={walletsWithRole}
                adminWallets={adminWallets}
            />

            <SettingsUserList users={activeUsers} currentUserId={user?.id ?? null} />
        </div>
    )
}
