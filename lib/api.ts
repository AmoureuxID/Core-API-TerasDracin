export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  process.env.API_BASE ??
  "https://www.sankavollerei.com"

export type ApiResult<T> = {
  ok: boolean
  status: number
  data: T | null
}

export function buildApiUrl(
  path: string,
  searchParams?: Record<string, string | number | undefined>
) {
  const url = new URL(path, API_BASE)
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value === undefined || value === "") return
      url.searchParams.set(key, String(value))
    })
  }
  return url
}

export async function apiGet<T>(
  path: string,
  searchParams?: Record<string, string | number | undefined>
): Promise<ApiResult<T>> {
  const url = buildApiUrl(path, searchParams)
  const response = await fetch(url.toString(), {
    headers: {
      accept: "application/json"
    }
  })
  const data = (await response.json().catch(() => null)) as T | null
  return {
    ok: response.ok,
    status: response.status,
    data
  }
}
