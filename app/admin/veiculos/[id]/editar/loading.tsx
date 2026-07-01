export default function LoadingEditar() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 space-y-2">
        <div className="h-3 w-12 bg-c-border rounded-sm" />
        <div className="h-7 w-56 bg-c-border rounded-sm" />
      </div>
      <div className="flex flex-col gap-6 max-w-3xl">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-c-surface rounded-xl shadow-card p-5">
            <div className="h-3 w-28 bg-c-border rounded-sm mb-4 pb-3 border-b border-c-border2" />
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="space-y-1.5">
                  <div className="h-2.5 w-16 bg-c-surface2 rounded-sm" />
                  <div className="h-10 w-full bg-c-surface2 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
