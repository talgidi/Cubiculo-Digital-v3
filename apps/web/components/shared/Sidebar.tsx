"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Entrevistas', href: '/interview', icon: FileText },
  { name: 'Equipo', href: '/team', icon: Users },
  { name: 'Ajustes', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-white dark:bg-[#192233] border-r border-[#e5e7eb] dark:border-[#324467]">
      <div className="p-6">
        <span className="text-xl font-bold dark:text-white">Cubículo <span className="text-blue-500">Digital</span></span>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href 
                ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                : "text-gray-600 dark:text-[#92a4c9] hover:bg-gray-50 dark:hover:bg-[#232f48]"
            )}
          >
            <item.icon className="size-5" />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
