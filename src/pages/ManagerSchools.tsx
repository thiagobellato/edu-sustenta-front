import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  School,
  Plus,
  Copy,
  CheckCircle,
  Loader2,
  Users,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { schoolsApi } from '@/lib/api';

interface SchoolData {
  id: number;
  name: string;
  cnpj: string;
  invite_token: string;
  total_professores?: number;
  total_alunos?: number;
  created_at: string;
}

const schoolSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  cnpj: z.string().min(14, 'CNPJ inválido').max(18),
});

type SchoolForm = z.infer<typeof schoolSchema>;

export default function ManagerSchools() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: schools = [], isLoading } = useQuery<SchoolData[]>({
    queryKey: ['schools'],
    queryFn: async () => {
      const response = await schoolsApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; cnpj: string }) => schoolsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast({
        title: 'Escola criada!',
        description: 'A escola foi criada com sucesso.',
      });
      setIsDialogOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar escola',
        description: error.response?.data?.detail || 'Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SchoolForm>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: '',
      cnpj: '',
    },
  });

  const onSubmit = (data: SchoolForm) => {
    createMutation.mutate({ name: data.name, cnpj: data.cnpj });
  };

  const copyToken = async (schoolId: number, token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(schoolId);
      toast({
        title: 'Token copiado!',
        description: 'O token foi copiado para a área de transferência.',
      });
      setTimeout(() => setCopiedToken(null), 2000);
    } catch {
      toast({
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar o token.',
        variant: 'destructive',
      });
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#012030]">Gestão de Escolas</h1>
          <p className="text-[#012030]/70">
            Gerencie suas instituições e tokens de acesso
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#012030] text-white hover:bg-[#012030]/90">
              <Plus className="mr-2 h-4 w-4" />
              Nova Escola
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl font-bold text-[#012030]">Criar Escola</DialogTitle>
              <DialogDescription>
                Cadastre uma nova unidade escolar no sistema
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#012030]/80">Nome da Escola</Label>
                <Input
                  id="name"
                  placeholder="Ex: Unidade Central"
                  {...register('name')}
                  className={`border-[#012030]/10 focus:border-[#012030] ${errors.name ? 'border-destructive' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj" className="text-[#012030]/80">CNPJ</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0001-00"
                  {...register('cnpj')}
                  className={`border-[#012030]/10 focus:border-[#012030] ${errors.cnpj ? 'border-destructive' : ''}`}
                />
                {errors.cnpj && (
                  <p className="text-sm font-medium text-destructive">{errors.cnpj.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 border-[#012030]/10 text-[#012030]"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 bg-[#012030] text-white hover:bg-[#012030]/90"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Salvar Escola'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Schools Grid */}
      {schools.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <School className="h-10 w-10 text-[#012030]/20" />
            </div>
            <h3 className="text-xl font-bold text-[#012030]">Nenhuma escola por aqui</h3>
            <p className="mb-6 text-[#012030]/60 max-w-[300px] text-center">
              Você ainda não cadastrou nenhuma unidade de ensino.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-[#012030] text-white">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira Escola
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {schools.map((school) => (
            <Card key={school.id} className="group overflow-hidden border-[#012030]/10 transition-all hover:shadow-md">
              <div className="h-1.5 bg-[#012030]/10 group-hover:bg-[#012030] transition-colors" />
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-[#012030]/5">
                    <School className="h-6 w-6 text-[#012030]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-bold text-[#012030] truncate">{school.name}</CardTitle>
                    <CardDescription className="font-mono text-[11px] uppercase tracking-tighter">CNPJ: {school.cnpj}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats Row */}
                <div className="flex gap-6 border-y border-[#012030]/5 py-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#012030]/40" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#012030]">{school.total_professores ?? 0}</span>
                      <span className="text-[10px] uppercase font-bold text-[#012030]/40 tracking-wider">Professores</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#012030]/40" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#012030]">{school.total_alunos ?? 0}</span>
                      <span className="text-[10px] uppercase font-bold text-[#012030]/40 tracking-wider">Alunos</span>
                    </div>
                  </div>
                </div>

                {/* Invite Token Area */}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-[#012030]/40 tracking-widest">Token de Convite</Label>
                  <div className="flex items-center gap-2 rounded-xl bg-secondary/50 border border-[#012030]/5 p-2 transition-colors hover:bg-secondary">
                    <code className="flex-1 truncate px-2 font-mono text-xs font-semibold text-[#012030]/80">
                      {school.invite_token}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyToken(school.id, school.invite_token)}
                      className="h-8 w-8 text-[#012030] hover:bg-[#012030]/10"
                    >
                      {copiedToken === school.id ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}