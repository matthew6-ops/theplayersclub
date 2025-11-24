(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/components/SportTabs.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SportTabs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function SportTabs({ activeSport, onChange, sports }) {
    const allTabs = [
        {
            key: "all",
            label: "All"
        },
        ...sports
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "sport-tabs",
        children: allTabs.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: `sport-tab${activeSport === s.key ? " active" : ""}`,
                onClick: ()=>onChange(s.key),
                children: s.label
            }, s.key, false, {
                fileName: "[project]/app/components/SportTabs.tsx",
                lineNumber: 19,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/app/components/SportTabs.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c = SportTabs;
var _c;
__turbopack_context__.k.register(_c, "SportTabs");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/OddsList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OddsList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './OpportunityCard'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
function OddsList({ results, data, stakeUnit, allowedBooks }) {
    const games = results ?? data?.odds ?? [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "opps-grid",
        children: games.map((game, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OpportunityCard, {
                game: game,
                stakeUnit: stakeUnit,
                allowedBooks: allowedBooks
            }, game.id ?? `${game.sport_key}-${game.home_team}-${game.away_team}-${idx}`, false, {
                fileName: "[project]/app/components/OddsList.tsx",
                lineNumber: 16,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/app/components/OddsList.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = OddsList;
var _c;
__turbopack_context__.k.register(_c, "OddsList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/oddsMath.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildBestLines",
    ()=>buildBestLines,
    "calcArbBreakdown",
    ()=>calcArbBreakdown,
    "calcEvPercent",
    ()=>calcEvPercent,
    "computeFairProbabilities",
    ()=>computeFairProbabilities,
    "decimalToAmerican",
    ()=>decimalToAmerican
]);
function decimalToAmerican(decimal) {
    if (!decimal || decimal <= 1) return "-";
    if (decimal >= 2) return `+${Math.round((decimal - 1) * 100)}`;
    return `${Math.round(-100 / (decimal - 1))}`;
}
function buildBestLines(bookmakers = [], teams) {
    const best = {};
    teams.forEach((team)=>{
        best[team] = null;
    });
    bookmakers?.forEach((bm)=>{
        const h2h = bm?.markets?.find?.((m)=>m?.key === "h2h");
        h2h?.outcomes?.forEach((o)=>{
            if (!o?.name || typeof o.price !== "number") return;
            if (!teams.includes(o.name)) return;
            if (!best[o.name] || o.price > (best[o.name]?.price ?? 0)) {
                best[o.name] = {
                    price: o.price,
                    bookmaker: bm?.title ?? bm?.key ?? "Book"
                };
            }
        });
    });
    return best;
}
function computeFairProbabilities(best) {
    const entries = Object.entries(best).filter(([, price])=>price > 0);
    const implied = entries.map(([team, price])=>[
            team,
            1 / price
        ]);
    const total = implied.reduce((sum, [, p])=>sum + p, 0);
    if (!total) return {};
    return implied.reduce((acc, [team, imp])=>{
        acc[team] = imp / total;
        return acc;
    }, {});
}
function calcEvPercent(fairProb, decimalOdds) {
    if (!fairProb || !decimalOdds) return null;
    const ev = fairProb * (decimalOdds - 1) - (1 - fairProb);
    return ev * 100;
}
function calcArbBreakdown(best, stake) {
    const teams = Object.keys(best);
    if (teams.length !== 2) return null;
    const [teamA, teamB] = teams;
    const priceA = best[teamA];
    const priceB = best[teamB];
    if (!priceA || !priceB) return null;
    const invA = 1 / priceA;
    const invB = 1 / priceB;
    const sum = invA + invB;
    if (sum >= 1) return null;
    const stakeA = stake * invA / sum;
    const stakeB = stake * invB / sum;
    const profitPercent = (1 - sum) * 100;
    return {
        profitPercent,
        stakes: {
            [teamA]: stakeA,
            [teamB]: stakeB
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/OpportunitiesView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OpportunitiesView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SportTabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/SportTabs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$OddsList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/OddsList.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/oddsMath.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function OpportunitiesView({ initialResults }) {
    _s();
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialResults ?? []);
    const [lastUpdated, setLastUpdated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [secondsToRefresh, setSecondsToRefresh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(15);
    const [activeSport, setActiveSport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [filterMode, setFilterMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [stakeUnit, setStakeUnit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(50);
    const [stakeInput, setStakeInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("50");
    const [bookMenuOpen, setBookMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedBooks, setSelectedBooks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const bookMenuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const API_URL = ("TURBOPACK compile-time value", "http://localhost:3001");
    // derive sports from data
    const sports = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OpportunitiesView.useMemo[sports]": ()=>{
            const map = new Map();
            for (const g of results ?? []){
                const key = g.sport_key ?? "unknown";
                const label = g.sport_title ?? key.toUpperCase();
                if (!map.has(key)) map.set(key, label);
            }
            return Array.from(map.entries()).map({
                "OpportunitiesView.useMemo[sports]": ([key, label])=>({
                        key,
                        label
                    })
            }["OpportunitiesView.useMemo[sports]"]);
        }
    }["OpportunitiesView.useMemo[sports]"], [
        results
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OpportunitiesView.useEffect": ()=>{
            if (!lastUpdated && (initialResults?.length ?? 0) > 0) {
                setLastUpdated(new Date());
            }
        }
    }["OpportunitiesView.useEffect"], [
        initialResults,
        lastUpdated
    ]);
    const filteredResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OpportunitiesView.useMemo[filteredResults]": ()=>{
            if (activeSport === "all") return results;
            return (results ?? []).filter({
                "OpportunitiesView.useMemo[filteredResults]": (g)=>g.sport_key === activeSport
            }["OpportunitiesView.useMemo[filteredResults]"]);
        }
    }["OpportunitiesView.useMemo[filteredResults]"], [
        results,
        activeSport
    ]);
    const bookmakerOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OpportunitiesView.useMemo[bookmakerOptions]": ()=>{
            const set = new Set();
            (results ?? []).forEach({
                "OpportunitiesView.useMemo[bookmakerOptions]": (game)=>{
                    (game?.bookmakers ?? []).forEach({
                        "OpportunitiesView.useMemo[bookmakerOptions]": (bm)=>{
                            const label = bm?.title ?? bm?.key;
                            if (label) set.add(label);
                        }
                    }["OpportunitiesView.useMemo[bookmakerOptions]"]);
                }
            }["OpportunitiesView.useMemo[bookmakerOptions]"]);
            return Array.from(set).sort();
        }
    }["OpportunitiesView.useMemo[bookmakerOptions]"], [
        results
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OpportunitiesView.useEffect": ()=>{
            setSelectedBooks({
                "OpportunitiesView.useEffect": (prev)=>{
                    if (prev === null) return bookmakerOptions;
                    const filtered = prev.filter({
                        "OpportunitiesView.useEffect.filtered": (book)=>bookmakerOptions.includes(book)
                    }["OpportunitiesView.useEffect.filtered"]);
                    return filtered;
                }
            }["OpportunitiesView.useEffect"]);
        }
    }["OpportunitiesView.useEffect"], [
        bookmakerOptions
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OpportunitiesView.useEffect": ()=>{
            function handleClickOutside(e) {
                if (!bookMenuRef.current) return;
                if (!(e.target instanceof Node)) return;
                if (!bookMenuRef.current.contains(e.target)) {
                    setBookMenuOpen(false);
                }
            }
            if (bookMenuOpen) {
                document.addEventListener("mousedown", handleClickOutside);
            }
            return ({
                "OpportunitiesView.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
            })["OpportunitiesView.useEffect"];
        }
    }["OpportunitiesView.useEffect"], [
        bookMenuOpen
    ]);
    const activeBooks = selectedBooks ?? bookmakerOptions;
    const preparedResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OpportunitiesView.useMemo[preparedResults]": ()=>{
            const base = filteredResults ?? [];
            const withMeta = base.map({
                "OpportunitiesView.useMemo[preparedResults].withMeta": (game)=>{
                    const evScore = calculateEvScore(game, activeBooks);
                    const valueScore = calculateValueScore(game, activeBooks);
                    return {
                        ...game,
                        _evScore: evScore,
                        _valueScore: valueScore,
                        _priorityScore: calculatePriorityScore(game, evScore, valueScore)
                    };
                }
            }["OpportunitiesView.useMemo[preparedResults].withMeta"]);
            let filtered = withMeta;
            if (filterMode === "arb") {
                filtered = filtered.filter({
                    "OpportunitiesView.useMemo[preparedResults]": (g)=>g?.arb?.exists
                }["OpportunitiesView.useMemo[preparedResults]"]);
            } else if (filterMode === "ev") {
                filtered = filtered.filter({
                    "OpportunitiesView.useMemo[preparedResults]": (g)=>Number.isFinite(g._evScore)
                }["OpportunitiesView.useMemo[preparedResults]"]);
            } else if (filterMode === "value") {
                filtered = filtered.filter({
                    "OpportunitiesView.useMemo[preparedResults]": (g)=>g._valueScore !== null
                }["OpportunitiesView.useMemo[preparedResults]"]);
            }
            const sorted = [
                ...filtered
            ].sort({
                "OpportunitiesView.useMemo[preparedResults].sorted": (a, b)=>(b?._priorityScore ?? -Infinity) - (a?._priorityScore ?? -Infinity)
            }["OpportunitiesView.useMemo[preparedResults].sorted"]);
            return sorted;
        }
    }["OpportunitiesView.useMemo[preparedResults]"], [
        filteredResults,
        filterMode,
        activeBooks
    ]);
    // auto-refresh loop
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OpportunitiesView.useEffect": ()=>{
            let cancelled = false;
            async function refresh() {
                try {
                    const res = await fetch(`${API_URL}/api/opportunities`);
                    if (!res.ok) return;
                    const json = await res.json();
                    if (!cancelled) {
                        setResults(json ?? []);
                        setLastUpdated(new Date());
                        setSecondsToRefresh(15);
                    }
                } catch  {
                // keep last good data, user doesn't need to see the API crying
                }
            }
            refresh();
            const refreshTimer = setInterval(refresh, 15000);
            const countdownTimer = setInterval({
                "OpportunitiesView.useEffect.countdownTimer": ()=>{
                    setSecondsToRefresh({
                        "OpportunitiesView.useEffect.countdownTimer": (s)=>s > 0 ? s - 1 : 0
                    }["OpportunitiesView.useEffect.countdownTimer"]);
                }
            }["OpportunitiesView.useEffect.countdownTimer"], 1000);
            return ({
                "OpportunitiesView.useEffect": ()=>{
                    cancelled = true;
                    clearInterval(refreshTimer);
                    clearInterval(countdownTimer);
                }
            })["OpportunitiesView.useEffect"];
        }
    }["OpportunitiesView.useEffect"], [
        API_URL
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "opportunities-view",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-panel",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: "Live board"
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Arbitrage Radar"
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 158,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Scan every book for two-way edges and instantly size simulated stakes."
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 159,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/OpportunitiesView.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-panel__meta",
                        children: [
                            lastUpdated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "Updated ",
                                    lastUpdated.toLocaleTimeString(undefined, {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        second: "2-digit"
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 163,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "dashboard-panel__refresh",
                                children: [
                                    "Auto refresh in ",
                                    secondsToRefresh,
                                    "s"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/OpportunitiesView.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/OpportunitiesView.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bet-simulator",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "bet-simulator__label",
                                children: "Bet simulator"
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 173,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "bet-simulator__hint",
                                children: "Enter a bankroll to preview recommended stakes per play."
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/OpportunitiesView.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bet-simulator__controls",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            className: "bet-simulator__input",
                            value: stakeInput,
                            placeholder: "50",
                            onChange: (e)=>{
                                const next = e.target.value;
                                setStakeInput(next);
                                if (next === "") {
                                    setStakeUnit(50);
                                    return;
                                }
                                const parsed = Number(next);
                                if (Number.isNaN(parsed) || parsed <= 0) {
                                    setStakeUnit(50);
                                } else {
                                    setStakeUnit(parsed);
                                }
                            },
                            onKeyDown: (e)=>{
                                if (e.key === "Enter") {
                                    e.currentTarget.blur();
                                }
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/components/OpportunitiesView.tsx",
                            lineNumber: 177,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/OpportunitiesView.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/OpportunitiesView.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SportTabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                activeSport: activeSport,
                onChange: (sport)=>setActiveSport(sport),
                sports: sports
            }, void 0, false, {
                fileName: "[project]/app/components/OpportunitiesView.tsx",
                lineNumber: 205,
                columnNumber: 7
            }, this),
            bookmakerOptions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "book-filter",
                ref: bookMenuRef,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "book-filter__button",
                        onClick: ()=>setBookMenuOpen((o)=>!o),
                        children: [
                            "Sportsbooks (",
                            activeBooks.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/OpportunitiesView.tsx",
                        lineNumber: 209,
                        columnNumber: 11
                    }, this),
                    bookMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "book-filter__menu",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "book-filter__menu-action",
                                onClick: ()=>setSelectedBooks(bookmakerOptions),
                                children: "Select all"
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 214,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "book-filter__menu-action",
                                onClick: ()=>setSelectedBooks([]),
                                children: "Clear all"
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 221,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "book-filter__options",
                                children: bookmakerOptions.map((book)=>{
                                    const checked = activeBooks.includes(book);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: checked,
                                                onChange: ()=>{
                                                    setSelectedBooks((prev)=>{
                                                        const list = prev ?? [];
                                                        if (checked) {
                                                            return list.filter((b)=>b !== book);
                                                        }
                                                        return Array.from(new Set([
                                                            ...list,
                                                            book
                                                        ]));
                                                    });
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                                lineNumber: 233,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: book
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                                lineNumber: 246,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, book, true, {
                                        fileName: "[project]/app/components/OpportunitiesView.tsx",
                                        lineNumber: 232,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 228,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/OpportunitiesView.tsx",
                        lineNumber: 213,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/OpportunitiesView.tsx",
                lineNumber: 208,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "filter-chips",
                children: [
                    {
                        key: "value",
                        label: "All bets"
                    },
                    {
                        key: "arb",
                        label: "Arb only"
                    },
                    {
                        key: "ev",
                        label: "+EV only"
                    }
                ].map((chip)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `filter-chip${filterMode === chip.key ? " active" : ""}`,
                        onClick: ()=>setFilterMode(chip.key),
                        children: chip.label
                    }, chip.key, false, {
                        fileName: "[project]/app/components/OpportunitiesView.tsx",
                        lineNumber: 262,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/OpportunitiesView.tsx",
                lineNumber: 256,
                columnNumber: 7
            }, this),
            preparedResults.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "empty-card",
                children: "No opportunities right now. Either the books are sharp, or your scraper is asleep."
            }, void 0, false, {
                fileName: "[project]/app/components/OpportunitiesView.tsx",
                lineNumber: 275,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$OddsList$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                results: preparedResults,
                stakeUnit: stakeUnit,
                allowedBooks: activeBooks
            }, void 0, false, {
                fileName: "[project]/app/components/OpportunitiesView.tsx",
                lineNumber: 280,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/OpportunitiesView.tsx",
        lineNumber: 154,
        columnNumber: 5
    }, this);
}
_s(OpportunitiesView, "GYwEhtrhrokhnpxRK847eID6neY=");
_c = OpportunitiesView;
function calculateEvScore(game, allowedBooks) {
    const home = game?.home_team;
    const away = game?.away_team;
    if (!home || !away) return null;
    const allowedSet = allowedBooks?.length ? new Set(allowedBooks) : null;
    const filteredBooks = (game?.bookmakers ?? []).filter((bm)=>{
        if (!allowedSet) return true;
        return allowedSet.has(bm?.title ?? bm?.key ?? "");
    });
    const bestLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildBestLines"])(filteredBooks, [
        home,
        away
    ]);
    const best = {};
    [
        home,
        away
    ].forEach((team)=>{
        const line = bestLines[team];
        if (line?.price) best[team] = line.price;
    });
    if (Object.keys(best).length < 2) return null;
    const fair = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeFairProbabilities"])(best);
    const homeEv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calcEvPercent"])(fair[home], best[home]);
    const awayEv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calcEvPercent"])(fair[away], best[away]);
    const evs = [
        homeEv,
        awayEv
    ].filter((val)=>typeof val === "number");
    if (!evs.length) return null;
    return Math.max(...evs);
}
function calculateValueScore(game, allowedBooks) {
    const home = game?.home_team;
    const away = game?.away_team;
    if (!home || !away) return null;
    const allowedSet = allowedBooks?.length ? new Set(allowedBooks) : null;
    const filteredBooks = (game?.bookmakers ?? []).filter((bm)=>{
        if (!allowedSet) return true;
        return allowedSet.has(bm?.title ?? bm?.key ?? "");
    });
    const bestLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildBestLines"])(filteredBooks, [
        home,
        away
    ]);
    const prices = [
        bestLines[home]?.price,
        bestLines[away]?.price
    ].filter((val)=>typeof val === "number");
    if (!prices.length) return null;
    return Math.max(...prices);
}
function calculatePriorityScore(game, evScore, valueScore) {
    const arbPercent = typeof game?.arb?.profitPercent === "number" ? game.arb.profitPercent : null;
    if (arbPercent !== null && arbPercent > 0) {
        return 3000 + arbPercent;
    }
    if (typeof evScore === "number" && evScore > 0) {
        return 2000 + evScore;
    }
    if (valueScore !== null) {
        return 1000 + valueScore;
    }
    return 0;
}
var _c;
__turbopack_context__.k.register(_c, "OpportunitiesView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_1bb4bd35._.js.map