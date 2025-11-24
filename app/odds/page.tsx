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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <OpportunitiesView initialResults={results} />
      </main>
    </div>
  );
}
