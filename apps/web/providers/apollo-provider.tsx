"use client";

import { 
  ApolloClient, 
  InMemoryCache, 
  ApolloProvider, 
  createHttpLink,
  from
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { sha256 } from "crypto-js/sha256";

/**
 * 1. CONFIGURACIÓN DEL CACHÉ (InMemoryCache)
 * Mantiene la persistencia de datos en memoria para navegación instantánea.
 */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Evita parpadeos al navegar entre Landing y Dashboard
        departments: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

/**
 * 2. LINK DE AUTENTICACIÓN
 * Extrae el token del localStorage y lo inyecta en cada petición.
 */
const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

/**
 * 3. LINK DE PERSISTENCIA (APQ)
 * Genera el Hash para que Redis pueda identificar la query rápidamente.
 */
const pqLink = createPersistedQueryLink({
  sha256: (query) => sha256(query).toString(),
  useGETForHashedQueries: true 
});

/**
 * 4. LINK DE CONEXIÓN HTTP
 */
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql",
});

/**
 * 5. CLIENTE ÚNICO DE APOLLO
 * Unificamos todos los eslabones de la cadena.
 */
export const client = new ApolloClient({
  // Importante el orden: Auth -> Persistencia -> HTTP
  link: from([authLink, pqLink, httpLink]),
  cache,
  connectToDevTools: process.env.NODE_ENV === 'development',
  defaultOptions: {
    watchQuery: {
      // 'cache-and-network' es el corazón del Cache-Aside:
      // Muestra lo que hay en cache (0ms) y actualiza desde la red por detrás.
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    },
  },
});

export const ApolloWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
