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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Escolas</h1>
          <p className="text-muted-foreground">
            Gerencie suas escolas e tokens de convite
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              Nova Escola
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Escola</DialogTitle>
              <DialogDescription>
                Preencha os dados para cadastrar uma nova escola
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Escola</Label>
                <Input
                  id="name"
                  placeholder="Ex: Escola Municipal Verde Vida"
                  {...register('name')}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0001-00"
                  {...register('cnpj')}
                  className={errors.cnpj ? 'border-destructive' : ''}
                />
                {errors.cnpj && (
                  <p className="text-sm text-destructive">{errors.cnpj.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 gradient-primary"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar Escola'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Schools Grid */}
      {schools.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <School className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Nenhuma escola cadastrada</h3>
            <p className="mb-4 text-muted-foreground">
              Crie sua primeira escola para começar a gerenciar
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              Criar Escola
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {schools.map((school) => (
            <Card key={school.id} className="overflow-hidden">
              <div className="h-2 gradient-primary" />
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                    <School className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{school.name}</CardTitle>
                    <CardDescription>{school.cnpj}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{school.total_professores ?? 0} professores</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{school.total_alunos ?? 0} alunos</span>
                  </div>
                </div>

                {/* Invite Token */}
                <div className="rounded-lg border bg-muted/50 p-3">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Token de Convite
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 truncate rounded bg-background px-2 py-1 text-xs">
                      {school.invite_token}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToken(school.id, school.invite_token)}
                      className="shrink-0"
                    >
                      {copiedToken === school.id ? (
                        <CheckCircle className="h-4 w-4 text-primary" />
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
