const Redis = require("ioredis");

let redis = null;

const getRedis = () => {
    if (!redis) {
        redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
            lazyConnect: true,
            maxRetriesPerRequest: 1,
            retryStrategy: (times) => {
                if (times > 3) return null; // stop retrying after 3 attempts
                return Math.min(times * 200, 1000);
            }
        });
        redis.on("connect", () => console.log("Redis connected"));
        redis.on("error", (err) => console.warn("Redis unavailable:", err.message));
    }
    return redis;
};

const getCache = async (key) => {
    try {
        const data = await getRedis().get(key);
        return data ? JSON.parse(data) : null;
    } catch {
        return null; // gracefully fall through to DB if Redis is down
    }
};

const setCache = async (key, value, ttlSeconds = 300) => {
    try {
        await getRedis().setex(key, ttlSeconds, JSON.stringify(value));
    } catch {
        // silently skip if Redis is down
    }
};

const deleteCache = async (key) => {
    try {
        await getRedis().del(key);
    } catch {
        // silently skip
    }
};

module.exports = { getCache, setCache, deleteCache };
