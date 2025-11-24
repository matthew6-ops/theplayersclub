"use client"

type Sport = "nba" | "nfl" | "nhl"

interface SportTabsProps {
  selected: Sport
  onChange: (sport: Sport) => void
}

const SPORTS: Sport[] = ["nba", "nfl", "nhl"]

export default function SportTabs({ selected, onChange }: SportTabsProps) {
  return (
    <div className="flex gap-4 overflow-x-auto py-4 border-b border-neutral-800">
      {SPORTS.map((sport) => {
        const active = sport === selected

        return (
          <button
            key={sport}
            onClick={() => onChange(sport)}
            className={`
              px-4 py-2 rounded-md text-sm capitalize
              transition-colors duration-200
              ${active 
                ? "bg-blue-600 text-white" 
                : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800"}
            `}
          >
            {sport}
          </button>
        )
      })}
    </div>
  )
}
