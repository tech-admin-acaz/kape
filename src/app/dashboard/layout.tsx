import DashboardHeader from "@/components/dashboard/header";
import StatsPanel from "@/components/dashboard/stats-panel";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { mockData } from "@/components/dashboard/mock-data";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          <Sidebar side="right" collapsible="icon">
            <StatsPanel data={mockData["1"]} />
          </Sidebar>
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
