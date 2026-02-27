import { apiGet } from "../../lib/api"
import type { ComicDetail } from "../../types/comic"

type ApiResponse<T> = {
  status?: boolean
  data?: T
  message?: string
}

export async function getComicDetail(slug: string) {
  return apiGet<ApiResponse<ComicDetail>>(`/comic/comic/${slug}`)
}
