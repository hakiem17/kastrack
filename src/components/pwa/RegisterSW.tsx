"use client"

import { useEffect } from "react"

export function RegisterSW() {
    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            "serviceWorker" in navigator
        ) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((reg) => {
                    if (reg.installing) {
                        console.log("[PWA] Service worker installing")
                    } else if (reg.waiting) {
                        console.log("[PWA] Service worker waiting")
                    } else if (reg.active) {
                        console.log("[PWA] Service worker active")
                    }
                })
                .catch((err) => {
                    console.warn("[PWA] Service worker registration failed:", err)
                })
        }
    }, [])
    return null
}
