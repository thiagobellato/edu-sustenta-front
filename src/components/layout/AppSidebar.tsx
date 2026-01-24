import { useLocation, Link } from 'react-router-dom';
import {
  Home,
  BookOpen,
  School,
  Users,
  Compass,
  GraduationCap,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import logo from '@/assets/LOGO.svg';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/home',
    icon: Home,
    roles: ['aluno', 'professor', 'gestor'],
  },
  {
    title: 'Explorar Trilhas',
    href: '/explore',
    icon: Compass,
    roles: ['aluno'],
  },
  {
    title: 'Minhas Trilhas',
    href: '/teacher-trails',
    icon: BookOpen,
    roles: ['professor'],
  },
  {
    title: 'Meus Alunos',
    href: '/students',
    icon: GraduationCap,
    roles: ['professor'],
  },
  {
    title: 'Escolas',
    href: '/manager-schools',
    icon: School,
    roles: ['gestor'],
  },
  {
    title: 'Professores',
    href: '/professors',
    icon: Users,
    roles: ['gestor'],
  },
];

interface AppSidebarProps {
  isCollapsed?: boolean;
}

export function AppSidebar({ isCollapsed = false }: AppSidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const filteredItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside
      className={cn(
        'flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300',
        'h-screen sticky top-0 z-40', // Ajuste principal: Altura da tela e fixo no topo
        isCollapsed ? 'w-16' : 'w-64'
      )}
      style={{
        background: `
          radial-gradient(circle at 25% 35%, rgba(69,196,176,0.35) 0%, transparent 40%),
          radial-gradient(circle at 70% 60%, rgba(154,235,163,0.25) 0%, transparent 45%),
          linear-gradient(180deg, #012030 0%, #012030 100%)
        `
      }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border shrink-0">
        {!isCollapsed && (
          <Link to="/">
            <img
              src={logo}
              alt="EduSustenta"
              className="h-8 md:h-10 lg:h-10"
            />
          </Link>
        )}
        {isCollapsed && (
          <span className="text-lg font-bold text-sidebar-foreground mx-auto">
            {'</'}
          </span>
        )}
      </div>

      {/* Navigation - Adicionado overflow-y-auto para lidar com listas longas */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto scrollbar-hide">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section - Fixada na base */}
      <div className="border-t border-sidebar-border p-3 shrink-0">
        <Link
          to="/profile"
          className={cn(
            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
            location.pathname === '/profile'
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Configurações</span>}
        </Link>

        <div className="mt-3 flex items-center gap-3 rounded-xl bg-sidebar-accent/50 px-3 py-2.5">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-accent text-accent-foreground text-xs font-bold">
              {user?.name ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden text-left">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">
                {user?.name}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/60">
                {user?.role === 'aluno'
                  ? 'Estudante'
                  : user?.role === 'professor'
                  ? 'Professor(a)'
                  : 'Gestor(a)'}
              </p>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            'mt-2 w-full justify-start gap-3 text-sidebar-foreground/80 hover:bg-destructive/10 hover:text-destructive transition-colors',
            isCollapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Sair</span>}
        </Button>
      </div>
    </aside>
  );
}