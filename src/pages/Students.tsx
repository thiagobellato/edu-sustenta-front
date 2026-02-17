import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Search, Filter, Loader2, BookOpen, Trophy, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { studentsApi } from '@/lib/api';

interface Student {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  trilhas_em_andamento: number;
  trilhas_concluidas: number;
  pontos: number;
  nivel: number;
  ultimo_acesso?: string;
}

export default function Students() {
  const [search, setSearch] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  const { data: students, isLoading } = useQuery<Student[]>({
    queryKey: ['students', filterBy],
    queryFn: async () => {
      const response = await studentsApi.getAll();
      return response.data;
    },
  });

  const filteredStudents = students?.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#012030]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#012030]">Meus Alunos</h1>
          <p className="text-[#012030]/70">
            Acompanhe o progresso dos seus alunos nas trilhas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-secondary text-[#012030] border-none px-3 py-1">
            <Users className="mr-2 h-4 w-4" />
            <span className="font-bold">{students?.length ?? 0}</span>
            <span className="ml-1 opacity-70 font-normal">alunos</span>
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-[#012030]/10 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#012030]/40" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-[#012030]/10 focus:border-[#012030]"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full sm:w-[200px] border-[#012030]/10 text-[#012030]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos (últimos 7 dias)</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
                <SelectItem value="top">Melhores pontuações</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      {filteredStudents && filteredStudents.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Users className="h-8 w-8 text-[#012030]/30" />
            </div>
            <p className="text-lg font-bold text-[#012030]">Nenhum aluno encontrado</p>
            <p className="text-[#012030]/60">
              {search ? 'Tente buscar por outro termo' : 'Seus alunos aparecerão aqui'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StudentCard({ student }: { student: Student }) {
  const progressPercent = Math.min((student.pontos % 100), 100);

  return (
    <Card className="group transition-all hover:shadow-lg border-[#012030]/10 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 border-2 border-secondary">
            <AvatarImage src={student.avatar} alt={student.name} />
            <AvatarFallback className="bg-[#012030] text-white">
              {student.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate font-bold text-[#012030]">{student.name}</CardTitle>
            <CardDescription className="truncate text-[#012030]/60">{student.email}</CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0 bg-[#012030]/5 text-[#012030] font-bold border-none">
            Nível {student.nivel}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-2">
        {/* Progress to next level */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-bold text-[#012030]/50">
            <span>Experiência</span>
            <span className="text-[#012030]">{student.pontos} pts</span>
          </div>
          <Progress value={progressPercent} className="h-2 bg-secondary" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-secondary/40 p-3 text-center transition-colors group-hover:bg-secondary/60">
            <BookOpen className="mx-auto h-4 w-4 text-[#012030]/70" />
            <p className="mt-1 text-lg font-bold text-[#012030]">{student.trilhas_em_andamento}</p>
            <p className="text-[10px] uppercase font-bold text-[#012030]/40">Ativas</p>
          </div>
          <div className="rounded-xl bg-secondary/40 p-3 text-center transition-colors group-hover:bg-secondary/60">
            <Trophy className="mx-auto h-4 w-4 text-amber-600" />
            <p className="mt-1 text-lg font-bold text-[#012030]">{student.trilhas_concluidas}</p>
            <p className="text-[10px] uppercase font-bold text-[#012030]/40">Feitas</p>
          </div>
          <div className="rounded-xl bg-secondary/40 p-3 text-center transition-colors group-hover:bg-secondary/60">
            <TrendingUp className="mx-auto h-4 w-4 text-[#012030]/70" />
            <p className="mt-1 text-lg font-bold text-[#012030]">{student.pontos}</p>
            <p className="text-[10px] uppercase font-bold text-[#012030]/40">Total</p>
          </div>
        </div>

        {/* Last access */}
        {student.ultimo_acesso && (
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[11px] font-medium text-[#012030]/50">
              Acesso em: {new Date(student.ultimo_acesso).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}