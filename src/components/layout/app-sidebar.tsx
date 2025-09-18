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
  Lightbulb,
  History,
  User as UserIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { Logo } from '@/components/logo';

const menuItems = [
  { href: '/', label: 'Panel', icon: LayoutDashboard },
  { href: '/challenges', label: 'Retos', icon: Target },
  { href: '/rewards', label: 'Recompensas', icon: Gift },
  { href: '/social', label: 'Social', icon: Users },
  { href: '/history', label: 'Historial', icon: History },
  { href: '/suggest', label: 'Sugerir', icon: Lightbulb },
  { href: '/profile', label: 'Perfil', icon: UserIcon },
];

export function AppSidebar() {
  const pathname = usePathname();
  const userAvatar = getPlaceholderImage('user-avatar-sidebar');

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-sidebar-primary" />
          <h1 className="text-2xl font-bold text-sidebar-foreground font-headline">
            Against me
          </h1>
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
        <Link href="/profile" className="flex items-center gap-3">
          <Avatar>
            {userAvatar && (
              <AvatarImage
                src={userAvatar.imageUrl}
                data-ai-hint={userAvatar.imageHint}
              />
            )}
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sidebar-foreground">Usuario</span>
             <span className="text-xs text-sidebar-foreground/70">Ver Perfil</span>
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
