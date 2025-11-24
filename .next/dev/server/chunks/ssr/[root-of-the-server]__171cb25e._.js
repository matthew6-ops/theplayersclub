module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/app/components/SportTabs.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SportTabs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "sport-tabs",
        children: allTabs.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
}),
"[project]/lib/oddsMath.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/app/components/OpportunityCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OpportunityCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/oddsMath.ts [app-ssr] (ecmascript)");
"use client";
;
;
const formatMoney = (value)=>value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });
const formatStartTime = (iso)=>new Date(iso).toLocaleString(undefined, {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit"
    });
function OpportunityCard({ game, allowedBooks, stakeUnit }) {
    const home = game.home_team;
    const away = game.away_team;
    const allowedSet = allowedBooks.length ? new Set(allowedBooks) : null;
    const filteredBooks = (game.bookmakers ?? []).filter((bm)=>{
        if (!allowedSet) return true;
        const label = bm.title ?? bm.key ?? "";
        return allowedSet.has(label);
    });
    const bestPrices = {};
    filteredBooks.forEach((bm)=>{
        bm.markets?.forEach((market)=>{
            if (market.key !== "h2h") return;
            market.outcomes?.forEach((outcome)=>{
                if (!outcome?.name || typeof outcome.price !== "number") return;
                if (!bestPrices[outcome.name] || outcome.price > bestPrices[outcome.name]) {
                    bestPrices[outcome.name] = outcome.price;
                }
            });
        });
    });
    const bestLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildBestLines"])(filteredBooks, [
        away,
        home
    ]);
    const fair = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["computeFairProbabilities"])(bestPrices);
    const homeEv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calcEvPercent"])(fair[home], bestLines[home]?.price ?? undefined);
    const awayEv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calcEvPercent"])(fair[away], bestLines[away]?.price ?? undefined);
    const evPercent = [
        homeEv,
        awayEv
    ].filter((val)=>typeof val === "number").length > 0 ? Math.max(homeEv ?? -Infinity, awayEv ?? -Infinity) : null;
    const arb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calcArbBreakdown"])(bestPrices, stakeUnit);
    const arbPercent = arb?.profitPercent ?? null;
    const guaranteedProfit = arbPercent && arbPercent > 0 ? stakeUnit * arbPercent / 100 : null;
    const hasArb = typeof arbPercent === "number" && arbPercent > 0;
    const hasPositiveEv = typeof evPercent === "number" && evPercent > 0;
    const evColor = typeof evPercent === "number" ? evPercent >= 0 ? "text-emerald-300" : "text-red-300" : "text-white/60";
    const statusHeading = hasArb ? `Arbitrage Found (+${arbPercent?.toFixed(2)}%)` : "No Arbitrage Found";
    const statusBody = hasArb ? "Bet both sides exactly as shown to lock in profit." : hasPositiveEv ? "Positive EV detected but opposing lines do not converge for arbitrage." : "Market vig remains too high; these odds are expected to lose over time.";
    const recommendation = hasArb ? "Recommended action: Bet both sides to lock profit." : hasPositiveEv ? "Recommended action: Consider a single-side value bet." : "Recommended action: Avoid this market.";
    const lines = [
        away,
        home
    ].map((team)=>{
        const line = bestLines[team];
        if (!line?.price) return null;
        const simProfit = stakeUnit * (line.price - 1);
        return {
            team,
            decimalOdds: line.price,
            american: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decimalToAmerican"])(line.price),
            sportsbook: line.bookmaker ?? "Sportsbook",
            simProfit
        };
    }).filter((line)=>Boolean(line));
    const stakeEntries = hasArb && arb?.stakes ? Object.entries(arb.stakes) : [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "rounded-[32px] bg-[#0c0715] text-white shadow-[0_30px_70px_rgba(0,0,0,0.65)] border border-white/10 p-6 space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs tracking-[0.4em] text-white/50 uppercase",
                        children: game.sport_title ?? game.sport_key
                    }, void 0, false, {
                        fileName: "[project]/app/components/OpportunityCard.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-2xl font-semibold",
                        children: [
                            away,
                            " @ ",
                            home
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/OpportunityCard.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-white/60",
                        children: [
                            "Starts ",
                            formatStartTime(game.commence_time)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/OpportunityCard.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/OpportunityCard.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "rounded-2xl bg-gradient-to-r from-[#1d1430] to-[#241637] p-4 space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-lg font-semibold",
                                children: statusHeading
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunityCard.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${hasArb ? "bg-amber-300/20 text-amber-200 border border-amber-300/40" : hasPositiveEv ? "bg-emerald-300/20 text-emerald-200 border border-emerald-200/40" : "bg-red-300/20 text-red-200 border border-red-200/40"}`,
                                children: hasArb ? "Guaranteed" : hasPositiveEv ? "+EV" : "Avoid"
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunityCard.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/OpportunityCard.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-white/70",
                        children: statusBody
                    }, void 0, false, {
                        fileName: "[project]/app/components/OpportunityCard.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-white/50",
                        children: recommendation
                    }, void 0, false, {
                        fileName: "[project]/app/components/OpportunityCard.tsx",
                        lineNumber: 175,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/OpportunityCard.tsx",
                lineNumber: 159,
                columnNumber: 7
            }, this),
            hasArb && guaranteedProfit && stakeEntries.length === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "rounded-2xl border border-white/10 bg-[#120b1f] p-4 grid gap-4 md:grid-cols-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs uppercase tracking-[0.25em] text-white/50",
                                children: "Guaranteed profit"
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunityCard.tsx",
                                lineNumber: 182,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-2xl font-semibold text-amber-200",
                                children: formatMoney(guaranteedProfit)
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunityCard.tsx",
                                lineNumber: 185,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/OpportunityCard.tsx",
                        lineNumber: 181,
                        columnNumber: 11
                    }, this),
                    stakeEntries.map(([team, stake])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs uppercase tracking-[0.25em] text-white/50",
                                    children: [
                                        "Stake on ",
                                        team
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/OpportunityCard.tsx",
                                    lineNumber: 191,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-lg font-semibold",
                                    children: formatMoney(stake)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/OpportunityCard.tsx",
                                    lineNumber: 194,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, team, true, {
                            fileName: "[project]/app/components/OpportunityCard.tsx",
                            lineNumber: 190,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/OpportunityCard.tsx",
                lineNumber: 180,
                columnNumber: 9
            }, this),
            !hasArb && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "rounded-2xl border border-white/10 bg-[#120b1f] p-4 space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs uppercase tracking-[0.25em] text-white/50",
                                children: "Expected Value"
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunityCard.tsx",
                                lineNumber: 204,
                                columnNumber: 13
                            }, this),
                            typeof evPercent === "number" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `text-2xl font-semibold ${evColor}`,
                                children: [
                                    evPercent.toFixed(2),
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/OpportunityCard.tsx",
                                lineNumber: 208,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/OpportunityCard.tsx",
                        lineNumber: 203,
                        columnNumber: 11
                    }, this),
                    typeof evPercent !== "number" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-white/60",
                        children: "EV data unavailable for this matchup. Lines are shown for reference."
                    }, void 0, false, {
                        fileName: "[project]/app/components/OpportunityCard.tsx",
                        lineNumber: 214,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-white/40",
                        children: [
                            "Simulation assumes bankroll of ",
                            formatMoney(stakeUnit),
                            "."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/OpportunityCard.tsx",
                        lineNumber: 218,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/OpportunityCard.tsx",
                lineNumber: 202,
                columnNumber: 9
            }, this),
            lines.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs uppercase tracking-[0.3em] text-white/45",
                        children: "Best odds available"
                    }, void 0, false, {
                        fileName: "[project]/app/components/OpportunityCard.tsx",
                        lineNumber: 227,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-3 md:grid-cols-2",
                        children: lines.map((line)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl bg-[#140c22] border border-white/10 p-4 space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold",
                                        children: [
                                            line.team,
                                            " @ ",
                                            line.american
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/OpportunityCard.tsx",
                                        lineNumber: 236,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-white/60",
                                        children: [
                                            "Sportsbook: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold",
                                                children: line.sportsbook
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/OpportunityCard.tsx",
                                                lineNumber: 240,
                                                columnNumber: 31
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/OpportunityCard.tsx",
                                        lineNumber: 239,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-white/60",
                                        children: [
                                            "Sim profit:",
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold",
                                                children: formatMoney(line.simProfit)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/OpportunityCard.tsx",
                                                lineNumber: 244,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/OpportunityCard.tsx",
                                        lineNumber: 242,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, line.team, true, {
                                fileName: "[project]/app/components/OpportunityCard.tsx",
                                lineNumber: 232,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/OpportunityCard.tsx",
                        lineNumber: 230,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/OpportunityCard.tsx",
                lineNumber: 226,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "flex items-center justify-between text-xs text-white/40",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "Stake: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: formatMoney(stakeUnit)
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunityCard.tsx",
                                lineNumber: 254,
                                columnNumber: 18
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/OpportunityCard.tsx",
                        lineNumber: 253,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        title: "Number of sportsbooks contributing to these prices",
                        children: [
                            filteredBooks.length,
                            " books scanned"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/OpportunityCard.tsx",
                        lineNumber: 256,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/OpportunityCard.tsx",
                lineNumber: 252,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/OpportunityCard.tsx",
        lineNumber: 146,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/components/OddsList.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OddsList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$OpportunityCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/OpportunityCard.tsx [app-ssr] (ecmascript)");
;
;
function OddsList({ results, data, stakeUnit, allowedBooks }) {
    const games = results ?? data?.odds ?? [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "opps-grid",
        children: games.map((game, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$OpportunityCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
}),
"[project]/app/components/OpportunitiesView.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OpportunitiesView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SportTabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/SportTabs.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$OddsList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/OddsList.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/oddsMath.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function OpportunitiesView({ initialResults }) {
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialResults ?? []);
    const [lastUpdated, setLastUpdated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [secondsToRefresh, setSecondsToRefresh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(15);
    const [activeSport, setActiveSport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    const [filterMode, setFilterMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    const [stakeUnit, setStakeUnit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(50);
    const [stakeInput, setStakeInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("50");
    const [bookMenuOpen, setBookMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedBooks, setSelectedBooks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const bookMenuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const API_URL = ("TURBOPACK compile-time value", "http://localhost:3001");
    // derive sports from data
    const sports = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const map = new Map();
        for (const g of results ?? []){
            const key = g.sport_key ?? "unknown";
            const label = g.sport_title ?? key.toUpperCase();
            if (!map.has(key)) map.set(key, label);
        }
        return Array.from(map.entries()).map(([key, label])=>({
                key,
                label
            }));
    }, [
        results
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!lastUpdated && (initialResults?.length ?? 0) > 0) {
            setLastUpdated(new Date());
        }
    }, [
        initialResults,
        lastUpdated
    ]);
    const filteredResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (activeSport === "all") return results;
        return (results ?? []).filter((g)=>g.sport_key === activeSport);
    }, [
        results,
        activeSport
    ]);
    const bookmakerOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const set = new Set();
        (results ?? []).forEach((game)=>{
            (game?.bookmakers ?? []).forEach((bm)=>{
                const label = bm?.title ?? bm?.key;
                if (label) set.add(label);
            });
        });
        return Array.from(set).sort();
    }, [
        results
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setSelectedBooks((prev)=>{
            if (prev === null) return bookmakerOptions;
            const filtered = prev.filter((book)=>bookmakerOptions.includes(book));
            return filtered;
        });
    }, [
        bookmakerOptions
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
        return ()=>document.removeEventListener("mousedown", handleClickOutside);
    }, [
        bookMenuOpen
    ]);
    const activeBooks = selectedBooks ?? bookmakerOptions;
    const preparedResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const base = filteredResults ?? [];
        const withMeta = base.map((game)=>{
            const evScore = calculateEvScore(game, activeBooks);
            const valueScore = calculateValueScore(game, activeBooks);
            return {
                ...game,
                _evScore: evScore,
                _valueScore: valueScore,
                _priorityScore: calculatePriorityScore(game, evScore, valueScore)
            };
        });
        let filtered = withMeta;
        if (filterMode === "arb") {
            filtered = filtered.filter((g)=>g?.arb?.exists);
        } else if (filterMode === "ev") {
            filtered = filtered.filter((g)=>Number.isFinite(g._evScore));
        } else if (filterMode === "value") {
            filtered = filtered.filter((g)=>g._valueScore !== null);
        }
        const sorted = [
            ...filtered
        ].sort((a, b)=>(b?._priorityScore ?? -Infinity) - (a?._priorityScore ?? -Infinity));
        return sorted;
    }, [
        filteredResults,
        filterMode,
        activeBooks
    ]);
    // auto-refresh loop
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
        const countdownTimer = setInterval(()=>{
            setSecondsToRefresh((s)=>s > 0 ? s - 1 : 0);
        }, 1000);
        return ()=>{
            cancelled = true;
            clearInterval(refreshTimer);
            clearInterval(countdownTimer);
        };
    }, [
        API_URL
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "opportunities-view",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-panel",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: "Live board"
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Arbitrage Radar"
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 158,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "dashboard-panel__meta",
                        children: [
                            lastUpdated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bet-simulator",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "bet-simulator__label",
                                children: "Bet simulator"
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 173,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bet-simulator__controls",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SportTabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                activeSport: activeSport,
                onChange: (sport)=>setActiveSport(sport),
                sports: sports
            }, void 0, false, {
                fileName: "[project]/app/components/OpportunitiesView.tsx",
                lineNumber: 205,
                columnNumber: 7
            }, this),
            bookmakerOptions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "book-filter",
                ref: bookMenuRef,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                    bookMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "book-filter__menu",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "book-filter__menu-action",
                                onClick: ()=>setSelectedBooks(bookmakerOptions),
                                children: "Select all"
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 214,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "book-filter__menu-action",
                                onClick: ()=>setSelectedBooks([]),
                                children: "Clear all"
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 221,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "book-filter__options",
                                children: bookmakerOptions.map((book)=>{
                                    const checked = activeBooks.includes(book);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                ].map((chip)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            preparedResults.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "empty-card",
                children: "No opportunities right now. Either the books are sharp, or your scraper is asleep."
            }, void 0, false, {
                fileName: "[project]/app/components/OpportunitiesView.tsx",
                lineNumber: 275,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$OddsList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
function calculateEvScore(game, allowedBooks) {
    const home = game?.home_team;
    const away = game?.away_team;
    if (!home || !away) return null;
    const allowedSet = allowedBooks?.length ? new Set(allowedBooks) : null;
    const filteredBooks = (game?.bookmakers ?? []).filter((bm)=>{
        if (!allowedSet) return true;
        return allowedSet.has(bm?.title ?? bm?.key ?? "");
    });
    const bestLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildBestLines"])(filteredBooks, [
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
    const fair = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["computeFairProbabilities"])(best);
    const homeEv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calcEvPercent"])(fair[home], best[home]);
    const awayEv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calcEvPercent"])(fair[away], best[away]);
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
    const bestLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildBestLines"])(filteredBooks, [
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
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__171cb25e._.js.map