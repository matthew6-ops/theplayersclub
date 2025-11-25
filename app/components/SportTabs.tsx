"use client";

type SportTabsProps = {
  activeSport: string;
  onChange: (sport: string) => void;
  sports: { key: string; label: string }[];
};

export default function SportTabs({
  activeSport,
  onChange,
  sports,
}: SportTabsProps) {
  const allTabs = [{ key: "all", label: "All" }, ...sports];

  return (
    <div className="sport-tabs">
      {allTabs.map((s) => (
        <button
          key={s.key}
          type="button"
          className={`sport-tab${activeSport === s.key ? " active" : ""}`}
          onClick={() => onChange(s.key)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
