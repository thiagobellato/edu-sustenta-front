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
        return 'bg-emerald-100 text-emerald-700';
      case 'intermediario':
        return 'bg-amber-100 text-amber-700';
      case 'avancado':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Explorar Trilhas</h1>
        <p className="text-muted-foreground">
          Descubra novas trilhas de aprendizado sobre sustentabilidade
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar trilhas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
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
          <SelectTrigger className="w-full md:w-[200px]">
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
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Compass className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Nenhuma trilha encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros de busca
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTrails.map((trail) => (
            <Card
              key={trail.id}
              className="group cursor-pointer overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Cover Image */}
              <div className="aspect-video gradient-primary relative overflow-hidden">
                {trail.cover_image ? (
                  <img
                    src={trail.cover_image}
                    alt={trail.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <BookOpen className="h-12 w-12 text-primary-foreground/50" />
                  </div>
                )}
                {trail.progress !== undefined && trail.progress > 0 && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-3">
                    <div className="flex items-center gap-2 text-primary-foreground">
                      <Progress value={trail.progress} className="h-2 flex-1" />
                      <span className="text-xs font-medium">{trail.progress}%</span>
                    </div>
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1 text-lg">
                    {trail.title}
                  </CardTitle>
                  {trail.rating && (
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{trail.rating}</span>
                    </div>
                  )}
                </div>
                <CardDescription className="line-clamp-2">
                  {trail.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge variant="outline">{trail.category}</Badge>
                  <Badge className={getDifficultyColor(trail.difficulty)}>
                    {trail.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{trail.duration_hours ?? 2}h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{trail.total_lessons ?? 5} aulas</span>
                  </div>
                  {trail.progress === 100 && (
                    <div className="flex items-center gap-1 text-primary">
                      <Trophy className="h-4 w-4" />
                      <span>Concluída</span>
                    </div>
                  )}
                </div>

                <Button className="mt-4 w-full gradient-primary">
                  {trail.progress && trail.progress > 0 && trail.progress < 100
                    ? 'Continuar'
                    : trail.progress === 100
                    ? 'Revisar'
                    : 'Iniciar'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
