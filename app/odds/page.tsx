import OpportunitiesView from "@/app/components/OpportunitiesView";
import { getOpportunities } from "@/lib/arbitrage";

export const revalidate = 0;

export default async function OddsPage() {
  let results: any[] = [];

  try {
    results = await getOpportunities();
  } catch (err) {
    console.error("Failed to load opportunities server-side", err);
  }

  return (
    <div className="odds-shell">
      <main>
        <OpportunitiesView initialResults={results} />
      </main>
    </div>
  );
}
