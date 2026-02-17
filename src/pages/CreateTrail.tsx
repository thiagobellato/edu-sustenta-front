import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Plus, Trash2, Save, X, Loader2, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { trailsApi } from '@/lib/api';

const moduleSchema = z.object({
  title: z.string().min(1, 'Título do módulo é obrigatório'),
  description: z.string().min(1, 'Descrição do módulo é obrigatória'),
});

const trailSchema = z.object({
  title: z.string().min(1, 'Título da trilha é obrigatório'),
  description: z.string().min(1, 'Descrição da trilha é obrigatória'),
  modules: z.array(moduleSchema).min(1, 'Adicione pelo menos um módulo'),
});

type TrailForm = z.infer<typeof trailSchema>;

export default function CreateTrail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TrailForm>({
    resolver: zodResolver(trailSchema),
    defaultValues: {
      title: '',
      description: '',
      modules: [{ title: '', description: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'modules',
  });

  // Carregar dados da trilha se estiver editando
  const { data: trailData, isLoading: isLoadingTrail } = useQuery({
    queryKey: ['trail', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await trailsApi.getOne(Number(id));
      return response.data;
    },
    enabled: !!id,
  });

  // Preencher formulário quando os dados forem carregados
  useEffect(() => {
    if (trailData) {
      reset({
        title: trailData.title || '',
        description: trailData.description || '',
        modules: trailData.modules && trailData.modules.length > 0
          ? trailData.modules.map((m: any) => ({
              title: m.title || '',
              description: m.description || '',
            }))
          : [{ title: '', description: '' }],
      });
    }
  }, [trailData, reset]);

  const onSubmit = async (data: TrailForm) => {
    setIsLoading(true);
    try {
      const trailData = {
        title: data.title,
        description: data.description,
        modules: data.modules,
        status: 'draft', // Por padrão, cria como rascunho
      };

      if (id) {
        // Mantém o status atual ao atualizar (não força para draft)
        const currentTrail = await trailsApi.getOne(Number(id));
        trailData.status = currentTrail.data.status || 'draft';
        await trailsApi.update(Number(id), trailData);
        toast({
          title: 'Trilha atualizada!',
          description: 'Sua trilha foi atualizada com sucesso.',
        });
      } else {
        await trailsApi.create(trailData);
        toast({
          title: 'Trilha criada!',
          description: 'Sua trilha foi criada com sucesso.',
        });
      }
      navigate('/teacher-trails');
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar trilha',
        description: error.response?.data?.detail || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (id && isLoadingTrail) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#012030]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#012030]">
            {id ? 'Editar Trilha' : 'Nova Trilha'}
          </h1>
          <p className="text-[#012030]/70">
            {id ? 'Edite os detalhes da sua trilha' : 'Crie uma nova trilha de aprendizado'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/teacher-trails')}
          className="border-[#012030]/10"
        >
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informações da Trilha */}
        <Card className="border-[#012030]/10">
          <CardHeader>
            <CardTitle className="text-[#012030] flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Informações da Trilha
            </CardTitle>
            <CardDescription className="text-[#012030]/60">
              Defina o título e descrição da sua trilha de aprendizado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#012030]/80 font-semibold">
                Título da Trilha *
              </Label>
              <Input
                id="title"
                placeholder="Ex: Introdução à Sustentabilidade"
                {...register('title')}
                className={`border-[#012030]/10 focus:border-[#012030] ${
                  errors.title ? 'border-destructive' : ''
                }`}
              />
              {errors.title && (
                <p className="text-sm font-medium text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#012030]/80 font-semibold">
                Descrição da Trilha *
              </Label>
              <Textarea
                id="description"
                placeholder="Descreva o objetivo e conteúdo desta trilha..."
                rows={4}
                {...register('description')}
                className={`border-[#012030]/10 focus:border-[#012030] ${
                  errors.description ? 'border-destructive' : ''
                }`}
              />
              {errors.description && (
                <p className="text-sm font-medium text-destructive">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Módulos */}
        <Card className="border-[#012030]/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[#012030]">Módulos da Trilha</CardTitle>
                <CardDescription className="text-[#012030]/60">
                  Adicione módulos à sua trilha. Cada módulo deve ter título e descrição.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ title: '', description: '' })}
                className="border-[#012030]/10"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Módulo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.length === 0 && (
              <div className="text-center py-8 text-[#012030]/60">
                <BookOpen className="h-12 w-12 mx-auto mb-2 text-[#012030]/30" />
                <p>Nenhum módulo adicionado ainda.</p>
                <p className="text-sm">Clique em "Adicionar Módulo" para começar.</p>
              </div>
            )}

            {fields.map((field, index) => (
              <Card key={field.id} className="border-[#012030]/5 bg-secondary/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#012030] text-lg">
                      Módulo {index + 1}
                    </CardTitle>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`modules.${index}.title`}
                      className="text-[#012030]/80 font-semibold"
                    >
                      Título do Módulo *
                    </Label>
                    <Input
                      placeholder="Ex: Conceitos Básicos de Sustentabilidade"
                      {...register(`modules.${index}.title` as const)}
                      className={`border-[#012030]/10 focus:border-[#012030] ${
                        errors.modules?.[index]?.title ? 'border-destructive' : ''
                      }`}
                    />
                    {errors.modules?.[index]?.title && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.modules[index]?.title?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`modules.${index}.description`}
                      className="text-[#012030]/80 font-semibold"
                    >
                      Descrição do Módulo *
                    </Label>
                    <Textarea
                      placeholder="Descreva o conteúdo deste módulo..."
                      rows={3}
                      {...register(`modules.${index}.description` as const)}
                      className={`border-[#012030]/10 focus:border-[#012030] ${
                        errors.modules?.[index]?.description ? 'border-destructive' : ''
                      }`}
                    />
                    {errors.modules?.[index]?.description && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.modules[index]?.description?.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {errors.modules && typeof errors.modules.message === 'string' && (
              <div className="text-sm font-medium text-destructive">
                {errors.modules.message}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/teacher-trails')}
            className="border-[#012030]/10"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#012030] text-white hover:bg-[#012030]/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {id ? 'Atualizar Trilha' : 'Criar Trilha'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
