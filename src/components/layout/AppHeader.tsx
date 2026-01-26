import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Menu, X, Check, ArrowRight } from 'lucide-react';
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
import { cn } from '@/lib/utils';

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
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await notificationsApi.getAll();
      return response.data;
    },
    refetchInterval: 30000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
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

  const handleMarkAsRead = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    markAsReadMutation.mutate(id);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuToggle}
        className="lg:hidden text-[#012030]"
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-secondary/50">
              <Bell className="h-5 w-5 text-[#012030]" />
              {unreadCount > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#45C4B0] p-0 text-[10px] font-bold text-[#012030]"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden border-[#012030]/10 shadow-xl">
            <div className="flex items-center justify-between bg-[#012030] p-4 text-white">
              <span className="text-sm font-bold tracking-tight">Notificações</span>
              <Link
                to="/notifications"
                className="group flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#45C4B0] transition-colors hover:text-white"
              >
                Ver todas
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="max-h-[350px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="mx-auto h-8 w-8 text-[#012030]/10 mb-2" />
                  <p className="text-sm text-[#012030]/40 font-medium">Tudo em dia por aqui!</p>
                </div>
              ) : (
                notifications.slice(0, 5).map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      "flex flex-col items-start gap-1 border-b border-[#012030]/5 p-4 last:border-0 focus:bg-secondary/30 transition-colors cursor-default",
                      !notification.read && "bg-[#45C4B0]/5"
                    )}
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      <span className={cn(
                        "text-sm font-bold leading-none tracking-tight",
                        notification.read ? "text-[#012030]/60" : "text-[#012030]"
                      )}>
                        {notification.title}
                      </span>
                      {!notification.read && (
                        <button
                          onClick={(e) => handleMarkAsRead(e, notification.id)}
                          className="group rounded-full bg-[#45C4B0]/20 p-1 transition-colors hover:bg-[#45C4B0]"
                          title="Marcar como lida"
                        >
                          <Check className="h-3 w-3 text-[#012030]" />
                        </button>
                      )}
                    </div>
                    <p className={cn(
                      "text-xs leading-relaxed line-clamp-2",
                      notification.read ? "text-[#012030]/40" : "text-[#012030]/70"
                    )}>
                      {notification.message}
                    </p>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link to="/profile">
          <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-[#012030]/5 transition-all hover:ring-[#45C4B0]">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-[#012030] text-[#45C4B0] text-xs font-bold">
              {user?.name ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}