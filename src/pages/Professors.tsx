import { useQuery } from '@tanstack/react-query';
import { Users, Search, Loader2, BookOpen, School, Mail, MoreVertical, Calendar } from 'lucide-react';
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

export default function Professors() {
  const [search, setSearch] = useState('');

  const { data: professors, isLoading, isError, error } = useQuery({
    queryKey: ['professors'],
    queryFn: async () => {
      try {
        const response = await professorsApi.getAll();
        console.log("Dados da API:", response.data); // DEBUG
        return response.data || [];
      } catch (err) {
        console.error("Erro na requisição:", err);
        throw err;
      }
    },
  });

  // Filtro seguro: garante que não tenta filtrar algo que não é array
  const filteredProfessors = Array.isArray(professors) 
    ? professors.filter((p) =>
        (p.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (p.email?.toLowerCase() || "").includes(search.toLowerCase())
      )
    : [];

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#012030]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center p-4">
        <p className="text-red-500 font-bold">Falha ao carregar dados.</p>
        <pre className="text-xs bg-gray-100 p-2 mt-2">{(error as any)?.message}</pre>
        <Button onClick={() => window.location.reload()} className="mt-4">Recarregar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-3xl font-bold text-[#012030]">Corpo Docente</h1>
        <Badge className="bg-[#012030] text-white">
          {filteredProfessors.length} Professores
        </Badge>
      </div>

      <Input
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border-[#012030]/10"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProfessors.map((professor) => (
          <ProfessorCard key={professor.id} professor={professor} />
        ))}
      </div>
    </div>
  );
}

function ProfessorCard({ professor }: { professor: any }) {
  // O principal motivo de tela branca é tentar acessar .map() em algo nulo
  const escolas = Array.isArray(professor.escolas) ? professor.escolas : [];

  // Formatação de data segura para evitar quebra se a string for inválida
  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return null;
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch {
      return null;
    }
  };

  return (
    <Card className="border-[#012030]/10 overflow-hidden shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={professor.avatar} />
            <AvatarFallback className="bg-[#012030] text-white">
              {professor.name?.substring(0, 2).toUpperCase() || "P"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-bold text-[#012030] truncate">{professor.name || "Sem Nome"}</p>
            <p className="text-xs text-gray-500 truncate">{professor.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {escolas.map((escola: any) => (
            <Badge key={escola.id} variant="secondary" className="text-[10px]">
              {escola.nome || escola.name}
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-secondary/20 p-2 rounded text-center">
            <p className="text-lg font-bold">{professor.total_trilhas || 0}</p>
            <p className="text-[10px] uppercase opacity-50">Trilhas</p>
          </div>
          <div className="bg-secondary/20 p-2 rounded text-center">
            <p className="text-lg font-bold">{professor.total_alunos || 0}</p>
            <p className="text-[10px] uppercase opacity-50">Alunos</p>
          </div>
        </div>
        {professor.criado_em && (
          <p className="text-[10px] text-center text-gray-400">
            Desde: {formatDate(professor.criado_em)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}