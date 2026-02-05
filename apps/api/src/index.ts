import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { schema } from './schema.js';

const PORT = Number(process.env.PORT) || 4000;
const isDev = process.env.NODE_ENV === 'development';

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  graphiql: isDev,
  logging: isDev ? 'info' : false,
});

async function handleHealth(req: any, res: any) {
  let dbStatus = 'disabled';

  if (process.env.HEALTHCHECK_DB === 'true') {
    try {
      const { prisma } = await import('@cubiculo/db');
      const { checkDatabase } = await import('./health.js');

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
