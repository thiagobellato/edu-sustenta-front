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
        <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>Seus dados de cadastro na plataforma</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="gradient-primary text-primary-foreground text-xl">
                {user?.name ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{user?.name}</h3>
              <p className="text-muted-foreground">{getRoleName(user?.role || '')}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Token Validation Card - Only for Alunos */}
      {user?.role === 'aluno' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Tornar-se Professor
            </CardTitle>
            <CardDescription>
              Insira o token de convite recebido do gestor da escola
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border-primary/20 bg-primary/5">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary">Como funciona?</AlertTitle>
              <AlertDescription className="text-primary/80">
                O gestor da escola gera um token de convite válido por 15 minutos.
                Ao inserir um token válido, você se tornará professor automaticamente.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit(onSubmitToken)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Token de Convite</Label>
                <Input
                  id="token"
                  placeholder="Cole o token aqui..."
                  {...register('token')}
                  className={errors.token ? 'border-destructive' : ''}
                />
                {errors.token && (
                  <p className="text-sm text-destructive">{errors.token.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gradient-primary"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Validar Token
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Success Message for Professors */}
      {user?.role === 'professor' && (
        <Alert className="border-primary/20 bg-primary/5">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">Você é um professor!</AlertTitle>
          <AlertDescription className="text-primary/80">
            Parabéns! Você tem acesso a todas as funcionalidades de criação e
            gestão de trilhas educacionais.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
