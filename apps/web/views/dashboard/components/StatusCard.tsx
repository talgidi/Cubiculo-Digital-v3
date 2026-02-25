import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  progress: number;
}

export const StatCard = ({ title, value, progress }: StatCardProps) => (
  <div className="rounded-xl bg-white dark:bg-[#192233] p-6 shadow-sm border border-[#e5e7eb] dark:border-[#324467]">
    <p className="text-sm font-medium text-[#637588] dark:text-[#92a4c9]">{title}</p>
    <h3 className="text-2xl font-bold text-[#111418] dark:text-white mt-2">{value}</h3>
    <div className="w-full bg-gray-200 dark:bg-[#232f48] rounded-full h-2.5 mt-4">
      <div 
        className="bg-[#1980e6] h-2.5 rounded-full transition-all duration-500" 
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);
