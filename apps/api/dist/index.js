import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { schema } from './schema.js';
const PORT = Number(process.env.PORT) || 4000;
const isDev = process.env.NODE_ENV === 'development';
const yoga = createYoga({
    schema,
    graphqlEndpoint: '/graphql',
    // Playground SOLO en desarrollo
    graphiql: isDev,
    // Logging válido para graphql-yoga v5
    logging: isDev ? 'info' : false,
});
const server = createServer(yoga);
server.listen(PORT, () => {
    console.log(`🚀 GraphQL ready on http://localhost:${PORT}/graphql`);
});
