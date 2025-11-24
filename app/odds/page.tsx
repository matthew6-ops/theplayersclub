import OpportunitiesView from "@/app/components/OpportunitiesView";

export const revalidate = 0;

async function fetchResults() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/opportunities`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];
  return res.json();
}

export default async function OpportunitiesPage() {
  const results = await fetchResults();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <OpportunitiesView initialResults={results} />
      </main>
    </div>
  );
}
