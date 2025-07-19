import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import SidebarContent from '@/components/dashboard/sidebar-content';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <Sidebar>
          <SidebarContent />
        </Sidebar>
        <SidebarInset>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
