import { NextResponse } from "next/server";
import { fetchUpstream } from "@/app/api/_lib/upstream";
import { rateLimit } from "@/app/api/_lib/rate-limit";

export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const res = await fetchUpstream(
    `/comic/search?q=${encodeURIComponent(q)}`,
    { revalidate: 60 }
  );

  return NextResponse.json(await res.json());
}
