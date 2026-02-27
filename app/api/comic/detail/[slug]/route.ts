import { NextResponse } from "next/server";
import { fetchUpstream } from "@/app/api/_lib/upstream";

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  const res = await fetchUpstream(`/comic/comic/${params.slug}`, {
    revalidate: 600
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(await res.json());
}
