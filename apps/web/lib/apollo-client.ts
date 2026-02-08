import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const client = new ApolloClient({
  link: new HttpLink({
    // Usamos la variable de entorno configurada
    uri: process.env.NEXT_PUBLIC_API_URL,
  }),
  cache: new InMemoryCache(),
});
