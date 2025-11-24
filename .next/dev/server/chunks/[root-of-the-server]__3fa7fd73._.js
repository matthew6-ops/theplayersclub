module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/arbitrage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>getOpportunities,
    "detectArbitrageWithStakes",
    ()=>detectArbitrageWithStakes,
    "getOpportunities",
    ()=>getOpportunities
]);
function detectArbitrageWithStakes(best) {
    const teams = Object.keys(best);
    if (teams.length !== 2) return null;
    const [t1, t2] = teams;
    const o1 = best[t1];
    const o2 = best[t2];
    const imp1 = 1 / o1;
    const imp2 = 1 / o2;
    const sumImp = imp1 + imp2;
    if (sumImp >= 1) return {
        exists: false
    };
    const profitPercent = (1 - sumImp) * 100;
    function stake(total) {
        const s1 = total * imp1 / sumImp;
        const s2 = total * imp2 / sumImp;
        return {
            stake1: s1,
            stake2: s2,
            guaranteedProfit: total - (s1 + s2)
        };
    }
    return {
        exists: true,
        profitPercent,
        stakeCalc: stake,
        teams: [
            t1,
            t2
        ]
    };
}
async function getOpportunities() {
    const API_KEY = process.env.ODDS_API_KEY;
    if (!API_KEY) {
        console.error("Missing ODDS_API_KEY");
        return [];
    }
    const url = `https://api.the-odds-api.com/v4/sports/basketball_nba/odds?apiKey=${API_KEY}&regions=us&markets=h2h&oddsFormat=decimal`;
    const res = await fetch(url, {
        next: {
            revalidate: 10
        }
    });
    if (!res.ok) {
        console.error("Error fetching odds:", res.status);
        return [];
    }
    const data = await res.json();
    const games = data.map((game)=>{
        const bookmakers = game.bookmakers ?? [];
        const best = {};
        bookmakers.forEach((bm)=>{
            bm.markets?.forEach((m)=>{
                if (m.key !== "h2h") return;
                m.outcomes?.forEach((o)=>{
                    if (!best[o.name] || o.price > best[o.name]) {
                        best[o.name] = o.price;
                    }
                });
            });
        });
        const arb = detectArbitrageWithStakes(best);
        return {
            id: game.id,
            sport_key: game.sport_key,
            sport_title: game.sport_title,
            home_team: game.home_team,
            away_team: game.away_team,
            commence_time: game.commence_time,
            bookmakers,
            best,
            arb
        };
    });
    return games;
}
;
}),
"[project]/app/api/opportunities/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$arbitrage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/arbitrage.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$arbitrage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOpportunities"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data);
    } catch (err) {
        console.error("API /opportunities error:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to load opportunities"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3fa7fd73._.js.map