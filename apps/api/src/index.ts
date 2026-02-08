import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { schema } from './schema.js';

import { prisma } from '@cubiculo/db'; 
import { checkDatabase } from './health.js';

const PORT = Number(process.env.PORT) || 4000;
const isDev = process.env.NODE_ENV === 'development';

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  logging: isDev ? 'info' : false,
  cors: (request) => {
    const requestOrigin = request.headers.get('origin');
    
    // Si no hay origen (como peticiones directas al health), permitimos
    if (!requestOrigin) return {}; 

    // 1. Verificamos Localhost
    const isLocalhost = requestOrigin.includes('localhost:3000');
    
    // 2. Regex para Vercel: Permite cualquier subdominio que termine en .vercel.app
    // El /^https:\/\/.*\.vercel\.app$/ es más estricto y seguro
    const isVercelPreview = /^https:\/\/.*\.vercel\.app$/.test(requestOrigin);

    if (isLocalhost || isVercelPreview) {
      return {
        origin: requestOrigin,
        credentials: true,
        methods: ['POST', 'GET', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
      };
    }

    // Fallback: Si tienes un dominio propio en el futuro, ponlo aquí. 
    // Por ahora, si no coincide con los anteriores, devolvemos un objeto vacío (bloquea CORS)
    return {};
  }
});

async function handleHealth(req: any, res: any) {
  let dbStatus = 'disabled';

  if (process.env.HEALTHCHECK_DB === 'true') {
    try {
      const result = await checkDatabase(prisma);
      dbStatus = result.ok ? 'connected' : `error: ${result.error}`;
    } catch (error) {
      dbStatus = 'failed to load db';
    }
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!doctype html>
    <html>
      <body style="font-family:system-ui;background:#020617;color:#e5e7eb;display:flex;justify-content:center;align-items:center;height:100vh">
        <div style="background:#020617;padding:24px 32px;border-radius:12px;box-shadow:0 20px 40px rgba(0,0,0,.4)">
          <h2 style="color:#22c55e">✔ API OK</h2>
          <p>Service: api</p>
          <p>DB: ${dbStatus}</p>
          <p>Time: ${new Date().toISOString()}</p>
        </div>
      </body>
    </html>
  `);
}

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
