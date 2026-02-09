// apps/web/components/HeroSection.tsx
import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 bg-white dark:bg-gray-900 transition duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
            Tu conocimiento corporativo, <span className="text-blue-500">estructurado.</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Genera tu Biblia Corporativa a través de entrevistas guiadas por departamentos y exporta los datos para potenciar tu IA y LLMs.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-xl transition duration-300">
              Iniciar Entrevista →
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300">
              Ver Demo
            </button>
          </div>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-4">
            No se requiere tarjeta de crédito
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center">
          {/* Imagen abstracta */}
          <div className="w-full max-w-md h-80 bg-gray-200 dark:bg-gray-800 rounded-xl shadow-2xl flex items-center justify-center border border-gray-300 dark:border-gray-700">
            <span className="text-gray-500">Imagen abstracta de red de datos</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
