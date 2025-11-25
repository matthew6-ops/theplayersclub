import OpportunitiesView from "@/app/components/OpportunitiesView";
import { getOpportunities } from "@/lib/arbitrage";
import { GameOpportunity } from "@/lib/types";

export const revalidate = 0;

export default async function OddsPage() {
  let opportunities: GameOpportunity[] = [];

  try {
    opportunities = await getOpportunities();
  } catch (err) {
    console.error("Unable to load opportunities", err);
  }

  return (
    <main className="min-h-screen w-full bg-[#0b0f19] text-white">
      <div className="relative pt-10 pb-20">
        <div className="pointer-events-none absolute inset-0 blur-[200px] opacity-60">
          <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-[#22d3ee]/30" />
          <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-[#facc15]/25" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <OpportunitiesView initialResults={opportunities} />
        </div>
      </div>
    </main>
  );
}
