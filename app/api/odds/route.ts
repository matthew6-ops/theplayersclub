// app/api/odds/route.ts
import { NextResponse } from "next/server"
import {
  getCachedOdds,
  setCachedOdds,
  getCacheTtlMs
} from "../../../lib/oddsCache"

// Map friendly UI sport codes → Odds API sport keys
const SPORT_MAP: Record<string, string> = {
  nba: "basketball_nba",
  nfl: "americanfootball_nfl",
  nhl: "icehockey_nhl",
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const sport = searchParams.get("sport")
  const marketsParam = searchParams.get("markets") ?? "h2h,spreads,totals"
  const force = searchParams.get("force") === "1"

  if (!sport) {
    return NextResponse.json(
      { error: "SPORT_MISSING" },
      { status: 400 }
    )
  }

  const apiSport = SPORT_MAP[sport] ?? sport // fallback if we ever pass full ID

  const apiKey = process.env.ODDS_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "ODDS_API_KEY_MISSING" },
      { status: 500 }
    )
  }

  const cacheKey = `${apiSport}|${marketsParam}`

  // 1) Try cache first (unless force refresh)
  if (!force) {
    const cached = getCachedOdds(cacheKey)
    if (cached) {
      const cachedPayload: any = cached.data
      const oddsFromCache = Array.isArray(cachedPayload?.odds)
        ? cachedPayload.odds
        : cachedPayload
      return NextResponse.json({
        ok: true,
        source: "cache",
        sport: apiSport,
        markets: marketsParam.split(","),
        ageMs: cached.ageMs,
        ttlMs: getCacheTtlMs(),
        odds: oddsFromCache,
      })
    }
  }

  // 2) Cache miss or force refresh → call The Odds API
  const url = new URL(
    `https://api.the-odds-api.com/v4/sports/${apiSport}/odds`
  )

  url.searchParams.set("apiKey", apiKey)
  url.searchParams.set("regions", "us")
  url.searchParams.set("markets", marketsParam)
  url.searchParams.set("oddsFormat", "decimal")
  url.searchParams.set("bookmakers", "fanduel,draftkings,betmgm,caesars")

  const upstreamRes = await fetch(url.toString(), {
    cache: "no-store",
  })

  if (!upstreamRes.ok) {
    const text = await upstreamRes.text()
    return NextResponse.json(
      {
        error: "ODDS_API_REQUEST_FAILED",
        status: upstreamRes.status,
        body: text,
      },
      { status: 500 }
    )
  }

  const oddsJson = await upstreamRes.json()

  // Also pull real-time scoreboard data for current sport so we can
  // show game status (quarter, clock, etc.) alongside the odds list.
  let scoreboardJson: any[] = []
  try {
    const scoreboardUrl = new URL(
      `https://api.the-odds-api.com/v4/sports/${apiSport}/scores`
    )
    scoreboardUrl.searchParams.set("apiKey", apiKey)
    scoreboardUrl.searchParams.set("daysFrom", "2")

    const scoreboardRes = await fetch(scoreboardUrl.toString(), {
      cache: "no-store",
    })

    if (scoreboardRes.ok) {
      scoreboardJson = await scoreboardRes.json()
    }
  } catch (err) {
    console.error("Failed to load scoreboard data", err)
  }

  const scoreboardMap = new Map<string, any>()
  scoreboardJson.forEach((game: any) => {
    if (!game) return
    const key = game.id ?? `${game.home_team}|${game.away_team}`
    if (key) {
      scoreboardMap.set(key, game)
    }
  })

  const oddsWithScoreboard = oddsJson.map((game: any) => {
    const scoreboard =
      scoreboardMap.get(game.id) ??
      scoreboardMap.get(`${game.home_team}|${game.away_team}`)

    return {
      ...game,
      scoreboard,
    }
  })

  // 3) Save to cache
  setCachedOdds(cacheKey, {
    odds: oddsWithScoreboard,
  })

  return NextResponse.json({
    ok: true,
    source: "live",
    sport: apiSport,
    markets: marketsParam.split(","),
    ageMs: 0,
    ttlMs: getCacheTtlMs(),
    odds: oddsWithScoreboard,
  })
}
