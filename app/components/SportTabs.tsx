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
    <div className="-mx-4 border-b border-slate-900/60 bg-[#050509]/90 px-4 pb-2 pt-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {allTabs.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => onChange(s.key)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 font-medium transition ${
              activeSport === s.key
                ? "bg-emerald-500 text-black shadow shadow-emerald-500/40"
                : "bg-[#111119] text-slate-300 hover:bg-[#151521]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
