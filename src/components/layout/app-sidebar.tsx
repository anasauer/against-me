'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Target,
  Gift,
  Users,
  Swords,
  History,
  Settings,
  UserPlus,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/firebase';
import { SidebarLogo } from '../sidebar-logo';

const menuItems = [
  { href: '/', label: 'Panel', icon: LayoutDashboard },
  { href: '/challenges', label: 'Retos', icon: Target },
  { href: '/rewards', label: 'Recompensas', icon: Gift },
  { href: '/social', label: 'Social', icon: Users },
  { href: '/add-friend', label: 'Añadir Amigos', icon: UserPlus },
  { href: '/history', label: 'Historial', icon: History },
  { href: '/challenge-friend', label: 'Retar', icon: Swords },
  { href: '/profile', label: 'Perfil', icon: User },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-center h-24 w-24 mx-auto">
          <SidebarLogo className="w-24 h-24" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <Link href="/settings" className="flex items-center gap-3">
            <Avatar>
              {user.photoURL && <AvatarImage src={user.photoURL} />}
              <AvatarFallback>
                {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground">
                {user.displayName || user.email}
              </span>
              <span className="text-xs text-sidebar-foreground/70">
                Ver Configuración
              </span>
            </div>
          </Link>
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
