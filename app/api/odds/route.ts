import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sport = url.searchParams.get("sport") || "basketball_nba";
    const markets = "h2h,spreads,totals";

    const apiKey = process.env.ODDS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ODDS_API_KEY is missing" },
        { status: 500 }
      );
    }

    const apiUrl = `https://api.the-odds-api.com/v4/sports/${sport}/odds?apiKey=${apiKey}&regions=us&markets=${markets}&oddsFormat=decimal&bookmakers=fanduel,draftkings,betmgm,caesars`;

    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: "Failed to fetch Odds API", details: err },
        { status: 500 }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      sport,
      markets,
      count: data.length,
      odds: data
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unexpected server error", details: err.message },
      { status: 500 }
    );
  }
}
