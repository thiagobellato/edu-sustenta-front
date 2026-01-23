import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { notificationsApi } from '@/lib/api';
import { Link } from 'react-router-dom';

interface AppHeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export function AppHeader({ onMenuToggle, isSidebarOpen }: AppHeaderProps) {
  const { user } = useAuth();

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await notificationsApi.getAll();
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuToggle}
        className="lg:hidden"
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between border-b p-3">
              <span className="font-semibold">Notificações</span>
              <Link
                to="/notifications"
                className="text-xs text-primary hover:underline"
              >
                Ver todas
              </Link>
            </div>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Nenhuma notificação
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start gap-1 p-3"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium">{notification.title}</span>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-2">
                    {notification.message}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        <Link to="/profile">
          <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-primary/20 transition-all hover:ring-primary/40">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {user?.name ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
