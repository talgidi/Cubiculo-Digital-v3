import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { schema } from './schema.js';

const PORT = Number(process.env.PORT) || 4000;

// GraphQL solo en dev
const isDev = process.env.NODE_ENV === 'development';

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  // Playground habilitado solo en desarrollo
  graphiql: isDev,
  // Logging minimal en prod
  logging: isDev ? { level: 'info' } : false,
});

const server = createServer(yoga);

server.listen(PORT, () => {
  console.log(`🚀 GraphQL ready on http://localhost:${PORT}/graphql`);
});
