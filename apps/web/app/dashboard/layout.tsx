import { Sidebar, DashboardHeader } from "@/components/shared";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#101622] transition-colors duration-300">
      <Sidebar />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <DashboardHeader />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
