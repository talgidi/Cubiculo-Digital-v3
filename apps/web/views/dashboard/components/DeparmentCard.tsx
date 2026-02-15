import { Play, DollarSign, Box } from 'lucide-react';
import { Button } from "@/components/ui";
import Link from 'next/link';

interface DeptCardProps {
  name: string;
  description: string;
  progress: number;
  status: 'Completado' | 'En Progreso' | 'Pendiente';
  icon: React.ReactNode;
}

export const DeptCard = ({ name, description, progress, status, icon }: DeptCardProps) => {
  const isCompleted = status === 'Completado';
  
  return (
    <div className="group relative flex flex-col rounded-xl border border-[#e5e7eb] dark:border-[#324467] bg-white dark:bg-[#192233] p-5 shadow-sm hover:border-[#1980e6]/50 transition-all duration-300">
      <div className="absolute top-5 right-5">
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
          isCompleted 
            ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 ring-green-600/20' 
            : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 ring-blue-700/10'
        }`}>
          {status}
        </span>
      </div>
      <div className={`mb-4 size-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
        isCompleted ? 'bg-green-50 dark:bg-green-500/10 text-green-600' : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600'
      }`}>
        {icon}
      </div>
      <h3 className="text-[#111418] dark:text-white text-lg font-bold mb-1">{name}</h3>
      <p className="text-[#637588] dark:text-[#92a4c9] text-sm mb-6 line-clamp-2">{description}</p>
      
      <div className="mt-auto">
        <div className="flex justify-between text-xs font-medium mb-2">
          <span className="text-[#637588]">Progreso</span>
          <span className="text-current">{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mb-5">
          <div 
            className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-[#1980e6]'}`} 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {isCompleted ? (
          <Button variant="outline" className="w-full text-xs font-bold">Ver Respuestas</Button>
        ) : (
          <Link href="/interview" className="w-full">
            <Button className="w-full gap-2 shadow-sm shadow-blue-500/20">
              <Play className="size-4" /> Continuar
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
