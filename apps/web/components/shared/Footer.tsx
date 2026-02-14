import React from 'react';

export const Footer = ({ apiStatus }) => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-8 px-6 md:px-8 flex justify-between items-center">
        <div className="text-gray-500">
          © 2024 Cubiculo Digital.
        </div>
        <div className="flex space-x-6 text-gray-500">
          <a href="#" className="hover:text-white">Privacidad</a>
          <a href="#" className="hover:text-white">Términos</a>
          <a href="#" className="hover:text-white">Soporte</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-4">
        {apiStatus && <p className={`text-sm ${apiStatus === 'Conectada' ? 'text-green-500' : 'text-red-500'}`}>API Status: {apiStatus}</p>}
      </div>
    </footer>
  );
};
