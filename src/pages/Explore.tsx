import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Compass,
  BookOpen,
  Loader2,
  Search,
  Filter,
  Clock,
  Star,
  Trophy,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { trailsApi } from '@/lib/api';

interface Trail {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  cover_image?: string;
  duration_hours?: number;
  rating?: number;
  progress?: number;
  total_lessons?: number;
}

const categories = [
  { value: 'all', label: 'Todas as categorias' },
  { value: 'residuos', label: 'Resíduos' },
  { value: 'agua', label: 'Água' },
  { value: 'energia', label: 'Energia' },
  { value: 'biodiversidade', label: 'Biodiversidade' },
  { value: 'clima', label: 'Clima' },
];

const difficulties = [
  { value: 'all', label: 'Todas as dificuldades' },
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'intermediario', label: 'Intermediário' },
  { value: 'avancado', label: 'Avançado' },
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  const { data: trails = [], isLoading } = useQuery<Trail[]>({
    queryKey: ['explore-trails', category, difficulty],
    queryFn: async () => {
      const params: Record<string, string> = { status: 'published' };
      if (category !== 'all') params.category = category;
      if (difficulty !== 'all') params.difficulty = difficulty;
      const response = await trailsApi.getAll(params);
      return response.data;
    },
  });

  const filteredTrails = trails.filter(
    (trail) =>
      trail.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trail.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'iniciante':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'intermediario':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'avancado':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-secondary text-[#012030]';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#012030]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-[#012030]">Explorar Trilhas</h1>
        <p className="text-[#012030]/70">
          Descubra novas trilhas de aprendizado sobre sustentabilidade
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#012030]/50" />
          <Input
            placeholder="Buscar trilhas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#012030]/10 focus:border-[#012030]"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-[200px] border-[#012030]/10 text-[#012030]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-full md:w-[200px] border-[#012030]/10 text-[#012030]">
            <SelectValue placeholder="Dificuldade" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map((diff) => (
              <SelectItem key={diff.value} value={diff.value}>
                {diff.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Trails Grid */}
      {filteredTrails.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Compass className="h-8 w-8 text-[#012030]/40" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[#012030]">Nenhuma trilha encontrada</h3>
            <p className="text-[#012030]/60">
              Tente ajustar os filtros de busca
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTrails.map((trail) => (
            <Card
              key={trail.id}
              className="group cursor-pointer overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg border-[#012030]/10"
            >
              {/* Cover Image */}
              <div className="aspect-video relative overflow-hidden bg-[#012030]">
                {trail.cover_image ? (
                  <img
                    src={trail.cover_image}
                    alt={trail.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center" style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(69,196,176,0.2) 0%, transparent 100%), #012030`
                  }}>
                    <BookOpen className="h-12 w-12 text-white/20" />
                  </div>
                )}
                
                {/* Progress Overlay */}
                {trail.progress !== undefined && trail.progress > 0 && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#012030] to-transparent p-4">
                    <div className="flex items-center gap-2 text-white">
                      <Progress value={trail.progress} className="h-1.5 flex-1 bg-white/20" />
                      <span className="text-[10px] font-bold">{trail.progress}%</span>
                    </div>
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1 text-lg font-bold text-[#012030]">
                    {trail.title}
                  </CardTitle>
                  {trail.rating && (
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-bold">{trail.rating}</span>
                    </div>
                  )}
                </div>
                <CardDescription className="line-clamp-2 text-[#012030]/70">
                  {trail.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-[#012030]/20 text-[#012030]">
                    {trail.category}
                  </Badge>
                  <Badge variant="secondary" className={getDifficultyColor(trail.difficulty)}>
                    {trail.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-[#012030]/60">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{trail.duration_hours ?? 2}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{trail.total_lessons ?? 5} aulas</span>
                    </div>
                  </div>
                  
                  {trail.progress === 100 && (
                    <div className="flex items-center gap-1 text-emerald-600 font-medium">
                      <Trophy className="h-4 w-4" />
                      <span>Concluída</span>
                    </div>
                  )}
                </div>

                <Button className="mt-4 w-full bg-[#012030] text-white hover:bg-[#012030]/90 transition-colors">
                  {trail.progress && trail.progress > 0 && trail.progress < 100
                    ? 'Continuar Trilha'
                    : trail.progress === 100
                    ? 'Revisar Conteúdo'
                    : 'Iniciar Jornada'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}