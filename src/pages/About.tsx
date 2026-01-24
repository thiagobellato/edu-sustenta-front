import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Leaf, 
  Target, 
  Users, 
  BookOpen, 
  Lightbulb, 
  ArrowLeft, 
  Github, 
  Heart, 
  TrendingUp 
} from 'lucide-react';
import logo from '@/assets/LOGO.svg';

const features = [
  { icon: BookOpen, label: 'Educação Aberta' },
  { icon: Lightbulb, label: 'Inovação Social' },
  { icon: Target, label: 'Foco em ODS' },
  { icon: TrendingUp, label: 'Impacto Real' },
];

const teamMembers = [
  { name: 'Thiago Bellato', github: 'thiagobellato' },
  { name: 'Felipe M.', github: 'felipemaya14' },
  { name: 'Juan', github: 'juan-m-cloud' },
  { name: 'Fatima Aguero', github: 'fatimaguero' },
  { name: 'Marcus', github: 'MarcusAmoglia' },
  { name: 'Kamille', github: 'Kalli-E' },
  { name: 'Rafael', github: 'Rardisgamers965' },
];

const sustainabilityPoints = [
  'Integrar teoria e prática ambiental',
  'Conscientizar sobre recursos escassos',
  'Promover ações comunitárias',
  'Estimular o engajamento contínuo',
];

const darkBgStyle = {
  background: `
    radial-gradient(circle at 25% 35%, rgba(69,196,176,0.35) 0%, transparent 40%),
    radial-gradient(circle at 70% 60%, rgba(154,235,163,0.25) 0%, transparent 45%),
    linear-gradient(180deg, #012030 0%, #012030 100%)
  `,
};

export default function About() {
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
  
  <Link to="/" className="text-sm font-medium text-white hover:text-emerald-200 transition-colors">
    Home
  </Link>            
  <Link to="/login" className="font-display text-sm font-medium text-emerald-400 hover:underline">
    LOGIN
  </Link>
</nav>


          
        </div>
      </header>

        <div className="mx-auto max-w-[1200px] px-5 py-20 text-center">
          <h1 className="font-display mb-6 text-5xl font-bold text-white lg:text-6xl leading-tight">
            Sobre o EduSustenta
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-white/80 lg:text-xl leading-relaxed">
            O Edu-Sustenta é uma plataforma educacional digital criada com a missão de conectar{' '}
            <strong className="text-emerald-400">educação, sustentabilidade e engajamento cidadão</strong>{' '}
            de forma prática, acessível e mensurável.
          </p>
        </div>

        {/* Wave Divider Identical to Landing */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0 60C240 120 480 120 720 90C960 60 1200 0 1440 30V120H0V80Z" fill="#f6fff0" />
          </svg>
        </div>
      </section>

      {/* Proposta Central */}
      <section className="py-16 bg-[#f6fff0]">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-0 bg-white shadow-xl overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#012030]/5 text-[#012030]">
                  <Target className="h-8 w-8" />
                </div>
                <h2 className="font-display text-3xl font-bold text-[#012030]">Nossa Proposta</h2>
              </div>
              <p className="text-lg text-[#012030]/80 leading-relaxed mb-8">
                A proposta central do projeto é transformar os <strong className="text-[#012030]">Objetivos de Desenvolvimento Sustentável (ODS)</strong> em experiências reais de aprendizagem, permitindo que estudantes e cidadãos participem ativamente de ações sustentáveis.
              </p>
              <div className="rounded-xl bg-[#012030] p-8 text-white italic text-lg shadow-inner">
                "Mais do que consumir conteúdo, o usuário é convidado a agir, aprender e evoluir dentro de um ambiente interativo e colaborativo."
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Impact Section com cards estilo Landing */}
      <section className="py-16 bg-[#f6fff0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-[#012030] lg:text-4xl">Educação que gera impacto</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-[1200px] mx-auto">
            {features.map((feature, i) => (
              <Card key={i} className="group relative overflow-hidden border-0 bg-[#012030] p-4 text-white shadow-xl transition-all hover:scale-[1.02]">
                <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                  <div className="bg-emerald-400/20 p-4 rounded-full group-hover:bg-emerald-400/30 transition-colors">
                    <feature.icon className="h-8 w-8 text-emerald-400" />
                  </div>
                  <p className="font-display font-bold text-lg text-center tracking-wide">{feature.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sustentabilidade na Prática */}
      <section className="py-20 bg-[#f6fff0]">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-[#012030]">
                  <Leaf className="h-6 w-6" />
                </div>
                <h2 className="font-display text-3xl font-bold text-[#012030]">Sustentabilidade na prática</h2>
              </div>
              <ul className="space-y-5">
                {sustainabilityPoints.map((point, i) => (
                  <li key={i} className="flex items-center gap-4 text-[#012030]/80 text-lg">
                    <div className="h-7 w-7 rounded-full bg-[#012030] flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {i + 1}
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <Card className="border-0 shadow-2xl overflow-hidden" style={darkBgStyle}>
              <CardContent className="p-16 text-center text-white space-y-6">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <Heart className="h-12 w-12 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold">A ideia é simples:</h3>
                  <p className="text-xl text-white/70">Aprender, praticar e transformar.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Time Section */}
      <section className="py-20 bg-[#012030]">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Users className="h-8 w-8 text-white" />
            <h2 className="font-display text-3xl font-bold text-white">Nosso Time</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-[1200px] mx-auto">
            {teamMembers.map((member, i) => (
              <a key={i} href={`https://github.com/${member.github}`} target="_blank" rel="noreferrer" className="group">
                <Card className="border-0 bg-white p-6 transition-all duration-300 hover:shadow-2xl hover:ring-2 hover:ring-emerald-400">
                  <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring-emerald-50 group-hover:ring-emerald-100 transition-all">
                    <AvatarImage src={`https://github.com/${member.github}.png`} />
                    <AvatarFallback className="bg-[#012030] text-white font-bold">{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-[#012030] mb-2 group-hover:text-emerald-600 transition-colors">{member.name}</h3>
                  <div className="flex items-center justify-center gap-1 text-xs text-[#012030]/50 group-hover:text-[#012030] transition-colors">
                    <Github className="h-3 w-3" /> @{member.github}
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Identical to Landing */}
      <section className="py-24 text-center text-white relative overflow-hidden" style={darkBgStyle}>


        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="font-display text-3xl font-bold mb-8 lg:text-4xl">Nossa Missão</h2>
          <p className="mx-auto max-w-2xl text-xl text-white/80 mb-12 leading-relaxed">
            Promover uma educação <strong className="text-white">acessível</strong> e <strong className="text-white">participativa</strong>, utilizando a tecnologia como ponte para o impacto social.
          </p>
          <Button
            asChild
            className="font-display rounded-lg bg-gradient-to-r from-emerald-400 to-green-200 px-10 py-7 text-sm font-bold uppercase tracking-widest text-zinc-950 transition-all duration-300 hover:from-emerald-300 hover:to-white hover:shadow-[0_0_20px_rgba(52,211,153,0.5)] hover:scale-105"
          >
            <Link to="/register">FAÇA PARTE</Link>
          </Button>
          
          
        </div>
      </section>

    </div>
  );
}