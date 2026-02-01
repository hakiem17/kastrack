/* eslint-disable no-restricted-globals */
const CACHE_NAME = "kasbidang-v1"

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

    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cached) => {
                if (cached) return cached
                return fetch(event.request).then((response) => {
                    const url = new URL(event.request.url)
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
