import { useQuery } from '@tanstack/react-query';
import { Users, Search, Filter, Loader2, BookOpen, Trophy, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meus Alunos</h1>
          <p className="text-muted-foreground">
            Acompanhe o progresso dos seus alunos nas trilhas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            <Users className="mr-1 h-4 w-4" />
            {students?.length ?? 0} alunos
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full sm:w-[200px]">
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
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              Nenhum aluno encontrado
            </p>
            <p className="text-sm text-muted-foreground">
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
    <Card className="transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={student.avatar} alt={student.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {student.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{student.name}</CardTitle>
            <CardDescription className="truncate">{student.email}</CardDescription>
          </div>
          <Badge variant="outline" className="shrink-0">
            Nível {student.nivel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress to next level */}
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{student.pontos} pts</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-secondary p-2">
            <BookOpen className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1 text-lg font-bold">{student.trilhas_em_andamento}</p>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </div>
          <div className="rounded-lg bg-secondary p-2">
            <Trophy className="mx-auto h-4 w-4 text-accent-foreground" />
            <p className="mt-1 text-lg font-bold">{student.trilhas_concluidas}</p>
            <p className="text-xs text-muted-foreground">Concluídas</p>
          </div>
          <div className="rounded-lg bg-secondary p-2">
            <TrendingUp className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1 text-lg font-bold">{student.pontos}</p>
            <p className="text-xs text-muted-foreground">Pontos</p>
          </div>
        </div>

        {/* Last access */}
        {student.ultimo_acesso && (
          <p className="text-xs text-muted-foreground text-center">
            Último acesso: {new Date(student.ultimo_acesso).toLocaleDateString('pt-BR')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
