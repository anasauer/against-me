import { AuthGuard } from '@/components/auth-guard';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <AuthGuard>
        <SidebarInset>{children}</SidebarInset>
      </AuthGuard>
    </SidebarProvider>
  );
}
