import OpportunitiesView from "@/app/components/OpportunitiesView";

export const revalidate = 0;

async function fetchResults() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  if (!API) {
    console.error("Missing NEXT_PUBLIC_API_URL");
    return [];
  }

  const res = await fetch(`${API}/api/opportunities`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("API error fetching opportunities:", res.status);
    return [];
  }

  return res.json();
}

export default async function OddsPage() {
  const results = await fetchResults();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0b0a13] via-[#050308] to-[#010103] text-[#f7f3e6]">
      {/* glow accents */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-32 left-10 h-72 w-72 rounded-full bg-[#f5c66d]/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#6d62ff]/20 blur-[140px]" />
      </div>
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <OpportunitiesView initialResults={results} />
      </main>
    </div>
  );
}
