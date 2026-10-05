// In-memory sliding window rate limiter fallback
const memoryStore = global.__rateLimitStore || new Map();
global.__rateLimitStore = memoryStore;

// Clean up stale entries every 10 minutes
if (!global.__rateLimitCleanupStarted) {
  global.__rateLimitCleanupStarted = true;
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (record.expiresAt && record.expiresAt < now) {
        memoryStore.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}

/**
 * Checks rate limit for a given key (e.g., email or IP)
 * Default policy: Max 3 requests per 15 minutes (900 seconds)
 * 
 * @param {string} key Identifier (e.g. `resend:${email}:${ip}`)
 * @param {object} options
 * @param {number} options.limit Maximum allowed requests in window (default 3)
 * @param {number} options.windowSeconds Window in seconds (default 900s / 15m)
 * @returns {Promise<{ allowed: boolean, remaining: number, retryAfterSeconds: number }>}
 */
export async function checkRateLimit(key, { limit = 3, windowSeconds = 900 } = {}) {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Try Upstash Redis REST if configured
  if (upstashUrl && upstashToken) {
    try {
      const redisKey = `ratelimit:${key}`;
      const now = Date.now();
      const clearBefore = now - windowSeconds * 1000;

      // Pipeline: zremrangebyscore, zadd, zcard, expire
      const pipelineRes = await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          ['ZREMRANGEBYSCORE', redisKey, 0, clearBefore],
          ['ZCARD', redisKey],
          ['EXPIRE', redisKey, windowSeconds]
        ])
      });

      if (pipelineRes.ok) {
        const results = await pipelineRes.json();
        const currentCount = results[1]?.result || 0;

        if (currentCount >= limit) {
          return {
            allowed: false,
            remaining: 0,
            retryAfterSeconds: windowSeconds
          };
        }

        // Add current timestamp
        await fetch(`${upstashUrl}/zadd/${redisKey}/${now}/${now}`, {
          headers: { Authorization: `Bearer ${upstashToken}` }
        });

        return {
          allowed: true,
          remaining: Math.max(0, limit - currentCount - 1),
          retryAfterSeconds: 0
        };
      }
    } catch (redisErr) {
      console.warn('Upstash rate limit error, falling back to memory:', redisErr.message);
    }
  }

  // 2. In-Memory Sliding Window Fallback
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const cutoff = now - windowMs;

  let record = memoryStore.get(key);
  if (!record) {
    record = { timestamps: [], expiresAt: now + windowMs };
    memoryStore.set(key, record);
  }

  // Filter timestamps within window
  record.timestamps = record.timestamps.filter(ts => ts > cutoff);
  record.expiresAt = now + windowMs;

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfterSeconds)
    };
  }

  record.timestamps.push(now);

  return {
    allowed: true,
    remaining: limit - record.timestamps.length,
    retryAfterSeconds: 0
  };
}
