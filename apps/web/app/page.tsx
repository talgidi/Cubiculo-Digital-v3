'use client';

import { useQuery, gql } from '@apollo/client';

const HEALTH_QUERY = gql`
  query GetHealth {
    health
  }
`;

export default function HomePage() {
  const { data, loading, error } = useQuery(HEALTH_QUERY);

  if (loading) return <p>Conectando con la API...</p>;
  if (error) return <p>Error de conexión: {error.message}</p>;

  return (
    <div>
      <h1>Estado del sistema</h1>
      <p>Respuesta de la API en Render: {data.health}</p>
    </div>
  );
}
