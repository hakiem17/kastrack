"use client"

import { createWallet } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFormStatus } from "react-dom"
import { useFormState } from "react-dom"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button 
            type="submit" 
            disabled={pending} 
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200"
        >
            {pending ? "Sedang Membuat..." : "Buat Dompet"}
        </Button>
    )
}

// Initial state for the form
const initialState = {
    message: null,
}

export function CreateWalletForm() {
    // We use useFormState to handle the server action response (error handling)
    // createWallet signature must be (prevState: any, formData: FormData)
    // @ts-expect-error - useFormState types mismatch with Next.js 14 server actions sometimes
    const [state, formAction] = useFormState(createWallet, initialState)

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
            <Card className="w-full max-w-md border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardHeader className="text-center space-y-4 pb-6">
                    <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                        <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Selamat Datang di KasTrack
                        </CardTitle>
                        <CardDescription className="text-base mt-2">
                            Buat dompet pertama Anda untuk memulai mengelola keuangan
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-5">
                        <div className="space-y-2">
                            <Input 
                                name="name" 
                                placeholder="Nama Dompet (cth: Kas Harian)" 
                                required 
                                className="h-11 border-2 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        {state?.error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
                                {state.error}
                            </div>
                        )}
                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
