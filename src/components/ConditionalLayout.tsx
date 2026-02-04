"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "./Navbar"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    
    // Landing page and login page don't need navbar and main wrapper
    const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/landing' || pathname === '/invite' || pathname.startsWith('/invite')
    
    if (isPublicPage) {
        return <>{children}</>
    }
    
    return (
        <>
            <Navbar />
            <main className="lg:ml-64 lg:p-8 p-4 pb-24 lg:pb-8 min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                {children}
            </main>
        </>
    )
}
