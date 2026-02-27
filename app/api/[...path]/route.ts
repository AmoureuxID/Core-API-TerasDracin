const UPSTREAM_ORIGIN = "https://www.sankavollerei.com"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  context: { params: { path?: string[] } }
) {
  const { params } = context
  const path = params.path?.join("/") ?? ""
  const requestUrl = new URL(request.url)
  const upstreamUrl = path
    ? new URL(`${UPSTREAM_ORIGIN}/${path}`)
    : new URL(UPSTREAM_ORIGIN)
  upstreamUrl.search = requestUrl.search

  const headers = new Headers(request.headers)
  const upstreamHost = new URL(UPSTREAM_ORIGIN).host
  headers.set("host", upstreamHost)
  headers.set("origin", UPSTREAM_ORIGIN)
  headers.set("referer", upstreamUrl.toString())
  headers.delete("content-length")

  const upstreamResponse = await fetch(upstreamUrl.toString(), {
    method: "GET",
    headers,
    redirect: "manual"
  })

  const responseHeaders = new Headers(upstreamResponse.headers)

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders
  })
}
