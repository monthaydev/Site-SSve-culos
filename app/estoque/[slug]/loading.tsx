export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <div className="h-5 w-32 bg-c-surface2 rounded animate-pulse mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 mb-12">
        <div className="bg-c-surface2 rounded-2xl aspect-[4/3] animate-pulse" />

        <div className="flex flex-col gap-4">
          <div className="h-8 w-3/4 bg-c-surface2 rounded-lg animate-pulse" />
          <div className="h-5 w-1/2 bg-c-surface2 rounded animate-pulse" />
          <div className="h-10 w-44 bg-c-surface2 rounded-lg animate-pulse" />

          <div className="grid grid-cols-2 gap-2 mt-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-c-surface2 rounded-lg animate-pulse" />
            ))}
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <div className="h-14 bg-c-surface2 rounded-lg animate-pulse" />
            <div className="h-11 bg-c-surface2 rounded-lg animate-pulse" />
            <div className="h-11 bg-c-surface2 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
