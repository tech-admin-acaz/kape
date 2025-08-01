import DashboardHeader from "@/components/dashboard/header";
import StatsPanel from "@/components/dashboard/stats-panel";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { mockData } from "@/components/dashboard/mock-data";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (
    <SidebarProvider>
      <Sidebar side="right" collapsible="icon">
        <StatsPanel data={mockData["1"]} />
      </Sidebar>
      <div className="flex flex-col min-h-screen">
        <DashboardHeader />
        <SidebarInset className="flex-grow">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
