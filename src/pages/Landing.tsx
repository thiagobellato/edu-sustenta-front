import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import heroIllustration from '@/assets/hero-illustration.png';
import iconGamepad from '@/assets/icon-gamepad.png';
import iconTeacher from '@/assets/icon-teacher.png';
import iconTrophy from '@/assets/icon-trophy.png';
import studentsGroup from '@/assets/students-group.png';
import iconRoute from '@/assets/icon-route.png';
import iconQuestion from '@/assets/icon-question.png';
import iconReward from '@/assets/icon-reward.png';
import iconSend from '@/assets/icon-send.png';
import logo from '@/assets/LOGO.svg';
import background from '@/assets/background.svg';
import link from 'react-router-dom';

const featureCards = [
  {
    title: 'Aprendizado aberto e gamificado',
    description: 'Trilhas de aprendizagem públicas e acessíveis para todos.',
    image: iconGamepad,
  },
  {
    title: 'Conhecimento sem barreiras',
    description: 'Uma plataforma aberta, sem vínculo obrigatório.',
    image: iconTeacher,
  },
  {
    title: 'Aprenda jogando',
    description: 'Ganhe pontos, conquiste insígnias e acompanhe seu progresso.',
    image: iconTrophy,
  },
];

const howItWorks = [
  {
    image: iconRoute,
    title: 'Explore trilhas públicas',
    bgColor: 'bg-teal-50',
  },
  {
    image: iconQuestion,
    title: 'Aprenda no seu ritmo',
    bgColor: 'bg-pink-50',
  },
  {
    image: iconReward,
    title: 'Ganhe pontos e insígnias',
    bgColor: 'bg-amber-50',
  },
  {
    image: iconSend,
    title: 'Compartilhe suas conquistas',
    bgColor: 'bg-blue-50',
  },
];

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-15 pt-12 lg:pt-50"
      style={{
    background: `
      radial-gradient(circle at 25% 35%, rgba(69,196,176,0.35) 0%, transparent 40%),
      radial-gradient(circle at 70% 60%, rgba(154,235,163,0.25) 0%, transparent 45%),
      linear-gradient(180deg, #012030 0%, #012030 100%)
    `
  }}>

        {/* Header */}
      <header className="w-full">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5">
          <div className="flex items-center">
            <Link to="/">  
              <img 
                src={logo} 
                alt="EduSustenta" 
                className="h-10 md:h-12 lg:h-14"              />
            </Link>
          </div>

  

          <nav className="hidden items-center gap-12 md:flex hover:shadow-xl hover:shadow-emerald-400/60">
            <Link to="/" className="text-lg font-medium text-white hover:text-emerald-200">
              Home
            </Link>
            <Link to="/about" className="text-lg font-medium text-white hover:text-emerald-200">
              Sobre
            </Link>
            <Link to="/" className="text-lg font-medium text-white hover:text-emerald-200">
              Contato
            </Link>
          </nav>


          <Link to="/login" className="text-xl font-medium text-emerald-400 text-accent hover:underline">
            Login
          </Link>
        </div>
      </header>
        
        <div className="mx-auto max-w-[1200px] px-5 py-20">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Left Content */}
            <div className="max-w-lg text-left lg:pt-8">
              <h1 className="font-display mb-6 text-4xl leading-tight text-primary-foreground text-white sm:text-5xl">
                Conhecimento livre para transformar o mundo.
              </h1>

              <p className="text-white mb-8 text-lg text-primary-foreground/80">
                EduSustenta é uma plataforma educacional aberta e gamificada, focada no acesso democrático e conhecimento.
              </p>

              <Button
                asChild
                className="
                          rounded-lg
                          bg-gradient-to-r from-emerald-400 to-green-200
                          px-6 py-3
                          text-sm font-semibold uppercase tracking-wide text-zinc-950
                          transition-all duration-300 ease-out
                          hover:from-emerald-400 hover:to-green-50
                          hover:shadow-xl hover:shadow-emerald-400/60
                          hover:scale-[1.03]
                        ">

                <Link to="/register">CRIAR CONTA</Link>
              </Button>
            </div>

            {/* Right Illustration */}
            <div className="w-full max-w-md lg:max-w-lg">
              <img
                src={heroIllustration}
                alt="Pessoas aprendendo juntas na natureza"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60C240 120 480 120 720 90C960 60 1200 0 1440 30V120H0V80Z"
              fill="#f6fff0"

            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-20 bg-[#f6fff0]">
        <div className="mx-auto max-w-[1200px] px-4">
          <h2 className="font-display mb-12 text-center text-2xl font-bold text-[#012030] sm:text-3xl">
  Aprender também pode ser uma conquista.
</h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => (
              <Card
                key={feature.title}
                className="overflow-hidden rounded-2xl border-0 bg-[#012030] text-primary-foreground shadow-lg"
              >
                <CardContent className="flex h-full flex-col justify-between p-6">
                  <div>
                    <h3 className="font-display mb-2 text-lg text-white font-bold">{feature.title}</h3>
                    <p className="text-sm text-white text-primary-foreground/80">{feature.description}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="h-20 w-20 object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-20 bg-[#f6fff0]">
        <div className="mx-auto max-w-[1200px] px-4">
          <h2 className="font-display mb-12 text-center text-2xl font-bold text-[#012030] sm:text-3xl">
            Como funciona o EduSustenta?
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {howItWorks.map((step) => (
              <Card
                key={step.title}
                className="rounded-2xl border-0 bg-card shadow-md transition-transform hover:-translate-y-1"
              >
                <CardContent className="font-display flex flex-col items-center p-6 text-center">
                  <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${step.bgColor}`}>
                    <img
                      src={step.image}
                      alt={step.title}
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                  <p className="text-lg font-semibold text-foreground">{step.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher CTA Section */}
      <section className="py-16 lg:py-20 bg-[#f6fff0]">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-center">
            {/* Students Illustration */}
            <div className="w-full max-w-xs lg:max-w-sm">
              <img
                src={studentsGroup}
                alt="Estudantes"
                className="h-auto w-full"
              />
            </div>

            {/* CTA Content */}
            <div className="text-center lg:text-left">
              <h2 className="font-display mb-4 text-2xl font-bold text-[#012030] sm:text-3xl">
                Você é professor?
              </h2>
              <p className="mb-6 max-w-md text-[#012030]">
                Crie trilhas de aprendizagem, compartilhe conhecimento e impacte alunos de todos país
              </p>
              <Button
                asChild
                className="
                          rounded-lg
                          bg-gradient-to-r from-emerald-400 to-green-200
                          px-6 py-3
                          text-sm font-semibold uppercase tracking-wide text-zinc-950
                          transition-all duration-300 ease-out
                          hover:from-emerald-400 hover:to-green-50
                          hover:shadow-xl hover:shadow-emerald-400/60
                          hover:scale-[1.03]
                        ">
              
                <Link to="/register">Criar Trilha</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-12 bg-[#012030]">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link to="/">  
              <img 
                src={logo} 
                alt="EduSustenta" 
                className="h-10 md:h-12 lg:h-14"              />
            </Link>
            <p className="text-sm text-primary-foreground/60">
              © 2026 EduSustenta. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}