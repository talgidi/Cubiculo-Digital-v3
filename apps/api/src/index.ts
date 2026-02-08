import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { schema } from './schema.js';
import { prisma } from '@cubiculo/db'; 
import { checkDatabase } from './health.js';
// Importamos redis
import { redis } from './redis.js';

const PORT = Number(process.env.PORT) || 4000;

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  cors: (request) => {
    const requestOrigin = request.headers.get('origin');
    if (!requestOrigin) return {}; 

    const isLocalhost = requestOrigin.includes('localhost:3000');
    const isVercelPreview = /^https:\/\/.*\.vercel\.app$/.test(requestOrigin);

    if (isLocalhost || isVercelPreview) {
      return {
        origin: requestOrigin,
        credentials: true,
        methods: ['POST', 'GET', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
      };
    }
    return {};
  }
});

async function handleHealth(req, res) {
  let dbStatus = 'disabled';
  let redisStatus = 'checking...';

  if (process.env.HEALTHCHECK_DB === 'true') {
    try {
      const dbResult = await checkDatabase(prisma);
      dbStatus = dbResult.ok ? 'connected' : `error: ${dbResult.error}`;
      
      // Verificamos Redis
      const ping = await redis.ping();
      redisStatus = ping === 'PONG' ? 'connected' : 'error';
    } catch (error) {
      dbStatus = 'failed';
      redisStatus = 'failed';
    }
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <body style="font-family:system-ui;background:#020617;color:#e5e7eb;display:flex;justify-content:center;align-items:center;height:100vh">
      <div style="background:#0f172a;padding:24px;border-radius:12px;border:1px solid #1e293b">
        <h2 style="color:#22c55e">✔ API Status</h2>
        <p>Postgres: ${dbStatus}</p>
        <p>Redis Cloud: ${redisStatus}</p>
      </div>
    </body>
  `);
}

// ... resto del servidor (idéntico a tu versión anterior)
const server = createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    handleHealth(req, res);
    return;
  }

  return yoga(req, res);
});

server.listen(PORT, () => {
  console.log(`🚀 GraphQL ready on http://localhost:${PORT}/graphql`);
});
