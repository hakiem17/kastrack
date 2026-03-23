/* eslint-disable no-restricted-globals */
// Bump this to force clients to drop old cached HTML/assets on deploy
const CACHE_NAME = "kastrack-v3"

self.addEventListener("install", (event) => {
    self.skipWaiting()
})

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((names) => {
            return Promise.all(
                names
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            )
        })
    )
    self.clients.claim()
})

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return
    if (event.request.url.startsWith("chrome-extension")) return
    const url = new URL(event.request.url)
    if (url.origin !== location.origin) return

    // Never cache the service worker or manifest itself (avoid update issues)
    if (url.pathname === "/sw.js" || url.pathname === "/manifest.json") {
        return
    }

    // Network-first for navigation/HTML to avoid stale pages after deploy
    const accept = event.request.headers.get("accept") || ""
    const isHtml = event.request.mode === "navigate" || accept.includes("text/html")
    const isNextData = url.searchParams.has("_rsc") || event.request.headers.get("RSC") === "1" || url.pathname.startsWith("/api/")
    
    // Network-first for HTML, Next.js page data, and APIs
    if (isHtml || isNextData) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response.status === 200) {
                        const clone = response.clone()
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
                    }
                    return response
                })
                .catch(() => caches.match(event.request).then(res => res || caches.match("/")))
        )
        return
    }

    // Cache-first for other static assets (images, fonts, scripts)
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cached) => {
                if (cached) return cached
                return fetch(event.request).then((response) => {
                    if (
                        url.origin === location.origin &&
                        response.status === 200 &&
                        response.type === "basic"
                    ) {
                        const clone = response.clone()
                        cache.put(event.request, clone)
                    }
                    return response
                })
            })
        })
    )
})
