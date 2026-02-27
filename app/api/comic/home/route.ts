import { NextResponse } from "next/server";
import { fetchUpstream } from "@/app/api/_lib/upstream";

export async function GET() {
  const res = await fetchUpstream("/comic/homepage", {
    revalidate: 300
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }

  return NextResponse.json(await res.json());
}
