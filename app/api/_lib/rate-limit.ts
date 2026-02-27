const hits = new Map<string, { count: number; time: number }>();

const WINDOW = 60000;
const LIMIT = 30;

export function rateLimit(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now - entry.time > WINDOW) {
    hits.set(ip, { count: 1, time: now });
    return true;
  }

  if (entry.count >= LIMIT) return false;

  entry.count++;
  return true;
}
