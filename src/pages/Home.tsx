import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  School,
  Users,
  BookOpen,
  Trophy,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight,
  Loader2,
  GraduationCap,
  Target,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface DashboardStats {
  total_escolas?: number;
  total_professores?: number;
  total_alunos?: number;
  escolas_vinculadas?: number;
  meus_alunos?: number;
  minhas_trilhas?: number;
  trilhas_em_andamento?: number;
  trilhas_concluidas?: number;
  pontos?: number;
  nivel?: number;
  atividades_recentes?: Array<{
    id: number;
    title: string;
    type: string;
    created_at: string;
  }>;
}

export default function Home() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await dashboardApi.getStats();
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#012030]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in p-4 md:p-8">
      {user?.role === 'gestor' && <GestorDashboard stats={stats} />}
      {user?.role === 'professor' && <ProfessorDashboard stats={stats} />}
      {user?.role === 'aluno' && <AlunoDashboard stats={stats} />}
    </div>
  );
}

// --- DASHBOARD GESTOR ---
function GestorDashboard({ stats }: { stats?: DashboardStats }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#012030]">Painel do Gestor</h1>
          <p className="text-[#012030]">Gerencie suas escolas e acompanhe o desempenho</p>
        </div>
        <Button asChild className="bg-[#012030] text-white hover:bg-[#012030]/90">
          <Link to="/manager-schools">
            <Plus className="mr-2 h-4 w-4" /> Nova Escola
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total de Escolas" value={stats?.total_escolas ?? 0} icon={School} trend="+2 este mês" />
        <StatsCard title="Professores" value={stats?.total_professores ?? 0} icon={Users} trend="+5 este mês" />
        <StatsCard title="Total de Alunos" value={stats?.total_alunos ?? 0} icon={GraduationCap} trend="+23 este mês" />
        <StatsCard title="Trilhas Ativas" value={stats?.minhas_trilhas ?? 0} icon={BookOpen} />
      </div>
    </div>
  );
}

// --- DASHBOARD PROFESSOR ---
function ProfessorDashboard({ stats }: { stats?: DashboardStats }) {
  const hasSchool = (stats?.escolas_vinculadas ?? 0) > 0;
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#012030]">Painel do Professor</h1>
          <p className="text-[#012030]">Gerencie suas trilhas e acompanhe seus alunos</p>
        </div>
        <Button asChild className="bg-[#012030] text-white hover:bg-[#012030]/90">
          <Link to="/teacher-trails">
            <Plus className="mr-2 h-4 w-4" /> Nova Trilha
          </Link>
        </Button>
      </div>
      {!hasSchool && (
        <Alert className="border-yellow-400/50 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Vincule-se a uma escola</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Vá até seu perfil e insira o token de convite.
            <Button variant="link" asChild className="ml-2 h-auto p-0 text-yellow-800 underline">
              <Link to="/profile">Ir para o perfil</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Escolas Vinculadas" value={stats?.escolas_vinculadas ?? 0} icon={School} />
        <StatsCard title="Meus Alunos" value={stats?.meus_alunos ?? 0} icon={Users} />
        <StatsCard title="Minhas Trilhas" value={stats?.minhas_trilhas ?? 0} icon={BookOpen} />
        <StatsCard title="Trilhas Ativas" value={stats?.trilhas_em_andamento ?? 0} icon={TrendingUp} />
      </div>
    </div>
  );
}

// --- DASHBOARD ALUNO (Ajustado) ---
function AlunoDashboard({ stats }: { stats?: DashboardStats }) {
  const progressPercent = stats?.nivel ? Math.min((stats.pontos ?? 0) % 100, 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#012030]">Meu Painel</h1>
          <p className="text-[#012030]/70">Continue sua jornada de aprendizado</p>
        </div>
        <Button asChild className="bg-[#012030] text-white hover:bg-[#012030]/90">
          <Link to="/explore">
            <Target className="mr-2 h-4 w-4" /> Explorar Trilhas
          </Link>
        </Button>
      </div>

      {/* CARD DE PROGRESSO COM FIX DE RESPONSIVIDADE */}
      <Card className="overflow-hidden border-none shadow-xl" style={{
        background: `
          radial-gradient(circle at 25% 35%, rgba(69,196,176,0.35) 0%, transparent 40%),
          radial-gradient(circle at 70% 60%, rgba(154,235,163,0.25) 0%, transparent 45%),
          linear-gradient(180deg, #012030 0%, #012030 100%)
        `
      }}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 text-white md:flex-row md:items-center">
            {/* Esquerda: Nível */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div className="shrink-0">
                <p className="text-sm font-medium text-white/70 uppercase">Seu nível</p>
                <p className="font-display text-4xl font-extrabold leading-none">{stats?.nivel ?? 1}</p>
              </div>
            </div>

            {/* Direita: Barra de Progresso Flexível */}
            <div className="flex-1 min-w-0 w-full">
              <div className="mb-2 flex items-end justify-between text-sm">
                <span className="font-semibold truncate">{stats?.pontos ?? 0} pontos acumulados</span>
                <span className="text-white/60 text-xs shrink-0 ml-4">Próximo nível</span>
              </div>
              <div className="relative">
                <Progress value={progressPercent} className="h-3 bg-white/20" />
              </div>
              <div className="mt-2 flex justify-end">
                <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest bg-white/5 px-2 py-0.5 rounded">
                  Faltam {100 - progressPercent} pts
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Trilhas em Andamento" value={stats?.trilhas_em_andamento ?? 0} icon={BookOpen} />
        <StatsCard title="Trilhas Concluídas" value={stats?.trilhas_concluidas ?? 0} icon={Trophy} />
        <StatsCard title="Total de Pontos" value={stats?.pontos ?? 0} icon={TrendingUp} />
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, trend }: { title: string; value: number; icon: any; trend?: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
            <Icon className="h-6 w-6 text-[#012030]" />
          </div>
          {trend && <span className="text-xs text-[#012030] font-medium">{trend}</span>}
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold text-[#012030]">{value}</p>
          <p className="text-sm text-[#012030]/70">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}