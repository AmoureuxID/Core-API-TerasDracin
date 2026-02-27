const BASE = "https://www.sankavollerei.com";

export async function fetchUpstream(
  path: string,
  options?: RequestInit & { revalidate?: number }
) {
  const { revalidate, ...fetchOptions } = options || {};

  return fetch(`${BASE}${path}`, {
    ...fetchOptions,
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json"
    },
    next: revalidate ? { revalidate } : undefined
  });
}
