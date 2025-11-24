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
"[project]/lib/oddsCache.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/oddsCache.ts
__turbopack_context__.s([
    "getCacheTtlMs",
    ()=>getCacheTtlMs,
    "getCachedOdds",
    ()=>getCachedOdds,
    "setCachedOdds",
    ()=>setCachedOdds
]);
const CACHE_TTL_MS = 15_000 // 15 seconds – tweak as needed
;
const cache = new Map();
function getCachedOdds(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    const ageMs = Date.now() - entry.updatedAt;
    if (ageMs > CACHE_TTL_MS) {
        return null;
    }
    return {
        data: entry.data,
        ageMs
    };
}
function setCachedOdds(key, data) {
    cache.set(key, {
        data,
        updatedAt: Date.now()
    });
}
function getCacheTtlMs() {
    return CACHE_TTL_MS;
}
}),
"[project]/app/api/odds/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/api/odds/route.ts
__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsCache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/oddsCache.ts [app-route] (ecmascript)");
;
;
// Map friendly UI sport codes → Odds API sport keys
const SPORT_MAP = {
    nba: "basketball_nba",
    nfl: "americanfootball_nfl",
    nhl: "icehockey_nhl"
};
async function GET(req) {
    const { searchParams } = new URL(req.url);
    const sport = searchParams.get("sport");
    const marketsParam = searchParams.get("markets") ?? "h2h,spreads,totals";
    const force = searchParams.get("force") === "1";
    if (!sport) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "SPORT_MISSING"
        }, {
            status: 400
        });
    }
    const apiSport = SPORT_MAP[sport] ?? sport // fallback if we ever pass full ID
    ;
    const apiKey = process.env.ODDS_API_KEY;
    if (!apiKey) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "ODDS_API_KEY_MISSING"
        }, {
            status: 500
        });
    }
    const cacheKey = `${apiSport}|${marketsParam}`;
    // 1) Try cache first (unless force refresh)
    if (!force) {
        const cached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsCache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCachedOdds"])(cacheKey);
        if (cached) {
            const cachedPayload = cached.data;
            const oddsFromCache = Array.isArray(cachedPayload?.odds) ? cachedPayload.odds : cachedPayload;
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: true,
                source: "cache",
                sport: apiSport,
                markets: marketsParam.split(","),
                ageMs: cached.ageMs,
                ttlMs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsCache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCacheTtlMs"])(),
                odds: oddsFromCache
            });
        }
    }
    // 2) Cache miss or force refresh → call The Odds API
    const url = new URL(`https://api.the-odds-api.com/v4/sports/${apiSport}/odds`);
    url.searchParams.set("apiKey", apiKey);
    url.searchParams.set("regions", "us");
    url.searchParams.set("markets", marketsParam);
    url.searchParams.set("oddsFormat", "decimal");
    url.searchParams.set("bookmakers", "fanduel,draftkings,betmgm,caesars");
    const upstreamRes = await fetch(url.toString(), {
        cache: "no-store"
    });
    if (!upstreamRes.ok) {
        const text = await upstreamRes.text();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "ODDS_API_REQUEST_FAILED",
            status: upstreamRes.status,
            body: text
        }, {
            status: 500
        });
    }
    const oddsJson = await upstreamRes.json();
    // Also pull real-time scoreboard data for current sport so we can
    // show game status (quarter, clock, etc.) alongside the odds list.
    let scoreboardJson = [];
    try {
        const scoreboardUrl = new URL(`https://api.the-odds-api.com/v4/sports/${apiSport}/scores`);
        scoreboardUrl.searchParams.set("apiKey", apiKey);
        scoreboardUrl.searchParams.set("daysFrom", "2");
        const scoreboardRes = await fetch(scoreboardUrl.toString(), {
            cache: "no-store"
        });
        if (scoreboardRes.ok) {
            scoreboardJson = await scoreboardRes.json();
        }
    } catch (err) {
        console.error("Failed to load scoreboard data", err);
    }
    const scoreboardMap = new Map();
    scoreboardJson.forEach((game)=>{
        if (!game) return;
        const key = game.id ?? `${game.home_team}|${game.away_team}`;
        if (key) {
            scoreboardMap.set(key, game);
        }
    });
    const oddsWithScoreboard = oddsJson.map((game)=>{
        const scoreboard = scoreboardMap.get(game.id) ?? scoreboardMap.get(`${game.home_team}|${game.away_team}`);
        return {
            ...game,
            scoreboard
        };
    });
    // 3) Save to cache
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsCache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setCachedOdds"])(cacheKey, {
        odds: oddsWithScoreboard
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true,
        source: "live",
        sport: apiSport,
        markets: marketsParam.split(","),
        ageMs: 0,
        ttlMs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$oddsCache$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCacheTtlMs"])(),
        odds: oddsWithScoreboard
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a4ba2dd1._.js.map