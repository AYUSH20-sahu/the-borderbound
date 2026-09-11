// In-memory sliding-window rate limiter (100% free-tier, zero external dependencies)
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const tracker = new Map<string, RateLimitRecord>();

/**
 * Checks if a given key (e.g. IP or email) has exceeded the limit.
 * @param key Unique identifier for the client (IP or identifier)
 * @param limit Maximum allowed requests in the window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = tracker.get(key);

  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    tracker.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count, resetAt: record.resetAt };
}
