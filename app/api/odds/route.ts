import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sport = searchParams.get("sport") || "";

  if (!sport) {
    return NextResponse.json(
      { error: "Missing sport parameter" },
      { status: 400 }
    );
  }

  const apiKey = process.env.ODDS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ODDS_API_KEY missing" },
      { status: 500 }
    );
  }

  const markets = "h2h,spreads,totals";

  const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds?apiKey=${apiKey}&regions=us&markets=${markets}&oddsFormat=decimal&bookmakers=draftkings,fanduel,betmgm,caesars`;

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      const msg = await res.text();
      return NextResponse.json(
        { error: "API request failed", details: msg },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ sport, odds: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unexpected error", details: err.message },
      { status: 500 }
    );
  }
}
