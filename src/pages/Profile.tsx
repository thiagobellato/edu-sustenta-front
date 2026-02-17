import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Key, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { schoolsApi } from '@/lib/api';

const tokenSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
});

type TokenForm = z.infer<typeof tokenSchema>;

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TokenForm>({
    resolver: zodResolver(tokenSchema),
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'user':
        return 'Usuário';
      case 'aluno':
        return 'Estudante';
      case 'professor':
        return 'Professor(a)';
      case 'gestor':
        return 'Gestor(a)';
      default:
        return role;
    }
  };

  const onSubmitToken = async (data: TokenForm) => {
    setIsLoading(true);
    try {
      await schoolsApi.join(data.token);
      toast({
        title: '🎉 Parabéns!',
        description: 'Você agora é professor! A página será recarregada.',
      });
      reset();
      await refreshUser();
      window.location.reload();
    } catch (error: any) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        'Erro ao validar token. Tente novamente.';
      toast({
        title: 'Erro ao validar token',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-[#012030]">Meu Perfil</h1>
        <p className="text-[#012030]/70">
          Gerencie suas informações pessoais
        </p>
      </div>

      {/* Profile Card */}
      <Card className="border-[#012030]/10 overflow-hidden">
        <CardHeader className="border-b border-[#012030]/5 bg-secondary/20">
          <CardTitle className="text-[#012030]">Informações Pessoais</CardTitle>
          <CardDescription className="text-[#012030]/60 text-sm">Seus dados de cadastro na plataforma</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24 border-4 border-secondary shadow-sm">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-[#012030] text-white text-2xl font-display">
                {user?.name ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-display text-2xl font-bold text-[#012030]">{user?.name}</h3>
              <Badge className="bg-secondary text-[#012030] border-none hover:bg-secondary/80">
                {getRoleName(user?.role || '')}
              </Badge>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="group flex items-center gap-3 rounded-xl border border-[#012030]/10 p-4 transition-colors hover:bg-secondary/10">
              <User className="h-5 w-5 text-[#012030]/40 group-hover:text-[#012030]" />
              <div>
                <p className="text-[10px] uppercase font-bold text-[#012030]/40 tracking-wider">Nome Completo</p>
                <p className="font-medium text-[#012030]">{user?.name}</p>
              </div>
            </div>

            <div className="group flex items-center gap-3 rounded-xl border border-[#012030]/10 p-4 transition-colors hover:bg-secondary/10">
              <Mail className="h-5 w-5 text-[#012030]/40 group-hover:text-[#012030]" />
              <div>
                <p className="text-[10px] uppercase font-bold text-[#012030]/40 tracking-wider">E-mail de Acesso</p>
                <p className="font-medium text-[#012030]">{user?.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Token Validation Card - Only for Alunos (not USER) */}
      {user?.role === 'aluno' && (
        <Card className="border-[#012030]/10 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#012030]">
              <Key className="h-5 w-5" />
              Tornar-se Professor
            </CardTitle>
            <CardDescription className="text-[#012030]/60">
              Insira o token de convite recebido do gestor da escola
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 border-[#012030]/10 bg-secondary/30">
              <AlertCircle className="h-4 w-4 text-[#012030]" />
              <AlertTitle className="text-[#012030] font-bold">Como funciona?</AlertTitle>
              <AlertDescription className="text-[#012030]/70">
                O gestor da escola gera um token válido por 15 minutos. 
                Ao validar, sua conta receberá permissões de professor instantaneamente.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit(onSubmitToken)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token" className="text-[#012030]/80 font-semibold">Token de Convite</Label>
                <Input
                  id="token"
                  placeholder="Ex: XXXX-XXXX-XXXX"
                  {...register('token')}
                  className={`border-[#012030]/10 focus:border-[#012030] ${errors.token ? 'border-destructive' : ''}`}
                />
                {errors.token && (
                  <p className="text-sm font-medium text-destructive">{errors.token.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#012030] text-white hover:bg-[#012030]/90 h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validando Token...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Validar e Atualizar Conta
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Success Message for Professors */}
      {user?.role === 'professor' && (
        <Alert className="border-emerald-200 bg-emerald-50 shadow-sm animate-in zoom-in-95">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <AlertTitle className="text-emerald-800 font-bold font-display">Você é um professor!</AlertTitle>
          <AlertDescription className="text-emerald-700/80">
            Sua conta está ativa. Você já pode criar trilhas, gerenciar alunos e acompanhar o progresso das suas turmas.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}