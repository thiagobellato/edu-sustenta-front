import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, UserCog, Key, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { authApi, schoolsApi } from '@/lib/api';

const professorTokenSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
});

type ProfessorTokenForm = z.infer<typeof professorTokenSchema>;

export default function ChooseRole() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoadingAluno, setIsLoadingAluno] = useState(false);
  const [isLoadingProfessor, setIsLoadingProfessor] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfessorTokenForm>({
    resolver: zodResolver(professorTokenSchema),
  });

  // Redireciona se não for USER
  if (user && user.role !== 'user') {
    navigate('/home');
    return null;
  }

  const handleBecomeAluno = async () => {
    setIsLoadingAluno(true);
    try {
      await authApi.becomeAluno();
      toast({
        title: '🎉 Parabéns!',
        description: 'Você agora é um aluno! Redirecionando...',
      });
      await refreshUser();
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        'Erro ao atualizar conta. Tente novamente.';
      toast({
        title: 'Erro ao tornar-se aluno',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingAluno(false);
    }
  };

  const onSubmitProfessorToken = async (data: ProfessorTokenForm) => {
    setIsLoadingProfessor(true);
    try {
      await schoolsApi.join(data.token);
      toast({
        title: '🎉 Parabéns!',
        description: 'Você agora é um professor! Redirecionando...',
      });
      reset();
      await refreshUser();
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        'Erro ao validar token. Tente novamente.';
      toast({
        title: 'Erro ao validar token',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingProfessor(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{
      background: `
        radial-gradient(circle at 25% 35%, rgba(69,196,176,0.35) 0%, transparent 40%),
        radial-gradient(circle at 70% 60%, rgba(154,235,163,0.25) 0%, transparent 45%),
        linear-gradient(180deg, #012030 0%, #012030 100%)
      `
    }}>
      <div className="w-full max-w-4xl space-y-6 animate-fade-in">
        <div className="text-center text-white mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">Escolha seu papel</h1>
          <p className="text-lg text-white/80">
            Selecione como você deseja usar a plataforma
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Opção A - Tornar-se Aluno */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                  <GraduationCap className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle className="text-[#012030] text-2xl">Quero ser Aluno</CardTitle>
              </div>
              <CardDescription className="text-[#012030]/70">
                Acesse trilhas de aprendizado, complete atividades e ganhe pontos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-[#012030]/70">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Explore trilhas de aprendizado</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Complete atividades e ganhe pontos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Acompanhe seu progresso</span>
                </li>
              </ul>
              <Button
                onClick={handleBecomeAluno}
                disabled={isLoadingAluno}
                className="w-full bg-emerald-500 text-white hover:bg-emerald-600 h-11"
              >
                {isLoadingAluno ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Tornar-me Aluno
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Opção B - Tornar-se Professor */}
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <UserCog className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-[#012030] text-2xl">Quero ser Professor</CardTitle>
              </div>
              <CardDescription className="text-[#012030]/70">
                Crie trilhas de aprendizado e gerencie seus alunos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-[#012030]/70">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>Crie e gerencie trilhas de aprendizado</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>Acompanhe o progresso dos alunos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>Vincule-se a uma escola</span>
                </li>
              </ul>

              {!showTokenInput ? (
                <Button
                  onClick={() => setShowTokenInput(true)}
                  className="w-full bg-blue-500 text-white hover:bg-blue-600 h-11"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Tornar-me Professor
                </Button>
              ) : (
                <form onSubmit={handleSubmit(onSubmitProfessorToken)} className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800 font-bold">Código de Professor</AlertTitle>
                    <AlertDescription className="text-blue-700">
                      Insira o código de convite recebido do gestor da escola
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="token" className="text-[#012030]/80 font-semibold">
                      Código de Convite
                    </Label>
                    <Input
                      id="token"
                      placeholder="Ex: XXXX-XXXX-XXXX"
                      {...register('token')}
                      className={`border-[#012030]/10 focus:border-[#012030] ${
                        errors.token ? 'border-destructive' : ''
                      }`}
                    />
                    {errors.token && (
                      <p className="text-sm font-medium text-destructive">{errors.token.message}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowTokenInput(false);
                        reset();
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoadingProfessor}
                      className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
                    >
                      {isLoadingProfessor ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Validando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Validar
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
