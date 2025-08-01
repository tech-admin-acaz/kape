import DashboardHeader from "@/components/dashboard/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  );
}
