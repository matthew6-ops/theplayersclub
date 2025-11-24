import OpportunitiesView from "../components/OpportunitiesView";

export const revalidate = 0;

async function fetchResults() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    console.error("NEXT_PUBLIC_API_URL is not set");
    return [];
  }

  try {
    const res = await fetch(`${baseUrl}/opportunities`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("API error fetching opportunities:", res.status);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Failed to fetch opportunities:", err);
    return [];
  }
}

export default async function OddsPage() {
  const results = await fetchResults();

  return (
    <main className="min-h-screen px-4 py-6 sm:py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-400">
              The Players Club
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">
              Live Odds &amp; +EV Board
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Scan multiple books, find edge, pretend this is &quot;just data
              science.&quot;
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Paper Bankroll
            </p>
            <p className="text-lg font-semibold text-emerald-400">$10,000</p>
          </div>
        </header>

        {/* Main dashboard */}
        <section className="rounded-2xl border border-slate-800 bg-[#080810]/95 px-4 py-4 sm:px-6 sm:py-5 shadow-xl shadow-emerald-500/5">
          <OpportunitiesView initialResults={results} />
        </section>
      </div>
    </main>
  );
}
