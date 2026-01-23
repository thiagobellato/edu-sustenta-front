import { useQuery } from '@tanstack/react-query';
import { Users, Search, Loader2, BookOpen, School, Mail, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { professorsApi } from '@/lib/api';

interface Professor {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  escolas: Array<{ id: number; nome: string }>;
  total_trilhas: number;
  total_alunos: number;
  criado_em?: string;
}

export default function Professors() {
  const [search, setSearch] = useState('');

  const { data: professors, isLoading } = useQuery<Professor[]>({
    queryKey: ['professors'],
    queryFn: async () => {
      const response = await professorsApi.getAll();
      return response.data;
    },
  });

  const filteredProfessors = professors?.filter((professor) =>
    professor.name.toLowerCase().includes(search.toLowerCase()) ||
    professor.email.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Professores</h1>
          <p className="text-muted-foreground">
            Gerencie os professores vinculados às suas escolas
          </p>
        </div>
        <Badge variant="secondary" className="text-sm w-fit">
          <Users className="mr-1 h-4 w-4" />
          {professors?.length ?? 0} professores
        </Badge>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Professors Grid */}
      {filteredProfessors && filteredProfessors.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfessors.map((professor) => (
            <ProfessorCard key={professor.id} professor={professor} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              Nenhum professor encontrado
            </p>
            <p className="text-sm text-muted-foreground">
              {search ? 'Tente buscar por outro termo' : 'Convide professores usando o token da escola'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ProfessorCard({ professor }: { professor: Professor }) {
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={professor.avatar} alt={professor.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {professor.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{professor.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 truncate">
              <Mail className="h-3 w-3" />
              {professor.email}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Ver perfil</DropdownMenuItem>
              <DropdownMenuItem>Enviar mensagem</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Desvincular</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Schools */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Escolas vinculadas</p>
          <div className="flex flex-wrap gap-1">
            {professor.escolas.length > 0 ? (
              professor.escolas.map((escola) => (
                <Badge key={escola.id} variant="secondary" className="text-xs">
                  <School className="mr-1 h-3 w-3" />
                  {escola.nome}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Nenhuma escola</span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-secondary p-3 text-center">
            <BookOpen className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-1 text-xl font-bold">{professor.total_trilhas}</p>
            <p className="text-xs text-muted-foreground">Trilhas criadas</p>
          </div>
          <div className="rounded-lg bg-secondary p-3 text-center">
            <Users className="mx-auto h-5 w-5 text-accent-foreground" />
            <p className="mt-1 text-xl font-bold">{professor.total_alunos}</p>
            <p className="text-xs text-muted-foreground">Alunos</p>
          </div>
        </div>

        {/* Join date */}
        {professor.criado_em && (
          <p className="text-xs text-muted-foreground text-center">
            Membro desde: {new Date(professor.criado_em).toLocaleDateString('pt-BR')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
