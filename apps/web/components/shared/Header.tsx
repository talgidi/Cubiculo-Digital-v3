"use client";

import React from 'react'; // Agrégalo explícitamente para asegurar el parseo JSX
import { useRouter } from "next/navigation";
import { useTheme } from '@/providers/ThemeProvider';
import { Button } from "@/components/ui";

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-current">Cubículo Digital</div>
        <div className="flex items-center space-x-4">
          
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={toggleTheme}
            className="rounded-full px-2"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </Button>

          <Button variant="ghost" onClick={() => router.push("/login")}>
            Iniciar sesión
          </Button>
          
          <Button onClick={() => router.push("/signup")}>
            Registrarse
          </Button>
        </div>
      </nav>
    </header>
  );
};
