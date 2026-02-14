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
          <div className="flex-1 w-full lg:w-1/2">
            <div className="w-full aspect-[4/3] rounded-2xl bg-center bg-cover shadow-2xl shadow-blue-900/10 border border-[#e5e7eb] dark:border-[#232f48] relative overflow-hidden group"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD5Liq6Y8Fi6OKjbH1NXg6jjtDKQ9ypdDso9Gl6w6az0OZeBVZMf_2CAsqbpiYQkFkeVjm7_fgLe4EtxTx7NL3RQ1UkWDkHyuHvzfsNYz2uNEDDy8Jh8nx2T4YP6w9TXek1ZWazASTG2MPOJWEVsTBMqXYi_tzC7ZPa8il7XrBXnJrjSqeQUXa5zpk5vT-TogVckOL3WcX71eUlPz5K0hGOMZSHMpLjaA5-hvnH2RbO7UCF7-GFOtOdLnnBvn5EthND7ZRN458c1eA")' }}>
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent mix-blend-multiply"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
