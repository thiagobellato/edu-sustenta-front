import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bell,
  Loader2,
  Info,
  AlertTriangle,
  CheckCircle,
  Gift,
  MessageSquare,
  Check,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { notificationsApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'reward' | 'message';
  read: boolean;
  created_at: string;
}

const typeConfig = {
  info: {
    icon: Info,
    className: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  success: {
    icon: CheckCircle,
    className: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  reward: {
    icon: Gift,
    className: 'bg-purple-50 text-purple-600 border-purple-100',
  },
  message: {
    icon: MessageSquare,
    className: 'bg-[#45C4B0]/10 text-[#012030] border-[#45C4B0]/20',
  },
};

export default function Notifications() {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await notificationsApi.getAll();
      return response.data;
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Agora mesmo';
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#012030]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-in">
      <div className="flex items-end justify-between border-b border-[#012030]/5 pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#012030]">Notificações</h1>
          <p className="text-[#012030]/60">Fique por dentro das atualizações da sua jornada</p>
        </div>
        {notifications.some(n => !n.read) && (
          <Badge className="bg-[#45C4B0] text-[#012030] hover:bg-[#45C4B0]/90">
            {notifications.filter(n => !n.read).length} Novas
          </Badge>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="border-dashed border-2 bg-transparent">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/50">
              <Bell className="h-10 w-10 text-[#012030]/20" />
            </div>
            <h3 className="text-xl font-bold text-[#012030]">Tudo limpo por aqui!</h3>
            <p className="text-[#012030]/50">Você não possui novas notificações no momento.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const config = typeConfig[notification.type] || typeConfig.info;
            const Icon = config.icon;

            return (
              <Card
                key={notification.id}
                className={cn(
                  'group transition-all hover:shadow-md border-[#012030]/10 overflow-hidden relative',
                  !notification.read && 'bg-white shadow-sm'
                )}
              >
                {!notification.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#45C4B0]" />
                )}
                
                <CardContent className="flex items-start gap-4 p-5">
                  <div className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors',
                    config.className
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className={cn(
                          "font-bold leading-none tracking-tight",
                          notification.read ? "text-[#012030]/70" : "text-[#012030]"
                        )}>
                          {notification.title}
                        </h4>
                        <p className="text-xs font-medium text-[#012030]/40 uppercase tracking-wider">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>

                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#45C4B0] hover:bg-[#45C4B0]/10 hover:text-[#012030] shrink-0"
                          onClick={() => markAsReadMutation.mutate(notification.id)}
                          title="Marcar como lida"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <p className={cn(
                      "mt-2 text-sm leading-relaxed",
                      notification.read ? "text-[#012030]/50" : "text-[#012030]/80"
                    )}>
                      {notification.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Pequeno componente auxiliar de Badge caso não esteja importado
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors", className)}>
      {children}
    </span>
  );
}