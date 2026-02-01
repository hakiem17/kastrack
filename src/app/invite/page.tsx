import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { InviteAcceptClient } from "@/components/settings/InviteAcceptClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function InvitePage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined }
}) {
    const token = typeof searchParams?.token === "string" ? searchParams.token : null
    const supabase = createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!token) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-4">
                <Card className="w-full max-w-md border-0 shadow-xl">
                    <CardHeader>
                        <CardTitle>Link tidak valid</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            Link undangan tidak lengkap atau tidak valid.
                        </p>
                        <Button asChild className="w-full">
                            <Link href="/dashboard">Ke Dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!user) {
        const redirectUrl = `/invite?token=${encodeURIComponent(token)}`
        const loginUrl = `/login?redirect=${encodeURIComponent(redirectUrl)}`
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-4">
                <Card className="w-full max-w-md border-0 shadow-xl">
                    <CardHeader>
                        <CardTitle>Terima undangan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-slate-600 dark:text-slate-400">
                            Silakan masuk dengan akun yang sesuai undangan untuk menerima akses wallet.
                        </p>
                        <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                            <Link href={loginUrl}>Masuk</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/">Kembali ke Beranda</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-[60vh] items-center justify-center p-4">
            <InviteAcceptClient token={token} />
        </div>
    )
}
