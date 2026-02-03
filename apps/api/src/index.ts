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

const server = createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    res.end(`
      <!doctype html>
      <html>
        <head>
          <title>Healthcheck</title>
          <style>
            body {
              font-family: system-ui, sans-serif;
              background: #0f172a;
              color: #e5e7eb;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            .card {
              background: #020617;
              border-radius: 12px;
              padding: 24px 32px;
              box-shadow: 0 20px 40px rgba(0,0,0,.4);
            }
            .ok { color: #22c55e; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2 class="ok">✔ API OK</h2>
            <p>Service: api</p>
            <p>Status: running</p>
            <p>Time: ${new Date().toISOString()}</p>
          </div>
        </body>
      </html>
    `);

    return;
  }

  return yoga(req, res);
});

server.listen(PORT, () => {
  console.log(`🚀 GraphQL ready on http://localhost:${PORT}/graphql`);
});
