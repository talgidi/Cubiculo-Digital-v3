import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;

export const redis = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
    // Esto ayuda si hay problemas de resolución IPv6 en Render
    family: 4 
  }
});

redis.on('error', (err) => {
  // Ahora capturaremos el mensaje aunque venga vacío en el objeto principal
  console.error('❌ Redis Error:', err.message || err.code || err);
});

export const connectRedis = async () => {
  if (!redis.isOpen && redisUrl) {
    try {
      await redis.connect();
      console.log('✅ Redis conectado exitosamente');
    } catch (err) {
      console.error('❌ Error al conectar Redis:', err);
    }
  }
};

connectRedis();
