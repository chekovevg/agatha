type RateLimiterOptions = {
  windowMs: number;
  maxRequests: number;
  maxKeys: number;
};

export function createRateLimiter({
  windowMs,
  maxRequests,
  maxKeys,
}: RateLimiterOptions) {
  const submissions = new Map<string, number[]>();

  function prune(now: number) {
    for (const [key, timestamps] of submissions) {
      const recent = timestamps.filter((timestamp) => now - timestamp < windowMs);

      if (recent.length === 0) {
        submissions.delete(key);
      } else if (recent.length !== timestamps.length) {
        submissions.set(key, recent);
      }
    }
  }

  function evictOldestKey() {
    const oldestKey = submissions.keys().next().value;

    if (oldestKey !== undefined) {
      submissions.delete(oldestKey);
    }
  }

  return {
    isLimited(key: string, now = Date.now()) {
      prune(now);
      const recent = submissions.get(key) ?? [];

      if (recent.length >= maxRequests) {
        return true;
      }

      if (!submissions.has(key) && submissions.size >= maxKeys) {
        evictOldestKey();
      }

      submissions.set(key, [...recent, now]);
      return false;
    },
    clear() {
      submissions.clear();
    },
  };
}
