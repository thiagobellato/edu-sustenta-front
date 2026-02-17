import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Loader2,
  FileText,
  CheckCircle,
  Clock,
  Search,
  Edit,
  Send,
  Trash2,
  Archive,
  ArchiveRestore,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { trailsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Trail {
  id: number;
  title: string;
  description: string;
  category?: string | null;
  difficulty?: string | null;
  status: 'draft' | 'published' | 'archived';
  cover_image?: string;
  total_students?: number;
  created_at: string;
}

export default function TeacherTrails() {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: trails = [], isLoading } = useQuery<Trail[]>({
    queryKey: ['teacher-trails'],
    queryFn: async () => {
      const response = await trailsApi.getAll();
      return response.data;
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (trailId: number) => {
      await trailsApi.update(trailId, { status: 'published' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-trails'] });
      toast({
        title: 'Trilha publicada!',
        description: 'Sua trilha foi publicada com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao publicar trilha',
        description: error.response?.data?.detail || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async (trailId: number) => {
      await trailsApi.update(trailId, { status: 'archived' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-trails'] });
      toast({
        title: 'Trilha desativada',
        description: 'A trilha não aparecerá mais para os alunos. Você pode reativá-la quando quiser.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao desativar trilha',
        description: error.response?.data?.detail || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: async (trailId: number) => {
      await trailsApi.update(trailId, { status: 'published' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-trails'] });
      toast({
        title: 'Trilha reativada!',
        description: 'A trilha está visível novamente para os alunos.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao reativar trilha',
        description: error.response?.data?.detail || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (trailId: number) => {
      await trailsApi.delete(trailId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-trails'] });
      toast({
        title: 'Trilha excluída',
        description: 'A trilha em rascunho foi excluída permanentemente.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir trilha',
        description: error.response?.data?.detail || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    },
  });

  const publishedTrails = trails.filter((t) => t.status === 'published');
  const draftTrails = trails.filter((t) => t.status === 'draft');
  const archivedTrails = trails.filter((t) => t.status === 'archived');

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
          <TabsTrigger value="archived" className="gap-2 data-[state=active]:bg-[#012030] data-[state=active]:text-white">
            <Archive className="h-4 w-4" />
            Desativadas ({archivedTrails.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="published">
          <TrailGrid 
            trails={filterTrails(publishedTrails)} 
            onPublish={publishMutation.mutate}
            onArchive={archiveMutation.mutate}
            onReactivate={reactivateMutation.mutate}
            onDelete={deleteMutation.mutate}
            isPublishing={publishMutation.isPending}
            isArchiving={archiveMutation.isPending}
            isReactivating={reactivateMutation.isPending}
            isDeleting={deleteMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="drafts">
          <TrailGrid 
            trails={filterTrails(draftTrails)} 
            onPublish={publishMutation.mutate}
            onArchive={archiveMutation.mutate}
            onReactivate={reactivateMutation.mutate}
            onDelete={deleteMutation.mutate}
            isPublishing={publishMutation.isPending}
            isArchiving={archiveMutation.isPending}
            isReactivating={reactivateMutation.isPending}
            isDeleting={deleteMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="archived">
          <TrailGrid 
            trails={filterTrails(archivedTrails)} 
            onPublish={publishMutation.mutate}
            onArchive={archiveMutation.mutate}
            onReactivate={reactivateMutation.mutate}
            onDelete={deleteMutation.mutate}
            isPublishing={publishMutation.isPending}
            isArchiving={archiveMutation.isPending}
            isReactivating={reactivateMutation.isPending}
            isDeleting={deleteMutation.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TrailGrid({ 
  trails, 
  onPublish, 
  onArchive,
  onReactivate,
  onDelete,
  isPublishing,
  isArchiving,
  isReactivating,
  isDeleting,
}: { 
  trails: Trail[];
  onPublish: (id: number) => void;
  onArchive: (id: number) => void;
  onReactivate: (id: number) => void;
  onDelete: (id: number) => void;
  isPublishing: boolean;
  isArchiving: boolean;
  isReactivating: boolean;
  isDeleting: boolean;
}) {
  const isBusy = isPublishing || isArchiving || isReactivating || isDeleting;
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
                  : trail.status === 'archived'
                  ? 'bg-slate-500 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {trail.status === 'published' ? 'Publicada' : trail.status === 'archived' ? 'Desativada' : 'Rascunho'}
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
              {trail.category && (
                <Badge variant="outline" className="border-[#012030]/20 text-[#012030]">{trail.category}</Badge>
              )}
              {trail.difficulty && (
                <Badge variant="outline" className="border-[#012030]/20 text-[#012030]">{trail.difficulty}</Badge>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-[#012030]/10"
              >
                <Link to={`/teacher-trails/${trail.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
              </Button>
              {trail.status === 'draft' && (
                <>
                  <Button
                    onClick={() => onPublish(trail.id)}
                    disabled={isBusy}
                    size="sm"
                    className="bg-[#012030] text-white hover:bg-[#012030]/90"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publicando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Publicar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(trail.id)}
                    disabled={isBusy}
                    className="border-destructive text-destructive hover:bg-destructive/10"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </>
                    )}
                  </Button>
                </>
              )}
              {trail.status === 'published' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onArchive(trail.id)}
                  disabled={isBusy}
                  className="border-slate-400 text-slate-600 hover:bg-slate-100"
                >
                  {isArchiving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Archive className="mr-2 h-4 w-4" />
                      Desativar
                    </>
                  )}
                </Button>
              )}
              {trail.status === 'archived' && (
                <Button
                  size="sm"
                  onClick={() => onReactivate(trail.id)}
                  disabled={isBusy}
                  className="bg-[#012030] text-white hover:bg-[#012030]/90"
                >
                  {isReactivating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <ArchiveRestore className="mr-2 h-4 w-4" />
                      Reativar
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}