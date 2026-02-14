'use client';

// Usaremos un componente de cliente para la interacción inicial (botones)
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import Footer from '@/components/Footer';

// Mantenemos la consulta de salud para verificar si la API está viva
const HEALTH_QUERY = gql`
  query GetHealth {
    health
  }
`;

export default function HomePage() {
  // Puedes usar este hook para mostrar un indicador en el footer si lo deseas
  const { data } = useQuery(HEALTH_QUERY);
  const apiStatus = data?.health === 'ok' ? 'Conectada' : 'Fallida';

  return (
    <div className="min-h-screen bg-white dark:bg-[#10121a] text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <Header />
      <main>
        <HeroSection />
        <FeatureSection />
      </main>
      <Footer apiStatus={apiStatus} />
    </div>
  );
}
