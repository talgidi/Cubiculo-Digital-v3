import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;

export const redis = createClient({
  url: redisUrl,
  // Añadimos una estrategia de reconexión para que no se rinda si falla al inicio
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) return new Error('Redis: Max retries reached');
      return Math.min(retries * 100, 3000);
    }
  }
});

// Capturamos el error específico
redis.on('error', (err) => {
  console.error('❌ Redis Connection Error Details:', {
    message: err.message,
    code: err.code,
    stack: err.stack
  });
});

redis.on('connect', () => console.log('🚀 Redis Client Connected'));
redis.on('ready', () => console.log('✅ Redis Client Ready'));

export const connectRedis = async () => {
  try {
    if (!redis.isOpen && redisUrl) {
      await redis.connect();
    }
  } catch (err) {
    console.error('❌ Failed to connect to Redis on startup:', err);
  }
};

// Ejecutamos la conexión
connectRedis();
