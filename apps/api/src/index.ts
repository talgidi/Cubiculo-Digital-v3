import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { schema } from "./schema.js";

// Determinar entorno
const isDev = process.env.NODE_ENV !== "production";

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/graphql",
  // Solo activar GraphiQL en desarrollo
  graphiql: isDev,
});

const server = createServer(yoga);

const PORT = Number(process.env.PORT) || 4000;

server.listen(PORT, () => {
  console.log(
    `🚀 GraphQL ready on http://localhost:${PORT}/graphql` +
      (isDev ? " (GraphiQL enabled)" : "")
  );
});
