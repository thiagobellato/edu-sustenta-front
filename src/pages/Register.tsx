import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/lib/api';

import studentsGroup from '@/assets/students-group.png';

const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  email: z.string().email('Email inválido').max(255),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast({
        title: 'Conta criada!',
        description: 'Sua conta foi criada com sucesso. Faça login para continuar.',
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Erro ao cadastrar',
        description: error.response?.data?.detail || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{
      background: `
        radial-gradient(circle at 25% 35%, rgba(69,196,176,0.35) 0%, transparent 40%),
        radial-gradient(circle at 70% 60%, rgba(154,235,163,0.25) 0%, transparent 45%),
        linear-gradient(180deg, #012030 0%, #012030 100%)
      `
    }}>
      {/* Left Side - Decorative (Hidden on mobile) */}
      <div className="hidden flex-1 lg:flex lg:items-center lg:justify-center">
        <div className="max-w-md p-12 text-center text-white">
          <div className="mb-8 flex justify-center">
            <img
              src={studentsGroup}
              alt="Grupo de estudantes"
              className="h-72 w-auto object-contain"
            />
          </div>
          <h2 className="font-display mb-4 text-3xl font-bold">Junte-se a nós!</h2>
          <p className="text-lg text-white/80">
            Faça parte da comunidade que está transformando a educação ambiental no Brasil.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          
          <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="font-display text-[#012030] text-2xl">Criar conta</CardTitle>
              <CardDescription>
                Preencha os dados abaixo para começar sua jornada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    {...register('name')}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...register('password')}
                        className={errors.password ? 'border-destructive' : ''}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('confirmPassword')}
                      className={errors.confirmPassword ? 'border-destructive' : ''}
                    />
                  </div>
                </div>
                
                {/* Botão de mostrar senha posicionado abaixo ou erros */}
                <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-[#012030]"
                    >
                      {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      {showPassword ? 'Ocultar senhas' : 'Mostrar senhas'}
                    </button>
                </div>

                {(errors.password || errors.confirmPassword) && (
                    <p className="text-xs text-destructive">
                        {errors.password?.message || errors.confirmPassword?.message}
                    </p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full font-display rounded-lg bg-gradient-to-r from-emerald-400 to-green-200 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-zinc-950 transition-all duration-300 ease-out hover:from-emerald-400 hover:to-green-50 hover:shadow-xl hover:shadow-emerald-400/60 hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    'Cadastrar agora'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link to="/login" className="font-display font-bold text-[#012030] hover:underline">
                  Entrar
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}