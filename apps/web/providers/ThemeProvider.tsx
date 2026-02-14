'use client';

import React, { useState, useEffect, useContext, createContext } from 'react';

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => useContext(ThemeContext)!;

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState('dark'); // El diseño actual es oscuro

  useEffect(() => {
    // 1. Verificar si hay algo guardado al cargar
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
  }, []);

  useEffect(() => {
    // Aplicar la clase 'dark' al <html> al montar
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
