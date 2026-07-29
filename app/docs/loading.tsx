/**
 * Without a loading boundary, a client navigation to a route that has not been
 * prefetched leaves the previous page on screen with no feedback, which reads
 * as a frozen UI rather than a loading one. This skeleton mirrors the DocShell
 * layout so the swap does not shift the page.
 */
export default function DocsLoading() {
  return (
    <div className="flex animate-pulse gap-10" aria-busy>
      <div className="min-w-0 flex-1 pb-16">
        <div className="mb-10 flex flex-col gap-3">
          <div className="h-10 w-2/3 rounded-lg bg-muted" />
          <div className="h-6 w-full max-w-2xl rounded-lg bg-muted" />
        </div>

        <div className="flex flex-col gap-12">
          {[0, 1, 2].map((section) => (
            <div key={section} className="flex flex-col gap-5">
              <div className="h-7 w-40 rounded-lg bg-muted" />
              <div className="h-4 w-full max-w-2xl rounded bg-muted" />
              <div className="h-40 w-full rounded-xl border-2 border-border bg-card" />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden w-52 shrink-0 xl:block">
        <div className="sticky top-24 flex flex-col gap-2">
          <div className="mb-1 h-3 w-24 rounded bg-muted" />
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="h-4 w-full rounded bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}
