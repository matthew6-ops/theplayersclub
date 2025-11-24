import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl w-full space-y-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
            The Players Club
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Live odds, arbitrage spotting, and +EV scouting. Dark-crypto vibes,
          but for sports degeneracy with a brain.
        </p>

        <Link
          href="/odds"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition"
        >
          Open Odds Dashboard
        </Link>

        <p className="text-xs text-slate-500">
          Paper bankroll only. If you ruin your life, that&apos;s on you.
        </p>
      </div>
    </main>
  );
}
