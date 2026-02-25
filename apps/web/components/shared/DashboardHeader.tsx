"use client";
import { useTheme } from '@/providers/ThemeProvider';
import { Button } from '@/components/ui';
import { Sun, Moon, User } from 'lucide-react';

export const DashboardHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-[#e5e7eb] dark:border-[#324467] bg-white/80 dark:bg-[#101622]/80 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between">
      <div className="text-sm font-medium text-gray-500">Panel / General</div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={toggleTheme} className="rounded-full w-9 h-9 p-0">
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
        <Button variant="ghost" size="sm" className="gap-2">
          <div className="size-7 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <User className="size-4" />
          </div>
          <span className="hidden sm:block text-sm dark:text-white font-medium">Mi Perfil</span>
        </Button>
      </div>
    </header>
  );
};
