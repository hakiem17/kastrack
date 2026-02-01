"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CreditCard, FileText, LogOut, Tags, Wallet, Settings } from "lucide-react"
import { logout } from "@/app/login/actions"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Transaksi", href: "/transactions", icon: CreditCard },
    { name: "Kategori", href: "/categories", icon: Tags },
    { name: "Laporan", href: "/reports", icon: FileText },
    { name: "Dompet", href: "/wallets", icon: Wallet },
    { name: "Pengaturan", href: "/settings", icon: Settings },
]

export function Navbar() {
    const pathname = usePathname()

    // Hide Navbar on login and landing page
    if (pathname === '/login' || pathname === '/' || pathname === '/landing') return null

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 backdrop-blur-xl shadow-xl z-50">
                <div className="flex h-20 items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <span className="text-white font-bold text-lg">K</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">KasTrack</span>
                </div>
                <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                    isActive 
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30" 
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                                }`}
                            >
                                <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4 space-y-2">
                        <div className="flex items-center justify-between px-4 py-2">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Tema</span>
                            <ThemeToggle />
                        </div>
                        <form action={logout}>
                            <button
                                type="submit"
                                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Keluar</span>
                            </button>
                        </form>
                    </div>
                </nav>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-20 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-2xl flex items-center justify-around px-2 pb-safe">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${
                                isActive 
                                    ? "text-blue-600 dark:text-blue-400" 
                                    : "text-slate-600 dark:text-slate-400"
                            }`}
                        >
                            <div className={`p-2 rounded-xl transition-all duration-200 ${
                                isActive 
                                    ? "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30" 
                                    : ""
                            }`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <span className={`text-[10px] font-semibold ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`}>{item.name}</span>
                        </Link>
                    )
                })}
                <form action={logout} className="w-full h-full flex-1">
                    <button 
                        type="submit" 
                        className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                        <div className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                            <LogOut className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-semibold">Keluar</span>
                    </button>
                </form>
            </nav>
        </>
    )
}
