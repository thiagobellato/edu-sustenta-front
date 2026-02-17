import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  Loader2,
  ArrowLeft,
  Clock,
  User,
  CheckCircle,
  Circle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trailsApi } from '@/lib/api';

interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
}

interface Trail {
  id: number;
  title: string;
  description: string;
  category?: string;
  difficulty?: string;
  cover_image?: string;
  created_by_name?: string;
  created_at: string;
  modules: Module[];
}

export default function TrailDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: trail, isLoading, error } = useQuery<Trail>({
    queryKey: ['trail', id],
    queryFn: async () => {
      const response = await trailsApi.getOne(Number(id));
      return response.data;
    },
    enabled: !!id,
  });

  const handleGoBack = () => {
    // Sempre volta para /explore para garantir navegação correta
    navigate('/explore');
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#012030]" />
      </div>
    );
  }

  if (error || !trail) {
    return (
      <div className="space-y-6 animate-fade-in p-4 md:p-8">
        <Button
          variant="outline"
          onClick={handleGoBack}
          className="border-[#012030]/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Card className="border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <BookOpen className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[#012030]">Trilha não encontrada</h3>
            <p className="text-[#012030]/60">
              A trilha que você está procurando não existe ou não está mais disponível.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getDifficultyColor = (diff?: string) => {
    if (!diff) return 'bg-secondary text-[#012030]';
    switch (diff.toLowerCase()) {
      case 'iniciante':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'intermediario':
      case 'intermediário':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'avancado':
      case 'avançado':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-secondary text-[#012030]';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-4 md:p-8">
      {/* Header com botão Voltar */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={handleGoBack}
          className="border-[#012030]/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      {/* Cover Image */}
      {trail.cover_image && (
        <div className="relative h-64 w-full overflow-hidden rounded-lg">
          <img
            src={trail.cover_image}
            alt={trail.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Informações da Trilha */}
      <Card className="border-[#012030]/10">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold text-[#012030] mb-2">
                {trail.title}
              </CardTitle>
              <CardDescription className="text-lg text-[#012030]/70">
                {trail.description}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {trail.category && (
                <Badge variant="outline" className="border-[#012030]/20 text-[#012030]">
                  {trail.category}
                </Badge>
              )}
              {trail.difficulty && (
                <Badge variant="secondary" className={getDifficultyColor(trail.difficulty)}>
                  {trail.difficulty}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#012030]/60">
            {trail.created_by_name && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Por {trail.created_by_name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Criada em {new Date(trail.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{trail.modules?.length || 0} módulo{trail.modules?.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Módulos */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[#012030]">Módulos da Trilha</h2>
        
        {trail.modules && trail.modules.length > 0 ? (
          <div className="space-y-4">
            {trail.modules.map((module, index) => (
              <Card key={module.id} className="border-[#012030]/10">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#012030] text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-[#012030]">
                        {module.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pl-14">
                  <CardDescription className="text-[#012030]/70 text-base">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="h-12 w-12 text-[#012030]/30 mb-4" />
              <p className="text-[#012030]/60">Esta trilha ainda não possui módulos cadastrados.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Botão de ação */}
      <div className="flex justify-center gap-4 pt-4">
        <Button
          onClick={handleGoBack}
          variant="outline"
          className="border-[#012030]/10"
        >
          Voltar para Explorar
        </Button>
        <Button className="bg-[#012030] text-white hover:bg-[#012030]/90">
          <CheckCircle className="mr-2 h-4 w-4" />
          Iniciar Trilha
        </Button>
      </div>
    </div>
  );
}
