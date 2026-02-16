"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui';

export const AuthCloseButton = () => {
  const router = useRouter();

  return (
    <div className="absolute top-2 right-2 z-50">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => router.push('/')}
        className="w-10 h-10 p-0 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        aria-label="Cerrar y volver al inicio"
      >
        <X className="size-6 text-gray-500 dark:text-gray-400" />
      </Button>
    </div>
  );
};
