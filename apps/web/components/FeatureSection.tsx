import React from 'react';

const FeatureCard = ({ title, description, icon }) => (
  <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border border-gray-700/50">
    <div className='text-blue-400 mb-4'>{icon}</div>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">Características Principales</h2>
        <p className="text-center text-gray-400 mb-16 max-w-3xl mx-auto">
          Descubre cómo Cubiculo Digital transforma la información tácita de tu empresa en activos digitales estructurados.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Entrevistas Guiadas"
            description="Cuestionarios inteligentes y adaptativos diseñados especificamente para extraer conocimiento clave de cada área de tu empresa sin fricción"
            icon="🗂️" // Icono placeholder
          />
          <FeatureCard
            title="Segmentación por Depto."
            description="Organiza automáticamente el conocimiento en silos accesibles, permitiendo una gestión granular por departamentos clave."
            icon="👥" // Icono placeholder
          />
          <FeatureCard
            title="Exportación para LLM"
            description="Descarga tus datos en formatos JSON, JSONLY CSV, perfectamente optimizados y limpios para el entrenamiento o fine-tuning de modelos."
            icon="🤖" // Icono placeholder
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
