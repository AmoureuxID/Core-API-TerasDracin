# Instruksi Implementasi API Proxy (Vercel Serverless)

Dokumen ini adalah **panduan langkah demi langkah** untuk membuat API proxy Sankavollerei menggunakan **Next.js + Vercel serverless**.

---

## 1. Prasyarat

- Node.js 18+
- Next.js 13+ (App Router)
- Akun Vercel

---

## 2. Struktur Folder

Gunakan struktur berikut:

```
app/
 └── api/
     └── comic/
         ├── home/
         │   └── route.ts
         ├── search/
         │   └── route.ts
         ├── detail/
         │   └── [slug]/route.ts
         └── chapter/
             └── [slug]/route.ts
```

---

## 3. Endpoint Homepage

```ts
import { NextResponse } from "next/server";

const BASE = "https://www.sankavollerei.com";

export async function GET() {
  try {
    const res = await fetch(`${BASE}/comic/homepage`, {
      next: { revalidate: 300 },
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Upstream error" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

---

## 4. Endpoint Search

```ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const res = await fetch(
    `https://www.sankavollerei.com/comic/search?q=${encodeURIComponent(q)}`,
    { next: { revalidate: 60 } }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
```

---

## 5. Endpoint Detail

```ts
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const res = await fetch(
    `https://www.sankavollerei.com/comic/comic/${params.slug}`,
    { next: { revalidate: 600 } }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
```

---

## 6. Endpoint Chapter

```ts
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const res = await fetch(
    `https://www.sankavollerei.com/comic/chapter/${params.slug}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
```

---

## 7. Aturan Penting

- Jangan membuat endpoint proxy dinamis (?url=)
- Jangan proxy image melalui serverless
- Jangan expose base API ke client
- Gunakan cache sehemat mungkin

---

## 8. Rekomendasi Lanjutan

- Tambahkan rate limit (Upstash Redis)
- Tambahkan API key internal
- Tambahkan fallback response

---

End of instruksi_doc.md

