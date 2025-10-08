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
  User as UserIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/firebase';
import { Logo } from '@/components/logo';
import { useEffect, useState } from 'react';

const menuItems = [
  { href: '/', label: 'Panel', icon: LayoutDashboard },
  { href: '/challenges', label: 'Retos', icon: Target },
  { href: '/rewards', label: 'Recompensas', icon: Gift },
  { href: '/social', label: 'Social', icon: Users },
  { href: '/history', label: 'Historial', icon: History },
  { href: '/challenge-friend', label: 'Retar', icon: Swords },
  { href: '/profile', label: 'Perfil', icon: UserIcon },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-center h-24 w-24 mx-auto">
          {isClient ? (
            <Logo className="w-24 h-24" />
          ) : (
            <div className="w-24 h-24" />
          )}
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
          <Link href="/profile" className="flex items-center gap-3">
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
                Ver Perfil
              </span>
            </div>
          </Link>
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
