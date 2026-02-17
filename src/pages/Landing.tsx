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
    title: 'Aprenda com suas conquistas ',
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

  

          <nav className="hidden items-center gap-12 md:flex">
  
  <Link to="/about" className="text-sm font-medium text-white hover:text-emerald-200 transition-colors">
    Sobre
  </Link>            
  <Link to="/login" className="font-display text-sm font-medium text-emerald-400 hover:underline">
    LOGIN
  </Link>
</nav>


          
        </div>
      </header>
        
        <div className="mx-auto max-w-[1200px] px-5 py-20">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Left Content */}
            <div className="max-w-lg text-left lg:pt-8">
              <h1 className="font-display mb-6 text-5xl leading-tight text-primary-foreground text-white sm:text-5xl">
                Conhecimento livre para transformar o mundo.
              </h1>

              <p className="text-base text-white mb-8  text-lg text-primary-foreground/80">
                EduSustenta é uma plataforma educacional aberta e gamificada, focada no acesso democrático e conhecimento.
              </p>

              <Button
                asChild
                className="font-display rounded-lg bg-gradient-to-r from-emerald-400 to-green-200 px-6 py-3 text-sm font-bold uppercase tracking-widest text-zinc-950 transition-all duration-300 hover:from-emerald-300 hover:to-white hover:shadow-[0_0_20px_rgba(52,211,153,0.5)] hover:scale-105"
              >

                <Link to="/register">FAÇA PARTE</Link>
              </Button>
            </div>

            {/* Right Illustration */}
            <div className="w-full max-w-md lg:max-w-lg">
              <img
              src={heroIllustration}
              alt="Pessoas aprendendo juntas na natureza"
              className="w-full scale-150 object-contain -translate-x-10 translate-y-5"
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
      <section className="py-20 bg-[#f6fff0] ">
        <div className="mx-auto max-w-[1200px]  px-5">
          <h2 className="font-display mb-16 text-center text-3xl font-bold text-[#012030] lg:text-4xl">
            Aprender também pode ser uma conquista.
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => (
              <Card
                key={feature.title}
                className="group relative overflow-hidden border-0 bg-[#012030] p-4 text-white shadow-xl transition-all hover:scale-[1.02]"
              >
                <CardContent className="flex h-64 flex-col justify-start p-6">
                  <h3 className="font-display text-white mb-4 text-xl font-bold text-emerald-400">{feature.title}</h3>
                  <p className="text-white text-lg">{feature.description}</p>
                  
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="absolute -bottom-4 -right-4 h-32 w-32 object-contain opacity-20 transition-all group-hover:scale-110 group-hover:opacity-100 lg:opacity-40"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-12 bg-[#f6fff0]">
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
                  <p className="text-base font-semibold text-foreground">{step.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher CTA Section */}
      <section className="py-16 lg:py-12 bg-[#f6fff0]">
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
              <p className="mb-6 text-lg max-w-md text-[#012030]">
                Crie trilhas de aprendizagem, compartilhe conhecimento e impacte alunos de todos país
              </p>
              <Button
                asChild
                className="font-display rounded-lg bg-gradient-to-r from-emerald-400 to-green-200 px-6 py-3 text-sm font-bold uppercase tracking-widest text-zinc-950 transition-all duration-300 hover:from-emerald-300 hover:to-white hover:shadow-[0_0_20px_rgba(52,211,153,0.5)] hover:scale-105"
              >
                <Link to="/register">COMPARTILHAR CONHECIMENTO</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-12 bg-[#012030]" style={{
    background: `
      radial-gradient(circle at 25% 35%, rgba(69,196,176,0.35) 0%, transparent 40%),
      radial-gradient(circle at 70% 60%, rgba(154,235,163,0.25) 0%, transparent 45%),
      linear-gradient(180deg, #012030 0%, #012030 100%)
    `
  }}>
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
