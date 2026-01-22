import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Loader2,
  FileText,
  CheckCircle,
  Clock,
  Search,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { trailsApi } from '@/lib/api';

interface Trail {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  status: 'draft' | 'published';
  cover_image?: string;
  total_students?: number;
  created_at: string;
}

export default function TeacherTrails() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: trails = [], isLoading } = useQuery<Trail[]>({
    queryKey: ['teacher-trails'],
    queryFn: async () => {
      const response = await trailsApi.getAll();
      return response.data;
    },
  });

  const publishedTrails = trails.filter((t) => t.status === 'published');
  const draftTrails = trails.filter((t) => t.status === 'draft');

  const filterTrails = (trailList: Trail[]) => {
    if (!searchQuery) return trailList;
    return trailList.filter(
      (trail) =>
        trail.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trail.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Minhas Trilhas</h1>
          <p className="text-muted-foreground">
            Crie e gerencie suas trilhas de aprendizado
          </p>
        </div>
        <Button className="gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          Nova Trilha
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar trilhas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="published" className="space-y-6">
        <TabsList>
          <TabsTrigger value="published" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Publicadas ({publishedTrails.length})
          </TabsTrigger>
          <TabsTrigger value="drafts" className="gap-2">
            <FileText className="h-4 w-4" />
            Rascunhos ({draftTrails.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="published">
          <TrailGrid trails={filterTrails(publishedTrails)} />
        </TabsContent>

        <TabsContent value="drafts">
          <TrailGrid trails={filterTrails(draftTrails)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TrailGrid({ trails }: { trails: Trail[] }) {
  if (trails.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Nenhuma trilha encontrada</h3>
          <p className="text-muted-foreground">
            Comece criando sua primeira trilha de aprendizado
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {trails.map((trail) => (
        <Card
          key={trail.id}
          className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          {/* Cover Image */}
          <div className="aspect-video gradient-primary relative overflow-hidden">
            {trail.cover_image ? (
              <img
                src={trail.cover_image}
                alt={trail.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <BookOpen className="h-12 w-12 text-primary-foreground/50" />
              </div>
            )}
            <Badge
              variant={trail.status === 'published' ? 'default' : 'secondary'}
              className="absolute right-3 top-3"
            >
              {trail.status === 'published' ? 'Publicada' : 'Rascunho'}
            </Badge>
          </div>

          <CardHeader>
            <CardTitle className="line-clamp-1">{trail.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {trail.description}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(trail.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              {trail.total_students !== undefined && (
                <span>{trail.total_students} alunos</span>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Badge variant="outline">{trail.category}</Badge>
              <Badge variant="outline">{trail.difficulty}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
