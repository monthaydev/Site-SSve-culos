export default function LoadingVeiculos() {
  return (
    <div className="max-w-6xl animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-3 w-12 bg-c-border rounded-sm" />
          <div className="h-7 w-28 bg-c-border rounded-sm" />
        </div>
        <div className="h-9 w-32 bg-c-border rounded-sm" />
      </div>

      <div className="h-10 w-full bg-c-surface2 rounded-lg mb-4" />

      <div className="hidden md:block bg-c-surface rounded-xl shadow-card overflow-hidden">
        <div className="flex items-center gap-4 px-4 py-3 border-b border-c-border2">
          {[140, 80, 48, 80, 60, 52, 60].map((w, i) => (
            <div key={i} className="h-3 bg-c-surface2 rounded-sm shrink-0" style={{ width: w }} />
          ))}
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-c-border2 last:border-0">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-9 bg-c-surface2 rounded-md shrink-0" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-32 bg-c-border rounded-sm" />
                <div className="h-3 w-20 bg-c-surface2 rounded-sm" />
              </div>
            </div>
            <div className="h-3 w-16 bg-c-surface2 rounded-sm" />
            <div className="h-3 w-10 bg-c-surface2 rounded-sm" />
            <div className="h-3 w-20 bg-c-surface2 rounded-sm" />
            <div className="h-5 w-14 bg-c-surface2 rounded-sm" />
            <div className="h-5 w-12 bg-c-surface2 rounded-sm" />
            <div className="flex gap-1">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="w-7 h-7 bg-c-surface2 rounded-sm" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="md:hidden flex flex-col gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-c-surface rounded-xl shadow-card p-4 flex gap-3">
            <div className="w-20 h-14 bg-c-surface2 rounded-md shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-36 bg-c-border rounded-sm" />
              <div className="h-3 w-24 bg-c-surface2 rounded-sm" />
              <div className="h-4 w-20 bg-c-border rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
