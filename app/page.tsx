"use client"

import { useState } from "react"
import SportTabs from "./components/SportTabs"

export default function HomePage() {
  const [sport, setSport] = useState<"nba" | "nfl" | "nhl">("nba")

  return (
    <main className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Odds Dashboard</h1>

      <SportTabs selected={sport} onChange={setSport} />

      <div className="mt-6 text-neutral-300">
        Selected Sport: <span className="font-semibold">{sport}</span>
      </div>
    </main>
  )
}
