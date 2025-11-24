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
    <div className="-mx-4 border-y border-white/5 bg-white/5/0 bg-gradient-to-r from-[#0c0a12]/70 via-[#09080f]/50 to-[#0b0a14]/70 px-4 pb-3 pt-3 backdrop-blur lg:-mx-10 lg:px-10">
      <div className="flex gap-2 overflow-x-auto pb-1 text-[11px] uppercase tracking-[0.15em] text-white/70">
        {allTabs.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => onChange(s.key)}
            className={`whitespace-nowrap rounded-full px-4 py-2 font-semibold transition ${
              activeSport === s.key
                ? "bg-gradient-to-r from-[#fcd37b] to-[#f29d38] text-black shadow-lg shadow-[#fcd37b]/40"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
