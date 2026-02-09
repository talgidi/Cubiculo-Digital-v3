import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;

export const redis = createClient({
  url: redisUrl
});

redis.on('error', (err) => console.error('Redis Client Error', err));

// Conexión inicial
if (process.env.NODE_ENV === 'production' && redisUrl) {
  redis.connect().catch(console.error); // Usamos catch para que no rompa el proceso si falla
}
