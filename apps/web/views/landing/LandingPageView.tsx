"use client";
import { useQuery, gql } from '@apollo/client';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { HeroSection } from './components/HeroSection';
import { FeatureSection } from './components/FeatureSection';

const HEALTH_QUERY = gql`query GetHealth { health }`;

export const LandingView = () => {
  // Puedes usar este hook para mostrar un indicador en el footer si lo deseas
  const { data } = useQuery(HEALTH_QUERY);
  const apiStatus = data?.health === 'ok' ? 'Conectada' : 'Fallida';

  return (
    <div className="min-h-screen bg-white dark:bg-[#10121a] text-gray-900 dark:text-white transition-colors duration-300">
      <Header />
      <main>
        <HeroSection />
        <FeatureSection />
      </main>
      <Footer apiStatus={apiStatus} />
    </div>
  );
};
