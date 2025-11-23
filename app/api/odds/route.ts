import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sport = searchParams.get("sport")

  if (!sport) {
    return NextResponse.json({ error: "MISSING SPORT PARAMETER" })
  }

  const apiKey = process.env.ODDS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "ODDS_API_KEY MISSING" })
  }

  return NextResponse.json({
    ok: true,
    sport,
    message: "API endpoint deployed correctly"
  })
}
