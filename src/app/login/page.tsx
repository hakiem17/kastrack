import { login } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wallet } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const errorParam = searchParams?.error
    const error = typeof errorParam === 'string' ? errorParam : Array.isArray(errorParam) ? errorParam[0] : undefined
    const redirectParam = typeof searchParams?.redirect === 'string' ? searchParams.redirect : undefined

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

            <div className="w-full max-w-md relative z-10 px-4">
                <Card className="shadow-2xl border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
                    <CardHeader className="space-y-6 text-center pb-8">
                        <Link href="/" className="inline-block">
                            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/50 hover:scale-105 transition-transform">
                                <Wallet className="h-10 w-10 text-white" />
                            </div>
                        </Link>
                        <div>
                            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Selamat Datang
                            </CardTitle>
                            <CardDescription className="text-lg mt-3 text-slate-600 dark:text-slate-400">
                                Masuk ke akun KasTrack Anda
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form action={login} className="grid gap-6">
                            {redirectParam && <input type="hidden" name="redirect" value={redirectParam} />}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="nama@email.com" required className="h-12 border-2 focus:border-blue-500 transition-colors text-base" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</Label>
                                <Input id="password" name="password" type="password" placeholder="Masukkan password Anda" required className="h-12 border-2 focus:border-blue-500 transition-colors text-base" />
                            </div>
                            {error && (
                                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
                                    <span>{error}</span>
                                </div>
                            )}
                            <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg shadow-blue-500/50">
                                Masuk ke Dashboard
                            </Button>
                        </form>
                        <div className="text-center mt-4">
                            <Link href="/" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                ← Kembali ke Beranda
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
