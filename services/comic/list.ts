import { apiGet } from "../../lib/api"
import type { ComicGenre, ComicHomepage, ComicListItem } from "../../types/comic"

type ApiResponse<T> = {
  status?: boolean
  data?: T
  message?: string
}

export async function getHomepage() {
  return apiGet<ApiResponse<ComicHomepage>>("/comic/homepage")
}

export async function getLatest(page?: number) {
  return apiGet<ApiResponse<ComicListItem[]>>("/comic/terbaru", {
    page
  })
}

export async function getPopular(page?: number) {
  return apiGet<ApiResponse<ComicListItem[]>>("/comic/populer", {
    page
  })
}

export async function getTrending(page?: number) {
  return apiGet<ApiResponse<ComicListItem[]>>("/comic/trending", {
    page
  })
}

export async function getRandom() {
  return apiGet<ApiResponse<ComicListItem[]>>("/comic/random")
}

export async function getGenres() {
  return apiGet<ApiResponse<ComicGenre[]>>("/comic/genres")
}

export async function getGenreDetail(genre: string, page?: number) {
  return apiGet<ApiResponse<ComicListItem[]>>(`/comic/genre/${genre}`, {
    page
  })
}

export async function getTypeDetail(type: string, page?: number) {
  return apiGet<ApiResponse<ComicListItem[]>>(`/comic/type/${type}`, {
    page
  })
}

export async function getBrowse(params?: Record<string, string | number>) {
  return apiGet<ApiResponse<ComicListItem[]>>("/comic/browse", params)
}

export async function searchComics(query: string) {
  return apiGet<ApiResponse<ComicListItem[]>>("/comic/search", {
    q: query
  })
}
