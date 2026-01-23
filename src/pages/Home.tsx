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

  if (user?.role === 'gestor') {
    return <GestorDashboard stats={stats} />;
  }

  if (user?.role === 'professor') {
    return <ProfessorDashboard stats={stats} />;
  }

  return <AlunoDashboard stats={stats} />;
}

// Gestor Dashboard
function GestorDashboard({ stats }: { stats?: DashboardStats }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#012030]">Painel do Gestor</h1>
          <p className="text-[#012030]">
            Gerencie suas escolas e acompanhe o desempenho
          </p>
        </div>
        <Button asChild className="bg-[#012030] text-white hover:bg-[#012030]/90">
          <Link to="/manager-schools">
            <Plus className="mr-2 h-4 w-4" />
            Nova Escola
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Escolas"
          value={stats?.total_escolas ?? 0}
          icon={School}
          trend="+2 este mês"
        />
        <StatsCard
          title="Professores"
          value={stats?.total_professores ?? 0}
          icon={Users}
          trend="+5 este mês"
        />
        <StatsCard
          title="Total de Alunos"
          value={stats?.total_alunos ?? 0}
          icon={GraduationCap}
          trend="+23 este mês"
        />
        <StatsCard
          title="Trilhas Ativas"
          value={stats?.minhas_trilhas ?? 0}
          icon={BookOpen}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#012030]">Atividades Recentes</CardTitle>
          <CardDescription className="text-[#012030]/70">Últimas ações nas suas escolas</CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.atividades_recentes && stats.atividades_recentes.length > 0 ? (
            <div className="space-y-4">
              {stats.atividades_recentes.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <TrendingUp className="h-5 w-5 text-[#012030]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#012030]">{activity.title}</p>
                    <p className="text-sm text-[#012030]/60">
                      {new Date(activity.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-[#012030]/60">
              Nenhuma atividade recente
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Professor Dashboard
function ProfessorDashboard({ stats }: { stats?: DashboardStats }) {
  const hasSchool = (stats?.escolas_vinculadas ?? 0) > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#012030]">Painel do Professor</h1>
          <p className="text-[#012030]">
            Gerencie suas trilhas e acompanhe seus alunos
          </p>
        </div>
        <Button asChild className="bg-[#012030] text-white hover:bg-[#012030]/90">
          <Link to="/teacher-trails">
            <Plus className="mr-2 h-4 w-4" />
            Nova Trilha
          </Link>
        </Button>
      </div>

      {!hasSchool && (
        <Alert className="border-yellow-400/50 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Vincule-se a uma escola</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Você ainda não está vinculado a nenhuma escola. Vá até seu perfil e
            insira o token de convite fornecido pelo gestor.
            <Button
              variant="link"
              asChild
              className="ml-2 h-auto p-0 text-yellow-800 underline"
            >
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="group cursor-pointer transition-all hover:shadow-lg">
          <Link to="/teacher-trails">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#012030]">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#012030]">Gerenciar Trilhas</h3>
                <p className="text-sm text-[#012030]/70">Crie e edite suas trilhas de aprendizado</p>
              </div>
              <ArrowRight className="h-5 w-5 text-[#012030]/40 transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Link>
        </Card>

        <Card className="group cursor-pointer transition-all hover:shadow-lg">
          <Link to="/students">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <Users className="h-6 w-6 text-[#012030]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#012030]">Ver Alunos</h3>
                <p className="text-sm text-[#012030]/70">Acompanhe o progresso dos seus alunos</p>
              </div>
              <ArrowRight className="h-5 w-5 text-[#012030]/40 transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}

// Aluno Dashboard
function AlunoDashboard({ stats }: { stats?: DashboardStats }) {
  const progressPercent = stats?.nivel ? Math.min((stats.pontos ?? 0) % 100, 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#012030]">Meu Painel</h1>
          <p className="text-[#012030]/70">Continue sua jornada de aprendizado</p>
        </div>
        <Button asChild className="bg-[#012030] text-white hover:bg-[#012030]/90">
          <Link to="/explore">
            <Target className="mr-2 h-4 w-4" />
            Explorar Trilhas
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden" style={{
    background: `
      radial-gradient(circle at 25% 35%, rgba(69,196,176,0.35) 0%, transparent 40%),
      radial-gradient(circle at 70% 60%, rgba(154,235,163,0.25) 0%, transparent 45%),
      linear-gradient(180deg, #012030 0%, #012030 100%)
    `
  }}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 text-white md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80">Seu nível</p>
                <p className="font-display text-3xl font-bold">{stats?.nivel ?? 1}</p>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>{stats?.pontos ?? 0} pontos</span>
                <span>Próximo nível</span>
              </div>
              <Progress value={progressPercent} className="h-3 bg-white/20" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Trilhas em Andamento" value={stats?.trilhas_em_andamento ?? 0} icon={BookOpen} />
        <StatsCard title="Trilhas Concluídas" value={stats?.trilhas_concluidas ?? 0} icon={Trophy} />
        <StatsCard title="Total de Pontos" value={stats?.pontos ?? 0} icon={TrendingUp} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="group cursor-pointer transition-all hover:shadow-lg">
          <Link to="/explore">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#012030]">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#012030]">Explorar Trilhas</h3>
                <p className="text-sm text-[#012030]/70">Descubra novas trilhas de aprendizado</p>
              </div>
              <ArrowRight className="h-5 w-5 text-[#012030]/40 transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Link>
        </Card>


      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
            <Icon className="h-6 w-6 text-[#012030]" />
          </div>
          {trend && (
            <span className="text-xs text-[#012030] font-medium">{trend}</span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold text-[#012030]">{value}</p>
          <p className="text-sm text-[#012030]/70">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}