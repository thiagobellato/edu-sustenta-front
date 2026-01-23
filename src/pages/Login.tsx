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
import { useAuth } from '@/contexts/AuthContext';

// Importações de assets mantidas
// import logo from '@/assets/LOGO.svg';
// import heroIllustration from '@/assets/hero-illustration.png';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast({
        title: 'Bem-vindo!',
        description: 'Login realizado com sucesso.',
      });
      navigate('/home');
    } catch (error: any) {
      toast({
        title: 'Erro ao entrar',
        description: error.response?.data?.detail || 'Verifique suas credenciais.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f6fff0]" style={{
      background: `
        radial-gradient(circle at 25% 35%, rgba(69,196,176,0.35) 0%, transparent 40%),
        radial-gradient(circle at 70% 60%, rgba(154,235,163,0.25) 0%, transparent 45%),
        linear-gradient(180deg, #012030 0%, #012030 100%)
      `
    }}>
      <div className="text-[#012030] flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md -translate-y-12 space-y-6">

          <div className="flex flex-col items-center text-center">
            <h2 className="text-white font-display mb-4 text-3xl font-bold">Bem-vindo de volta!</h2>
          </div>
          
          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="font-display text-[#012030] text-2xl">Login</CardTitle>
              <CardDescription>
                Digite suas credenciais para acessar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link 
                      to="/forgot-password" 
                      className="text-xs text-muted-foreground hover:text-[#012030] hover:underline transition-colors"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('password')}
                      className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full font-display
                            rounded-lg
                            bg-gradient-to-r from-emerald-400 to-green-200
                            px-6 py-3
                            text-sm font-semibold uppercase tracking-wide text-zinc-950
                            transition-all duration-300 ease-out
                            hover:from-emerald-400 hover:to-green-50
                            hover:shadow-xl hover:shadow-emerald-400/60
                            hover:scale-[1.03]
                          "
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <Link to="/register" className="font-display text-[#012030] hover:underline font-semibold">
                  Cadastre-se
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}