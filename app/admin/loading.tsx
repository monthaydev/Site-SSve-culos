export default function LoadingDashboard() {
  return (
    <div className="max-w-5xl space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-12 bg-c-border rounded-sm" />
          <div className="h-7 w-36 bg-c-border rounded-sm" />
        </div>
        <div className="h-9 w-28 bg-c-border rounded-sm" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-c-surface rounded-xl shadow-card p-5 flex flex-col gap-4">
            <div className="w-5 h-5 bg-c-border rounded-sm" />
            <div className="space-y-2">
              <div className="h-9 w-12 bg-c-border rounded-sm" />
              <div className="h-3 w-24 bg-c-surface2 rounded-sm" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-c-surface rounded-xl shadow-card p-5 space-y-4">
            <div className="h-3 w-40 bg-c-surface2 rounded-sm" />
            <div className="h-9 w-48 bg-c-border rounded-sm" />
            <div className="h-3 w-24 bg-c-surface2 rounded-sm" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="h-4 w-48 bg-c-border rounded-sm" />
        <div className="bg-c-surface rounded-xl shadow-card divide-y divide-c-border2 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <div className="w-10 h-7 bg-c-surface2 rounded-md shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-48 bg-c-border rounded-sm" />
                <div className="h-3 w-32 bg-c-surface2 rounded-sm" />
              </div>
              <div className="h-3 w-10 bg-c-surface2 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
