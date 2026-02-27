import type { NextApiRequest, NextApiResponse } from "next";

const UPSTREAM_BASE = "https://www.sankavollerei.com/comic";
const DEFAULT_TIMEOUT_MS = 8000;
const SAFE_CACHE = "s-maxage=300, stale-while-revalidate=600";
const HEAVY_CACHE = "s-maxage=30, stale-while-revalidate=30";
const HEAVY_SEGMENTS = new Set(["unlimited", "realtime", "scroll"]);
const SOURCE_PREFIXES = new Set([
  "bacakomik",
  "komikstation",
  "maid",
  "komikindo",
  "kmkindo",
  "mangakita",
  "soulscan",
  "bacaman",
  "meganei",
  "softkomik",
  "westmanga",
  "mangasusuku",
  "kiryuu",
  "cosmic"
]);
const CORE_ALIASES: Record<string, string> = {
  latest: "terbaru",
  popular: "populer"
};

type ApiSuccess<T> = {
  status: true;
  data: T;
  message?: string;
};

type ApiError = {
  status: false;
  message: string;
  data: null;
};

function normalizePath(pathParam: string | string[] | undefined) {
  if (!pathParam) return "";
  const rawPath = Array.isArray(pathParam) ? pathParam.join("/") : pathParam;
  const segments = rawPath.split("/").filter(Boolean);
  if (segments.length === 0) return "";
  const [first, ...rest] = segments;
  if (!SOURCE_PREFIXES.has(first) && CORE_ALIASES[first]) {
    return [CORE_ALIASES[first], ...rest].join("/");
  }
  return segments.join("/");
}

function buildUpstreamUrl(req: NextApiRequest, path: string) {
  const url = new URL(`${UPSTREAM_BASE}/${path}`);
  const query = { ...req.query } as Record<string, string | string[] | undefined>;
  delete query.path;
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        url.searchParams.append(key, item);
      }
    } else if (value !== undefined) {
      url.searchParams.append(key, value);
    }
  }
  return url;
}

function isHeavyPath(path: string) {
  const segments = path.split("/").filter(Boolean);
  return segments.some((segment) => HEAVY_SEGMENTS.has(segment));
}

function isGuardAllowed(req: NextApiRequest) {
  const guardToken = process.env.GUARD_TOKEN;
  if (!guardToken) return false;
  const headerToken = req.headers["x-guard-token"];
  const queryToken = req.query.guard_token;
  const provided =
    (Array.isArray(headerToken) ? headerToken[0] : headerToken) ??
    (Array.isArray(queryToken) ? queryToken[0] : queryToken);
  return provided === guardToken;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    const body: ApiError = { status: false, message: "Method not allowed", data: null };
    res.status(200).setHeader("Content-Type", "application/json; charset=utf-8").json(body);
    return;
  }

  const path = normalizePath(req.query.path);
  const heavy = isHeavyPath(path);
  if (heavy && !isGuardAllowed(req)) {
    const body: ApiError = {
      status: false,
      message: "Heavy endpoint blocked",
      data: null
    };
    res.status(200).setHeader("Content-Type", "application/json; charset=utf-8").json(body);
    return;
  }

  const upstreamUrl = buildUpstreamUrl(req, path);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const upstreamResponse = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        "user-agent": "websaya-proxy/1.0"
      },
      signal: controller.signal,
      redirect: "follow"
    });

    const text = await upstreamResponse.text();
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      const body: ApiError = { status: false, message: "Upstream returned non-JSON", data: null };
      res.status(502).setHeader("Content-Type", "application/json; charset=utf-8").json(body);
      return;
    }

    if (!upstreamResponse.ok) {
      const body: ApiError = { status: false, message: "Upstream error", data: null };
      res.status(502).setHeader("Content-Type", "application/json; charset=utf-8").json(body);
      return;
    }

    const cacheHeader = heavy ? HEAVY_CACHE : SAFE_CACHE;
    res.setHeader("Cache-Control", cacheHeader);
    res.setHeader("CDN-Cache-Control", cacheHeader);
    res.setHeader("Vercel-CDN-Cache-Control", cacheHeader);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    const body: ApiSuccess<unknown> = { status: true, data: json };
    res.status(200).json(body);
  } catch (error) {
    const isTimeout =
      error instanceof Error && "name" in error && (error as Error).name === "AbortError";
    const body: ApiError = {
      status: false,
      message: isTimeout ? "Upstream timeout" : "Upstream error",
      data: null
    };
    res
      .status(isTimeout ? 504 : 502)
      .setHeader("Content-Type", "application/json; charset=utf-8")
      .json(body);
  } finally {
    clearTimeout(timeout);
  }
}
