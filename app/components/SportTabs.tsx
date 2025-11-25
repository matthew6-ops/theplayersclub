"use client";

type SportTabsProps = {
  activeSport: string;
  onChange: (sport: string) => void;
  sports: { key: string; label: string }[];
};

export default function SportTabs({ activeSport, onChange, sports }: SportTabsProps) {
  const tabs = [{ key: "all", label: "All" }, ...sports];

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
            activeSport === tab.key
              ? "bg-gradient-to-r from-[#facc15] to-[#f97316] text-black shadow-lg shadow-[#facc15]/50"
              : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
