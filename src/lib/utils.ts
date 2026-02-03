import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  // Format Rupiah Indonesia secara konsisten antara server & client
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

  // Normalisasi: selalu pakai satu spasi biasa setelah "Rp"
  // Beberapa runtime memakai non‑breaking space / tidak ada spasi → bisa sebabkan error hydration
  return formatted.replace(/^Rp[\s\u00A0]*/, "Rp ")
}
