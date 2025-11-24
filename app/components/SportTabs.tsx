"use client";

type Sport = "nba" | "nfl" | "nhl";

type SportTabsProps = {
  selected: Sport;
  onChange: (sport: Sport) => void;
};

const sports: { key: Sport; label: string }[] = [
  { key: "nba", label: "NBA" },
  { key: "nfl", label: "NFL" },
  { key: "nhl", label: "NHL" },
];

export default function SportTabs({ selected, onChange }: SportTabsProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-900/80 px-1 py-1">
      {sports.map((s) => {
        const isActive = s.key === selected;

        return (
          <button
            key={s.key}
            type="button"
            onClick={() => onChange(s.key)}
            className={[
              "px-3 py-1 text-xs font-medium rounded-full transition-colors",
              isActive
                ? "bg-emerald-500 text-black shadow"
                : "text-neutral-300 hover:bg-neutral-800",
            ].join(" ")}
          >
            {s.label.toLowerCase()}
          </button>
        );
      })}
    </div>
  );
}
