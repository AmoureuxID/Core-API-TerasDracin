import { NextResponse } from "next/server";
import { fetchUpstream } from "@/app/api/_lib/upstream";
import { rateLimit } from "@/app/api/_lib/rate-limit";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const res = await fetchUpstream(`/comic/chapter/${params.slug}`, {
    cache: "no-store"
  });

  return NextResponse.json(await res.json());
}
