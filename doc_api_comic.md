# 📚 Comic & Novel Public API Documentation

BASE URL: www.sankavollerei.com
Dokumentasi ini adalah **PUBLIC API DOCS** yang ditujukan untuk developer eksternal. Tidak perlu konteks internal sistem untuk mulai menggunakan API ini.

Dokumen ini merangkum seluruh endpoint **Comic API** dan **Novel API** yang tersedia, dikelompokkan secara logis agar mudah dipahami, dipelihara, dan dikembangkan.

---

## 🔥 Core Comic API (Aggregator)
Endpoint utama hasil crawling & agregasi multi‑source.

### Discovery & Homepage
- `GET /comic/homepage` — Data homepage (popular, latest, ranking)
- `GET /comic/trending` — Komik trending (multi timeframe)
- `GET /comic/random` — Komik acak (discovery)

### List & Browse
- `GET /comic/latest` / `terbaru` — Komik terbaru (pagination)
- `GET /comic/populer` — Komik populer
- `GET /comic/browse` — Browse dengan filter
- `GET /comic/type/:type` — Filter manga/manhwa/manhua
- `GET /comic/genre/:genre` — Komik per genre
- `GET /comic/genres` — List semua genre

### Search
- `GET /comic/search?q=` — Search fallback system
- `GET /comic/advanced-search` — Search multi filter

### Detail & Reader
- `GET /comic/comic/:slug` — Detail komik + chapter
- `GET /comic/chapter/:slug` — Baca chapter (images)
- `GET /comic/chapter/:slug/navigation` — Prev/next chapter

### Infinite & Realtime
- `GET /comic/unlimited` — Deep crawl (6k+ komik)
- `GET /comic/infinite` — Infinite scroll pagination
- `GET /comic/scroll` — Simulasi website scroll
- `GET /comic/realtime` — Parallel real‑time fetch

### Analytics & System
- `GET /comic/stats` — Statistik umum
- `GET /comic/fullstats` — Statistik lengkap
- `GET /comic/analytics` — Analytics detail
- `GET /comic/comparison` — Perbandingan API vs web
- `GET /comic/docs` — Statistik + dokumentasi
- `GET /comic/health` — Health check

### User Feature
- `GET /comic/favorites` — Bookmark (auth required)
- `GET /comic/recommendations` — Rekomendasi

---

## 🌐 Source‑Specific Comic APIs
Endpoint per sumber (struktur relatif seragam: home, list, search, detail, chapter).

### BacaKomik
Prefix: `/comic/bacakomik/*`
- latest, populer, top, list
- search, genres, genre
- detail, chapter
- rekomendasi, komik berwarna

### Komikstation
Prefix: `/comic/komikstation/*`
- home, list, popular, recommendation
- top-weekly, ongoing
- az-list, genres, genre
- search, manga detail, chapter

### Maid Comic
Prefix: `/comic/maid/*`
- home, list, latest
- detail, chapter
- genres, genre
- search

### Komikindo / KMKindo
Prefix: `/comic/komikindo/*`
- latest, populer, library
- search, filter, config
- detail, chapter

### Mangakita
Prefix: `/comic/mangakita/*`
- home, list, projects
- daftar manga, genres, genre
- rekomendasi, search
- detail, chapter

### SoulScans
Prefix: `/comic/soulscan/*`
- home, list, projects
- all / azlist
- search, detail, chapter

### Bacaman
Prefix: `/comic/bacaman/*`
- home, list, popular
- latest, update, completed
- search, genres, type
- detail, chapter

### Meganei
Prefix: `/comic/meganei/*`
- home, list
- search, info

### Softkomik
Prefix: `/comic/softkomik/*`
- home, list, update
- ongoing, completed, library
- type, genre, search (fast)
- detail, chapter

### Westmanga
Prefix: `/comic/westmanga/*`
- home, list, popular
- latest, ongoing, completed
- manga / manhwa / manhua
- colored, uncolored
- genres, multi‑genre filter
- search, detail, chapter

### Mangasusuku
Prefix: `/comic/mangasusuku/*`
- home, latest, popular
- list, list‑by‑char
- search, genres, genre
- detail, chapter

### Kiryuu (Partial / Error)
Prefix: `/comic/kiryuu/*`
- home, popular, recommendations
- latest, top-weekly
- search, manga, chapter

### Cosmic Scans (Region Lock)
Prefix: `/comic/cosmic/*`
- home, projects
- latest, search
- manga detail, chapter

---

## 📚 Novel API

### Core Novel
- `GET /novel/home`
- `GET /novel/hot-search`
- `GET /novel/search?q=`
- `GET /novel/genre/:id`
- `GET /novel/chapters/:novelId`

### SakuraNovel
Prefix: `/novel/sakuranovel/*`
- home
- search, advanced-search
- detail, read
- genres, tags
- genre, tag
- daftar novel A‑Z

---

## 🚀 Getting Started (Untuk Pengguna Publik)

Dokumentasi ini dirancang agar **siapa pun bisa langsung pakai API dalam < 5 menit**.

---

## 🌐 Base URL
```text
https://your-domain.com
```

Semua endpoint:
- Method: **GET**
- Response: **JSON**
- Auth: **Tidak diperlukan** (kecuali endpoint favorites)

---

## 🧭 Alur Pemakaian Umum

> **Alur standar aplikasi komik**

1. Homepage → `/comic/homepage`
2. List / Browse → `/comic/terbaru`, `/comic/populer`
3. Search → `/comic/search?q=`
4. Detail Komik → `/comic/comic/:slug`
5. Baca Chapter → `/comic/chapter/:slug`

Kalau kamu mengikuti alur ini, **tidak akan nyasar**.

---

## 📌 Contoh Request & Response

### 🔹 Homepage
```http
GET /comic/homepage
```
Contoh response ringkas:
```json
{
  "status": true,
  "data": {
    "popular": [],
    "latest": [],
    "ranking": []
  }
}
```

---

### 🔹 Search Komik
```http
GET /comic/search?q=naruto
```
Response:
```json
{
  "status": true,
  "data": [
    {
      "title": "Naruto",
      "slug": "naruto",
      "type": "manga"
    }
  ]
}
```

Gunakan `slug` untuk request berikutnya.

---

### 🔹 Detail Komik
```http
GET /comic/comic/naruto
```
Response:
```json
{
  "status": true,
  "data": {
    "title": "Naruto",
    "genres": [],
    "chapters": []
  }
}
```

---

### 🔹 Baca Chapter
```http
GET /comic/chapter/naruto-chapter-1
```
Response:
```json
{
  "status": true,
  "images": ["https://..."]
}
```

---

## ♾️ Pagination & Infinite Scroll

Mayoritas endpoint list mendukung pagination:
```http
GET /comic/terbaru?page=2
```

Untuk infinite scroll:
```http
GET /comic/infinite?page=5
```

---

## 🌐 Aggregator vs Source API

| Kebutuhan | Gunakan |
|---------|--------|
| Data lengkap | `/comic/*` |
| Cepat & stabil | `/comic/{source}/*` |
| Backup data | Ganti source |

---

## ⚠️ Error Handling

Format error standar:
```json
{
  "status": false,
  "message": "Source unavailable",
  "data": null
}
```

**Disarankan:**
- Selalu cek `status`
- Siapkan fallback endpoint

---

## 📜 Rules & Fair Use
- API **read-only**
- Jangan spam heavy endpoint (`/unlimited`, `/realtime`)
- Cache response (server / client)
- Cocok untuk Web, Mobile App, Bot

---

## 🧩 FAQ Singkat

**Q: Gratis?**  
A: Ya, public API.

**Q: Perlu API key?**  
A: Tidak.

**Q: Boleh dipakai production?**  
A: Boleh, tapi gunakan cache & rate-limit sendiri.

---

> Ini adalah **developer-first public API**. Kalau kamu bisa pakai `fetch`, kamu bisa pakai API ini.

