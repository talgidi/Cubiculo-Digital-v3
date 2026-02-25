"use client";

import { useQuery } from "@apollo/client";
import { GET_DASHBOARD_STATS } from "@/modules/dashboard/dashboard.api";
import { Activity, Plus, DollarSign, Box } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui";
import { Footer } from "@/components/shared"; // Importación limpia desde el barril
import { StatCard } from "./components/StatusCard";
import { DeptCard } from "./components/DeparmentCard";

export const DashboardView = () => {
  const { data, loading, error } = useQuery(GET_DASHBOARD_STATS, {
  // ESTRATEGIA CACHE-ASIDE:
  // 1. Muestra lo que hay en caché inmediatamente (instantáneo).
  // 2. Hace la petición en background para actualizar si algo cambió.
  fetchPolicy: "cache-and-network", 
  
  // Si el usuario vuelve a entrar en menos de 5 min, ni siquiera hace la petición
  nextFetchPolicy: "cache-first", 
  });

  return (
    <div className="flex flex-col w-full bg-transparent min-h-screen dark:text-white">
      <main className="flex-1 pt-24 pb-12 px-6 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight dark:text-white">Panel de Control</h1>                
              <p className="text-[#637588] dark:text-[#92a4c9]">Gestiona el progreso de tu Biblia Corporativa.</p>
            </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="gap-2">
              <Activity className="size-4" /> Reporte
            </Button>
            <Link href="/setup">
              <Button className="gap-2">
                <Plus className="size-4" /> Nueva Entrevista
              </Button>
            </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard title="Progreso Total" value="12%" progress={12} />
            <StatCard title="Departamentos Activos" value="2" progress={66} />
            <StatCard title="Entrevistas Pendientes" value="5" progress={0} />
          </div>

          {/* Grid */}
          <h2 className="text-xl font-bold dark:text-white mb-6">Departamentos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DeptCard 
              name="Ventas" 
              description="Estrategias comerciales y CRM." 
              progress={100} 
              status="Completado" 
              icon={<DollarSign className="size-7" />} 
            />
            <DeptCard 
              name="Operaciones" 
              description="Logística y procesos diarios." 
              progress={75} 
              status="En Progreso" 
              icon={<Box className="size-7" />} 
            />
          </div>
        </div>
      </main>
      <Footer apiStatus="Connected"/>
    </div>
  );
};
