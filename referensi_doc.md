# Sankavollerei API — Proxy via Vercel (Serverless Reference)

## 1. Gambaran Umum
Dokumen ini berfungsi sebagai **referensi teknis** untuk penggunaan API Sankavollerei yang **diproxy melalui Vercel serverless**.

Tujuan:
- Menyembunyikan base API upstream
- Mengontrol endpoint yang diakses client
- Menambahkan cache & kontrol trafik
- Menghindari direct access ke API publik

Base API (upstream):
```
https://www.sankavollerei.com
```

---

## 2. Karakteristik API Upstream

Sankavollerei API adalah:
- Aggregator multi-source (comic & novel)
- Read-only (tidak ada write / auth user)
- Data hasil scraping & crawling
- Stabilitas **tidak dijamin permanen**

Implikasi:
- Response bisa berubah sewaktu-waktu
- Endpoint bisa down / timeout
- Tidak cocok diekspos langsung ke client

---

## 3. Peran Vercel Serverless

Vercel **bukan backend scraping**, melainkan:
- Thin proxy
- Cache layer
- API gateway ringan

Alur:
```
Client
  ↓
Vercel API Routes (proxy)
  ↓
Sankavollerei API
```

Yang dilakukan Vercel:
- Fetch data upstream
- Cache response (ISR / revalidate)
- Sanitasi request
- Return JSON ke client

---

## 4. Endpoint Minimum (Recommended MVP)

| Fungsi | Proxy Endpoint | Upstream |
|------|--------------|----------|
| Homepage | /api/comic/home | /comic/homepage |
| Search | /api/comic/search?q= | /comic/search |
| Detail | /api/comic/detail/:slug | /comic/comic/:slug |
| Chapter | /api/comic/chapter/:slug | /comic/chapter/:slug |

Catatan:
- Jangan expose semua endpoint
- Fokus ke discovery & reading flow

---

## 5. Cache Strategy

| Endpoint | Cache |
|--------|------|
| Home | 300–600 detik |
| Search | 60 detik |
| Detail | 600 detik |
| Chapter | no-store |

Catatan penting:
- Jangan cache image
- Chapter sebaiknya selalu fresh

---

## 6. Limitasi Serverless

Tidak disarankan:
- Infinite crawling
- Parallel fetch berat
- Image proxy
- Web scraping langsung

---

## 7. Risiko & Mitigasi

Risiko:
- Upstream down
- Timeout serverless
- Rate limit IP

Mitigasi:
- Cache agresif
- Error handling jelas
- Rate limit endpoint berat

---

## 8. Legal & Etika

API ini berada di area abu-abu.
Gunakan untuk:
- Eksperimen
- Edukasi
- MVP internal

Jangan klaim kepemilikan konten.

---

End of referensi_doc.md

