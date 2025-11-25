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
function buildBestLines(bookmakers = [], outcomes, marketKey = "h2h") {
    const best = {};
    outcomes.forEach((team)=>{
        best[team] = null;
    });
    bookmakers?.forEach((bm)=>{
        const market = bm?.markets?.find?.((m)=>m?.key === marketKey);
        market?.outcomes?.forEach((o)=>{
            if (!o?.name || typeof o.price !== "number") return;
            if (!best.hasOwnProperty(o.name)) return;
            if (!best[o.name] || o.price > (best[o.name]?.price ?? 0)) {
                best[o.name] = {
                    price: o.price,
                    bookmaker: bm?.title ?? bm?.key ?? "Book",
                    point: o.point
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
"[project]/lib/marketConfig.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MARKET_OPTIONS",
    ()=>MARKET_OPTIONS,
    "getMarketConfig",
    ()=>getMarketConfig
]);
const MARKET_OPTIONS = [
    {
        key: "h2h",
        label: "Moneyline",
        outcomes: (game)=>[
                game.away_team ?? "Away",
                game.home_team ?? "Home"
            ]
    },
    {
        key: "spreads",
        label: "Spreads",
        outcomes: (game)=>[
                game.away_team ?? "Away",
                game.home_team ?? "Home"
            ]
    },
    {
        key: "totals",
        label: "Totals",
        outcomes: ()=>[
                "Over",
                "Under"
            ]
    }
];
function getMarketConfig(key) {
    return MARKET_OPTIONS.find((m)=>m.key === key) ?? MARKET_OPTIONS[0];
}
}),
"[project]/app/components/GameCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GameCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/oddsMath.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$marketConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/marketConfig.ts [app-ssr] (ecmascript)");
"use client";
;
;
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
const formatScoreboardStatus = (scoreboard)=>{
    if (!scoreboard) return null;
    if (scoreboard.status) return scoreboard.status;
    if (scoreboard.completed) return "Final";
    if (scoreboard.in_progress) return "Live";
    return null;
};
const getTeamScore = (scoreboard, teamName, fallback)=>{
    if (!scoreboard) return null;
    const fromArray = scoreboard.scores?.find((s)=>s.name === teamName)?.score;
    if (typeof fromArray === "number") return fromArray;
    if (fallback === "home") return scoreboard.home_score ?? null;
    return scoreboard.away_score ?? null;
};
function GameCard({ game, stakeUnit, allowedBooks, viewType = "ev", oddsDisplay = "american", marketKey = "h2h" }) {
    const home = game.home_team;
    const away = game.away_team;
    const allowedSet = allowedBooks.length ? new Set(allowedBooks) : null;
    const [showAllBooks, setShowAllBooks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const filteredBooks = (game.bookmakers ?? []).filter((bm)=>{
        if (!allowedSet) return true;
        const label = bm.title ?? bm.key ?? "";
        return allowedSet.has(label);
    });
    const marketConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$marketConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMarketConfig"])(marketKey);
    const outcomeLabels = marketConfig.outcomes(game);
    const bestLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildBestLines"])(filteredBooks, outcomeLabels, marketKey);
    const bestPrices = {};
    outcomeLabels.forEach((label)=>{
        const info = bestLines[label];
        if (info?.price) {
            bestPrices[label] = info.price;
        }
    });
    const fair = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["computeFairProbabilities"])(bestPrices);
    const homeEv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calcEvPercent"])(fair[home], bestLines[home]?.price ?? undefined);
    const awayEv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calcEvPercent"])(fair[away], bestLines[away]?.price ?? undefined);
    const evPercent = [
        homeEv,
        awayEv
    ].filter((val)=>typeof val === "number").length > 0 ? Math.max(homeEv ?? -Infinity, awayEv ?? -Infinity) : null;
    const arb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calcArbBreakdown"])(bestPrices, stakeUnit);
    const arbPercent = arb?.profitPercent ?? null;
    const guaranteedProfit = typeof arbPercent === "number" && arbPercent > 0 ? stakeUnit * arbPercent / 100 : null;
    const stakeEntries = typeof arbPercent === "number" && arbPercent > 0 && arb?.stakes ? Object.entries(arb.stakes) : [];
    const hasArb = typeof arbPercent === "number" && arbPercent > 0;
    const hasPositiveEv = typeof evPercent === "number" && evPercent > 0;
    const evColor = typeof evPercent === "number" ? evPercent >= 0 ? "#36c98e" : "#f37575" : "#b8b3c7";
    const lines = outcomeLabels.map((team)=>{
        const line = bestLines[team];
        if (!line?.price) return null;
        const stakeForTeam = arb?.stakes?.[team] ?? stakeUnit;
        const simProfit = stakeForTeam * (line.price - 1);
        const pointLabel = typeof line.point === "number" ? marketKey === "spreads" ? `${line.point > 0 ? "+" : ""}${line.point}` : marketKey === "totals" ? `${line.point}` : "" : "";
        const betLabel = pointLabel ? `${team} ${pointLabel}` : team;
        return {
            team: betLabel,
            american: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decimalToAmerican"])(line.price),
            decimal: line.price,
            sportsbook: line.bookmaker ?? "Sportsbook",
            stake: arb?.stakes?.[team] ?? stakeUnit,
            highlightStake: stakeForTeam,
            simProfit
        };
    }).filter((line)=>Boolean(line));
    const bookCount = filteredBooks.length || game.bookmakers?.length || 0;
    const bookBreakdowns = filteredBooks.map((bm)=>{
        const market = bm.markets?.find((m)=>m.key === marketKey);
        return {
            title: bm.title ?? bm.key ?? "Sportsbook",
            outcomes: market?.outcomes?.map((outcome)=>({
                    team: outcome.name,
                    decimal: outcome.price,
                    american: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decimalToAmerican"])(outcome.price ?? 0)
                })) ?? []
        };
    });
    const isArbCard = viewType === "arb";
    const isEvCard = viewType === "ev";
    if (isArbCard && !hasArb) {
        return null;
    }
    if (isEvCard && !hasPositiveEv) {
        return null;
    }
    const showArbDetails = isArbCard || !viewType && hasArb;
    const showEvDetails = isEvCard || !viewType && hasPositiveEv;
    const badgeLabel = showArbDetails ? "ARB" : showEvDetails ? "+EV" : "VALUE";
    const variantClass = showArbDetails ? "opportunity-card--arb" : showEvDetails ? "opportunity-card--ev" : "opportunity-card--value";
    const statusCopy = showArbDetails ? `Bet both sides as shown to lock in ${arbPercent?.toFixed(2)}% profit.` : showEvDetails ? "Positive EV detected but the books never cross for arbitrage." : "Market vig overwhelms the edge — this matchup is expected to lose over time.";
    const metrics = [];
    if (showEvDetails && typeof evPercent === "number") {
        metrics.push({
            label: "EV %",
            value: `${evPercent.toFixed(2)}%`,
            highlight: evColor
        });
    }
    if (showArbDetails && typeof arbPercent === "number") {
        metrics.push({
            label: "Arb %",
            value: `${arbPercent.toFixed(2)}%`,
            highlight: "#facc15"
        });
    }
    if (showArbDetails && guaranteedProfit) {
        metrics.push({
            label: "Guaranteed profit",
            value: formatMoney(guaranteedProfit),
            sub: `Sim @ ${formatMoney(stakeUnit)}`
        });
    } else {
        metrics.push({
            label: "Simulated stake",
            value: formatMoney(stakeUnit)
        });
    }
    const scoreboard = game.scoreboard;
    const scoreboardStatus = formatScoreboardStatus(scoreboard);
    const homeScore = getTeamScore(scoreboard, home, "home");
    const awayScore = getTeamScore(scoreboard, away, "away");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: `opportunity-card ${variantClass}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "opportunity-card__header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "opportunity-card__sport",
                                children: (game.sport_title ?? game.sport_key).toUpperCase()
                            }, void 0, false, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 249,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: [
                                    away,
                                    " @ ",
                                    home
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 252,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "opportunity-card__time",
                                children: formatStartTime(game.commence_time)
                            }, void 0, false, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 255,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/GameCard.tsx",
                        lineNumber: 248,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "opportunity-card__badge-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "opportunity-card__badge",
                                children: badgeLabel
                            }, void 0, false, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 258,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "opportunity-card__books",
                                children: [
                                    bookCount,
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/app/components/GameCard.tsx",
                                        lineNumber: 260,
                                        columnNumber: 25
                                    }, this),
                                    "BOOKS"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 259,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/GameCard.tsx",
                        lineNumber: 257,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/GameCard.tsx",
                lineNumber: 247,
                columnNumber: 7
            }, this),
            scoreboard && scoreboardStatus && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "rounded-2xl bg-[#160d1f] border border-white/10 p-4 text-sm text-white/70 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs uppercase tracking-[0.35em] text-white/40",
                                children: "Status"
                            }, void 0, false, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 269,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold text-white",
                                children: scoreboardStatus
                            }, void 0, false, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 272,
                                columnNumber: 13
                            }, this),
                            (scoreboard.period || scoreboard.display_clock || scoreboard.clock) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-white/50",
                                children: [
                                    scoreboard.period ? `Period ${scoreboard.period}` : "",
                                    (scoreboard.display_clock || scoreboard.clock) && ` · ${scoreboard.display_clock ?? scoreboard.clock}`
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 274,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/GameCard.tsx",
                        lineNumber: 268,
                        columnNumber: 11
                    }, this),
                    typeof awayScore === "number" && typeof homeScore === "number" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-white/50",
                                        children: away
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/GameCard.tsx",
                                        lineNumber: 284,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xl font-semibold",
                                        children: awayScore
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/GameCard.tsx",
                                        lineNumber: 285,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 283,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white/40 text-lg",
                                children: ":"
                            }, void 0, false, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 287,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-white/50",
                                        children: home
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/GameCard.tsx",
                                        lineNumber: 289,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xl font-semibold",
                                        children: homeScore
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/GameCard.tsx",
                                        lineNumber: 290,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 288,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/GameCard.tsx",
                        lineNumber: 282,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/GameCard.tsx",
                lineNumber: 267,
                columnNumber: 9
            }, this),
            metrics.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "opportunity-card__metrics",
                children: metrics.map((metric)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "opportunity-card__metric-label",
                                children: metric.label
                            }, void 0, false, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 301,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                style: metric.highlight ? {
                                    color: metric.highlight
                                } : undefined,
                                children: metric.value
                            }, void 0, false, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 302,
                                columnNumber: 15
                            }, this),
                            metric.sub && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "opportunity-card__hint",
                                children: metric.sub
                            }, void 0, false, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 305,
                                columnNumber: 30
                            }, this)
                        ]
                    }, metric.label, true, {
                        fileName: "[project]/app/components/GameCard.tsx",
                        lineNumber: 300,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/GameCard.tsx",
                lineNumber: 298,
                columnNumber: 9
            }, this),
            showArbDetails && hasArb && stakeEntries.length === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "opportunity-card__lines",
                children: stakeEntries.map(([team, stake])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "line-pill",
                        children: [
                            "Stake on ",
                            team,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: formatMoney(stake)
                            }, void 0, false, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 316,
                                columnNumber: 15
                            }, this)
                        ]
                    }, team, true, {
                        fileName: "[project]/app/components/GameCard.tsx",
                        lineNumber: 314,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/GameCard.tsx",
                lineNumber: 312,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "opportunity-card__lines",
                children: lines.map((line)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "line-pill",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold",
                                children: [
                                    line.team,
                                    " @",
                                    " ",
                                    oddsDisplay === "american" ? line.american : `${line.decimal.toFixed(2)} (${(1 / line.decimal * 100).toFixed(1)}%)`
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 325,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-white/60",
                                children: [
                                    "Sportsbook: ",
                                    line.sportsbook
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 331,
                                columnNumber: 13
                            }, this),
                            showArbDetails && line.stake && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-white/60",
                                children: [
                                    "Stake: ",
                                    formatMoney(line.stake)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 333,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-white/60",
                                children: [
                                    "Sim profit: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-semibold",
                                        children: formatMoney(line.simProfit)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/GameCard.tsx",
                                        lineNumber: 338,
                                        columnNumber: 27
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/GameCard.tsx",
                                lineNumber: 337,
                                columnNumber: 13
                            }, this)
                        ]
                    }, line.team, true, {
                        fileName: "[project]/app/components/GameCard.tsx",
                        lineNumber: 324,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/GameCard.tsx",
                lineNumber: 322,
                columnNumber: 7
            }, this),
            bookBreakdowns.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `full-board-toggle${showAllBooks ? " full-board-toggle--active" : ""}`,
                        onClick: ()=>setShowAllBooks((prev)=>!prev),
                        children: showAllBooks ? "Hide full board" : "View full board"
                    }, void 0, false, {
                        fileName: "[project]/app/components/GameCard.tsx",
                        lineNumber: 346,
                        columnNumber: 11
                    }, this),
                    showAllBooks && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-x-auto rounded-3xl border border-white/10 bg-[#130c1f]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "min-w-full text-sm text-white/70",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "text-xs uppercase tracking-[0.3em] text-white/40",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-left",
                                                children: "Sportsbook"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/GameCard.tsx",
                                                lineNumber: 360,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-left",
                                                children: away
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/GameCard.tsx",
                                                lineNumber: 361,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-left",
                                                children: home
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/GameCard.tsx",
                                                lineNumber: 362,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/GameCard.tsx",
                                        lineNumber: 359,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/GameCard.tsx",
                                    lineNumber: 358,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: bookBreakdowns.map((book)=>{
                                        const awayLine = book.outcomes.find((o)=>o.team === away);
                                        const homeLine = book.outcomes.find((o)=>o.team === home);
                                        const awayBest = bestLines[away]?.price === awayLine?.decimal;
                                        const homeBest = bestLines[home]?.price === homeLine?.decimal;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "border-t border-white/5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-3 font-semibold",
                                                    children: book.title
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/GameCard.tsx",
                                                    lineNumber: 373,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: `px-4 py-3 ${awayBest ? "text-amber-200 font-semibold" : ""}`,
                                                    children: awayLine ? `${awayLine.american} (${awayLine.decimal.toFixed(2)})` : "n/a"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/GameCard.tsx",
                                                    lineNumber: 374,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: `px-4 py-3 ${homeBest ? "text-amber-200 font-semibold" : ""}`,
                                                    children: homeLine ? `${homeLine.american} (${homeLine.decimal.toFixed(2)})` : "n/a"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/GameCard.tsx",
                                                    lineNumber: 383,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, book.title, true, {
                                            fileName: "[project]/app/components/GameCard.tsx",
                                            lineNumber: 372,
                                            columnNumber: 23
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/app/components/GameCard.tsx",
                                    lineNumber: 365,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/GameCard.tsx",
                            lineNumber: 357,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/GameCard.tsx",
                        lineNumber: 356,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/GameCard.tsx",
                lineNumber: 345,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "rounded-3xl bg-[#150d22] border border-white/5 p-4 text-sm text-white/70",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs uppercase tracking-[0.3em] text-white/40 mb-1",
                        children: "Playbook"
                    }, void 0, false, {
                        fileName: "[project]/app/components/GameCard.tsx",
                        lineNumber: 403,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: statusCopy
                    }, void 0, false, {
                        fileName: "[project]/app/components/GameCard.tsx",
                        lineNumber: 406,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/GameCard.tsx",
                lineNumber: 402,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/GameCard.tsx",
        lineNumber: 246,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$GameCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/GameCard.tsx [app-ssr] (ecmascript)");
;
;
function OddsList({ results, data, stakeUnit, allowedBooks, oddsDisplay = "american" }) {
    const games = results ?? data?.odds ?? [];
    const entries = games.map((item)=>item && item.game ? {
            game: item.game,
            viewType: item.viewType,
            marketKey: item.marketKey ?? "h2h"
        } : {
            game: item,
            marketKey: "h2h"
        });
    // We aim for a 3-column layout on desktop; add placeholders
    // so rows look balanced when there are 1 or 2 items.
    const columnTarget = 3;
    const remainder = entries.length % columnTarget;
    const placeholderCount = entries.length === 0 ? columnTarget : remainder === 0 ? 0 : columnTarget - remainder;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "odds-list",
        children: [
            entries.map((entry, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$GameCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    game: entry.game,
                    stakeUnit: stakeUnit,
                    allowedBooks: allowedBooks,
                    viewType: entry.viewType,
                    oddsDisplay: oddsDisplay,
                    marketKey: entry.marketKey
                }, entry.game.id ?? `${entry.game.sport_key}-${entry.game.home_team}-${entry.game.away_team}-${idx}`, false, {
                    fileName: "[project]/app/components/OddsList.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this)),
            Array.from({
                length: placeholderCount
            }).map((_, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "opportunity-card opportunity-card--placeholder"
                }, `placeholder-${idx}`, false, {
                    fileName: "[project]/app/components/OddsList.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/OddsList.tsx",
        lineNumber: 43,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$marketConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/marketConfig.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function OpportunitiesView({ initialResults }) {
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialResults ?? []);
    const [lastUpdated, setLastUpdated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [secondsToRefresh, setSecondsToRefresh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(5);
    const [activeSport, setActiveSport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    const [opportunityTab, setOpportunityTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("ev");
    const [stakeUnit, setStakeUnit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(50);
    const [oddsDisplay, setOddsDisplay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("american");
    const [stakeInput, setStakeInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("50");
    const [bookMenuOpen, setBookMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedBooks, setSelectedBooks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [marketKey, setMarketKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("h2h");
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
    // Restore persisted UI state (sport, tab, market, odds display)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const storedSport = undefined;
        const storedTab = undefined;
        const storedMarket = undefined;
        const storedOdds = undefined;
    }, []);
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
    // Persist key UI selections so they survive full page reloads
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }, [
        activeSport
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }, [
        opportunityTab
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }, [
        marketKey
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }, [
        oddsDisplay
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
    const enrichedGames = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const base = filteredResults ?? [];
        const marketConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$marketConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMarketConfig"])(marketKey);
        return base.map((game)=>{
            const outcomes = marketConfig.outcomes(game);
            const best = computeBestPriceMap(game, activeBooks, marketConfig.key, outcomes);
            if (Object.keys(best).length < outcomes.length) return null;
            const evScore = calculateEvScoreFromBest(best);
            const arbPercent = calculateArbPercentFromBest(best);
            return {
                game,
                evScore,
                arbPercent
            };
        }).filter(Boolean);
    }, [
        filteredResults,
        activeBooks,
        marketKey
    ]);
    const arbEntries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>enrichedGames.filter((entry)=>typeof entry.arbPercent === "number" && entry.arbPercent > 0).sort((a, b)=>(b.arbPercent ?? 0) - (a.arbPercent ?? 0)).map((entry)=>({
                game: entry.game,
                viewType: "arb",
                marketKey
            })), [
        enrichedGames,
        marketKey
    ]);
    const evEntries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>enrichedGames.filter((entry)=>(entry.arbPercent == null || entry.arbPercent <= 0) && typeof entry.evScore === "number" && entry.evScore > 0).sort((a, b)=>(b.evScore ?? 0) - (a.evScore ?? 0)).map((entry)=>({
                game: entry.game,
                viewType: "ev",
                marketKey
            })), [
        enrichedGames,
        marketKey
    ]);
    const displayEntries = opportunityTab === "arb" ? arbEntries : evEntries;
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
                    setSecondsToRefresh(5);
                }
            } catch  {
            // keep last good data, user doesn't need to see the API crying
            }
        }
        refresh();
        const refreshTimer = setInterval(refresh, 5000);
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
                                lineNumber: 225,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Arbitrage Radar"
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Scan every book for two-way edges and instantly size simulated stakes."
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 227,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/OpportunitiesView.tsx",
                        lineNumber: 224,
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
                                lineNumber: 231,
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
                                lineNumber: 235,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/OpportunitiesView.tsx",
                        lineNumber: 229,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/OpportunitiesView.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bet-simulator sticky-sim",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "bet-simulator__label",
                                children: "Bet simulator"
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 241,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "bet-simulator__hint",
                                children: "Enter a bankroll to preview recommended stakes per play."
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/OpportunitiesView.tsx",
                        lineNumber: 240,
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
                            lineNumber: 245,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/OpportunitiesView.tsx",
                        lineNumber: 244,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/OpportunitiesView.tsx",
                lineNumber: 239,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "filter-chips",
                children: [
                    {
                        key: "american",
                        label: "American odds"
                    },
                    {
                        key: "decimal",
                        label: "Decimal odds"
                    }
                ].map((mode)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `filter-chip${oddsDisplay === mode.key ? " active" : ""}`,
                        onClick: ()=>setOddsDisplay(mode.key),
                        children: mode.label
                    }, mode.key, false, {
                        fileName: "[project]/app/components/OpportunitiesView.tsx",
                        lineNumber: 278,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/OpportunitiesView.tsx",
                lineNumber: 273,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SportTabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                activeSport: activeSport,
                onChange: (sport)=>setActiveSport(sport),
                sports: sports
            }, void 0, false, {
                fileName: "[project]/app/components/OpportunitiesView.tsx",
                lineNumber: 289,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "filter-chips",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$marketConfig$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MARKET_OPTIONS"].map((market)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `filter-chip${marketKey === market.key ? " active" : ""}`,
                        onClick: ()=>setMarketKey(market.key),
                        children: market.label
                    }, market.key, false, {
                        fileName: "[project]/app/components/OpportunitiesView.tsx",
                        lineNumber: 293,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/OpportunitiesView.tsx",
                lineNumber: 291,
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
                        lineNumber: 306,
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
                                lineNumber: 311,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "book-filter__menu-action",
                                onClick: ()=>setSelectedBooks([]),
                                children: "Clear all"
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 318,
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
                                                lineNumber: 330,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: book
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                                lineNumber: 343,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, book, true, {
                                        fileName: "[project]/app/components/OpportunitiesView.tsx",
                                        lineNumber: 329,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/components/OpportunitiesView.tsx",
                                lineNumber: 325,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/OpportunitiesView.tsx",
                        lineNumber: 310,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/OpportunitiesView.tsx",
                lineNumber: 305,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "filter-chips",
                children: [
                    {
                        key: "ev",
                        label: "Positive EV Bets"
                    },
                    {
                        key: "arb",
                        label: "Arbitrage Plays"
                    }
                ].map((chip)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `filter-chip${opportunityTab === chip.key ? " active" : ""}`,
                        onClick: ()=>setOpportunityTab(chip.key),
                        children: chip.label
                    }, chip.key, false, {
                        fileName: "[project]/app/components/OpportunitiesView.tsx",
                        lineNumber: 358,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/OpportunitiesView.tsx",
                lineNumber: 353,
                columnNumber: 7
            }, this),
            displayEntries.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "empty-card",
                children: "No opportunities right now."
            }, void 0, false, {
                fileName: "[project]/app/components/OpportunitiesView.tsx",
                lineNumber: 371,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$OddsList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                results: displayEntries,
                stakeUnit: stakeUnit,
                allowedBooks: activeBooks,
                oddsDisplay: oddsDisplay
            }, void 0, false, {
                fileName: "[project]/app/components/OpportunitiesView.tsx",
                lineNumber: 375,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/OpportunitiesView.tsx",
        lineNumber: 222,
        columnNumber: 5
    }, this);
}
function computeBestPriceMap(game, allowedBooks, marketKey, outcomes) {
    const allowedSet = allowedBooks?.length ? new Set(allowedBooks) : null;
    const filteredBooks = (game?.bookmakers ?? []).filter((bm)=>{
        if (!allowedSet) return true;
        return allowedSet.has(bm?.title ?? bm?.key ?? "");
    });
    const bestLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildBestLines"])(filteredBooks, outcomes, marketKey);
    const best = {};
    outcomes.forEach((outcome)=>{
        const line = bestLines[outcome];
        if (line?.price) best[outcome] = line.price;
    });
    return best;
}
function calculateEvScoreFromBest(best) {
    const outcomes = Object.keys(best);
    if (outcomes.length < 2) return null;
    const fair = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["computeFairProbabilities"])(best);
    const evs = outcomes.map((team)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calcEvPercent"])(fair[team], best[team])).filter((val)=>typeof val === "number");
    if (!evs.length) return null;
    return Math.max(...evs);
}
function calculateArbPercentFromBest(best) {
    if (Object.keys(best).length < 2) return null;
    const breakdown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsMath$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calcArbBreakdown"])(best, 100);
    return breakdown?.profitPercent ?? null;
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

//# sourceMappingURL=%5Broot-of-the-server%5D__b7fc1957._.js.map