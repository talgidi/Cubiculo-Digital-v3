import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { schema } from './schema.js';

// 1. Importación estática: Si esto falla, el log de Render te dirá exactamente por qué
import { prisma } from '@cubiculo/db'; 
import { checkDatabase } from './health.js';

const PORT = Number(process.env.PORT) || 4000;
const isDev = process.env.NODE_ENV === 'development';

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  cors: {
    // Permite tu dominio de Vercel y localhost para desarrollo
    origin: ['https://cubiculo-digital-v3-web-git-dev-talgidis-projects.vercel.app', 'http://localhost:3000'],
    credentials: true,
    methods: ['POST'] // GraphQL usualmente solo usa POST
  }
});


async function handleHealth(req: any, res: any) {
  let dbStatus = 'disabled';

  if (process.env.HEALTHCHECK_DB === 'true') {
    try {
      const result = await checkDatabase(prisma);
      dbStatus = result.ok ? 'connected' : `error: ${result.error}`;
    } catch {
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
