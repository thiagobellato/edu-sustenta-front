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
        <Loader2 className="h-8 w-8 animate-spin text-[#012030]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#012030]">Minhas Trilhas</h1>
          <p className="text-[#012030]/70">
            Crie e gerencie suas trilhas de aprendizado
          </p>
        </div>
        <Button asChild className="bg-[#012030] text-white hover:bg-[#012030]/90">
          <Link to="/teacher-trails/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova Trilha
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#012030]/50" />
        <Input
          placeholder="Buscar trilhas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-[#012030]/10 focus:border-[#012030]"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="published" className="space-y-6">
        <TabsList className="bg-secondary/50 border border-[#012030]/5">
          <TabsTrigger value="published" className="gap-2 data-[state=active]:bg-[#012030] data-[state=active]:text-white">
            <CheckCircle className="h-4 w-4" />
            Publicadas ({publishedTrails.length})
          </TabsTrigger>
          <TabsTrigger value="drafts" className="gap-2 data-[state=active]:bg-[#012030] data-[state=active]:text-white">
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
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <BookOpen className="h-8 w-8 text-[#012030]/40" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-[#012030]">Nenhuma trilha encontrada</h3>
          <p className="text-[#012030]/60">
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
          className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg border-[#012030]/10"
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
            <Badge
              className={`absolute right-3 top-3 border-none ${
                trail.status === 'published' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-amber-500 text-white'
              }`}
            >
              {trail.status === 'published' ? 'Publicada' : 'Rascunho'}
            </Badge>
          </div>

          <CardHeader>
            <CardTitle className="line-clamp-1 font-bold text-[#012030]">{trail.title}</CardTitle>
            <CardDescription className="line-clamp-2 text-[#012030]/70">
              {trail.description}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between text-sm text-[#012030]/60">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(trail.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              {trail.total_students !== undefined && (
                <span className="font-medium text-[#012030]">{trail.total_students} alunos</span>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Badge variant="outline" className="border-[#012030]/20 text-[#012030]">{trail.category}</Badge>
              <Badge variant="outline" className="border-[#012030]/20 text-[#012030]">{trail.difficulty}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}