/**
 * Skeleton loading untuk perpindahan menu — tampil segera saat navigasi
 * sehingga terasa lebih cepat (tanpa layar kosong).
 */
export function PageLoading() {
  return (
    <div className="animate-pulse space-y-6 p-4 lg:p-8">
      <div className="h-8 w-48 rounded-lg bg-slate-200 dark:bg-slate-700" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-xl bg-slate-200 dark:bg-slate-700"
          />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-slate-200 dark:bg-slate-700" />
    </div>
  )
}
