import { createClient } from 'redis';

// Agregamos un log para ver qué está leyendo realmente el servidor
console.log('🔍 Detectando REDIS_URL:', process.env.REDIS_URL ? '✅ Configurada' : '❌ VACÍA');

const redisUrl = process.env.REDIS_URL;

if (!redisUrl && process.env.NODE_ENV === 'production') {
  throw new Error('❌ CRÍTICO: La variable REDIS_URL no está definida en el entorno.');
}

export const redis = createClient({
  // Si redisUrl es undefined, aquí forzamos que falle con un mensaje claro
  url: redisUrl || 'redis://localhost:6379', 
  socket: {
    family: 4,
    reconnectStrategy: (retries) => Math.min(retries * 100, 3000)
  }
});

redis.on('error', (err) => {
  console.error('❌ Error de conexión:', err.message);
});

export const connectRedis = async () => {
  if (!redis.isOpen && redisUrl) {
    try {
      await redis.connect();
      console.log('✅ Conexión establecida con Redis Cloud');
    } catch (err) {
      console.error('❌ Error al conectar:', err);
    }
  }
};

connectRedis();
