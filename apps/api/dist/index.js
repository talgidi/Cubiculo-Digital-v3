import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { schema } from './schema.js';
const yoga = createYoga({
    schema,
    graphqlEndpoint: '/graphql',
});
const server = createServer(yoga);
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🚀 GraphQL ready on http://localhost:${PORT}/graphql`);
});
