import React from 'react';
import { useRouter } from "next/navigation";
import { useTheme } from '@/providers/ThemeProvider';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-current">Cubículo Digital</div>
        <div className="flex items-center space-x-4">
          
          {/* Botón para cambiar tema */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            title="Cambiar tema"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button onClick={() => router.push("/login")} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hidden sm:inline">Iniciar sesión</button>
          <button onClick={() => router.push("/signup")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg">
            Registrarse
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
