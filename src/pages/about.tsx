import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import logo from '@/assets/LOGO.svg';

import {
  Leaf,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Lightbulb,
  ArrowLeft,
  Github,
  GraduationCap,
  Heart
} from 'lucide-react';

const teamMembers = [
  { name: 'Thiago', github: 'thiagobellato' },
  { name: 'Felipe', github: 'felipemaya14' },
  { name: 'Juan', github: 'juan-m-cloud' },
  { name: 'Fátima', github: 'fatimaguero' },
  { name: 'Marcus', github: 'MarcusAmoglia' },
  { name: 'Kalli', github: 'Kalli-E' },
  { name: 'Rafael', github: 'Rardisgamers965' },
];

const features = [
  { icon: BookOpen, label: 'Trilhas de aprendizagem' },
  { icon: Target, label: 'Desafios práticos' },
  { icon: TrendingUp, label: 'Acompanhamento de progresso' },
  { icon: Lightbulb, label: 'Metas e indicadores de impacto' },
];

const sustainabilityPoints = [
  'Tornar a sustentabilidade compreensível',
  'Incentivar ações sustentáveis no dia a dia',
  'Medir resultados e evolução dos participantes',
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
    <div className="min-h-screen" style={{ backgroundColor: '#f6fff0' }}>
      {/* Header */}
      <header className="text-white" style={darkBgStyle}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="EduSustenta"
              className="h-10 md:h-12 lg:h-14 w-auto"
            />
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/">
              <Button
                variant="ghost"
                className="text-white hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>

            <Link to="/login">
              <Button className="bg-white text-[#012030] hover:bg-white/90">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 text-white" style={darkBgStyle}>
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Sobre o EduSustenta
          </h1>
          <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
            O Edu-Sustenta é uma plataforma educacional digital criada com a missão de conectar{' '}
            <strong className="text-white">educação, sustentabilidade e engajamento cidadão</strong>{' '}
            de forma prática, acessível e mensurável.
          </p>
        </div>

        {/* Wave Divider */}
        <div className="relative -mb-1 mt-12">
          <svg viewBox="0 0 1440 120" className="w-full h-auto" preserveAspectRatio="none">
            <path
              fill="#f6fff0"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Proposta Central */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="bg-white border-none shadow-lg">
            <CardContent className="p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#012030]" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-[#012030]">
                  Nossa Proposta
                </h2>
              </div>

              <p className="text-[#012030]/80 leading-relaxed text-lg mb-6">
                A proposta central do projeto é transformar os{' '}
                <strong className="text-[#012030]">
                  Objetivos de Desenvolvimento Sustentável (ODS)
                </strong>{' '}
                em experiências reais de aprendizagem, permitindo que estudantes e cidadãos não
                apenas compreendam os conceitos, mas também participem ativamente de ações
                sustentáveis, acompanhem seu progresso e percebam o impacto de suas escolhas.
              </p>

              <p className="text-[#012030] font-semibold text-lg italic">
                Mais do que consumir conteúdo, o usuário é convidado a agir, aprender e evoluir dentro
                de um ambiente interativo e colaborativo.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Educação que gera impacto */}
      <section className="py-16 lg:py-20 text-white" style={darkBgStyle}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Educação que gera impacto</h2>
            <p className="text-white/80 max-w-3xl mx-auto text-lg">
              O Edu-Sustenta foi concebido como uma plataforma gamificada de aprendizagem,
              onde o ensino vai além da teoria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-[#012030]" />
                  </div>
                  <p className="font-semibold text-white">{feature.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-white/90 max-w-3xl mx-auto text-lg">
            A plataforma fortalece o papel da educação como um instrumento de transformação social,
            incentivando o <strong className="text-white">pensamento crítico</strong>, a{' '}
            <strong className="text-white">responsabilidade ambiental</strong> e a{' '}
            <strong className="text-white">participação cidadã</strong>.
          </p>
        </div>
      </section>

      {/* Sustentabilidade na prática */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-[#012030]" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#012030]">
                    Sustentabilidade na prática
                  </h2>
                </div>

                <p className="text-[#012030]/80 leading-relaxed text-lg mb-6">
                  Inspirado nos Objetivos de Desenvolvimento Sustentável (ODS), o Edu-Sustenta busca
                  integrar a sustentabilidade ao cotidiano educacional de forma clara e aplicável.
                </p>

                <p className="text-[#012030]/80 leading-relaxed mb-6">
                  Cada trilha, desafio ou atividade é pensada para:
                </p>

                <ul className="space-y-3">
                  {sustainabilityPoints.map((point, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#012030] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="text-[#012030]">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Card className="border-none shadow-xl" style={darkBgStyle}>
                <CardContent className="p-8 lg:p-12 text-center text-white">
                  <div className="w-20 h-20 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold mb-2">A ideia é simples:</p>
                  <p className="text-xl text-white/90">Aprender, praticar e transformar.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Origem do projeto */}
      <section className="py-16 lg:py-20 bg-black/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white" style={darkBgStyle}>
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#012030] mb-4">Origem do projeto</h2>
          </div>

          <Card className="bg-white border-none shadow-lg">
            <CardContent className="p-8 lg:p-12">
              <p className="text-[#012030]/80 leading-relaxed text-lg mb-6">
                O Edu-Sustenta surgiu como projeto final do curso{' '}
                <strong className="text-[#012030]">BFD – Back-end & Front-end Development</strong>, promovido pela{' '}
                <strong className="text-[#012030]">Softex Pernambuco</strong>, no polo da{' '}
                <strong className="text-[#012030]">UFF – Petrópolis</strong>.
              </p>
              <p className="text-[#012030]/80 leading-relaxed text-lg">
                Desde sua concepção, o projeto foi idealizado não apenas como um trabalho acadêmico,
                mas como uma plataforma com <strong className="text-[#012030]">potencial real de crescimento</strong>,
                voltada à geração de impacto social por meio da educação e da tecnologia.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Nosso Time */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-8 h-8 text-[#012030]" />
              <h2 className="text-2xl lg:text-3xl font-bold text-[#012030]">Nosso Time</h2>
            </div>
            <p className="text-[#012030]/70 max-w-2xl mx-auto">
              Nosso time é composto por pessoas com diferentes habilidades, unidas pelo interesse em
              educação, tecnologia e sustentabilidade, atuando de forma colaborativa no desenvolvimento do Edu-Sustenta.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <a
                key={index}
                href={`https://github.com/${member.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="bg-white border-2 border-transparent hover:border-[#012030]/40 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-[#012030]/10 group-hover:ring-[#012030]/25 transition-all">
                      <AvatarImage src={`https://github.com/${member.github}.png`} alt={member.name} />
                      <AvatarFallback className="bg-[#012030] text-white text-xl font-bold">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <h3 className="font-bold text-[#012030] mb-1">{member.name}</h3>
                    <div className="flex items-center justify-center gap-1 text-[#012030]/60 text-sm group-hover:text-[#012030] transition-colors">
                      <Github className="w-4 h-4" />
                      <span>@{member.github}</span>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>

          <p className="text-center text-[#012030]/70 mt-8 max-w-2xl mx-auto">
            Cada integrante contribui ativamente para a construção da plataforma, trazendo diferentes
            perspectivas e fortalecendo o propósito do projeto.
          </p>
        </div>
      </section>

      {/* Nossa Missão */}
      <section className="py-16 lg:py-20 text-white" style={darkBgStyle}>
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">Nossa Missão</h2>
          <p className="text-xl lg:text-2xl leading-relaxed text-white/90">
            Promover uma educação <strong className="text-white">acessível</strong>,{' '}
            <strong className="text-white">participativa</strong> e{' '}
            <strong className="text-white">alinhada aos desafios contemporâneos</strong>,
            utilizando a tecnologia como ponte entre conhecimento, ação e impacto social.
          </p>

          <div className="mt-12">
            <Link to="/register">
              <Button size="lg" className="bg-white text-[#012030] hover:bg-white/90 font-semibold px-8">
                Junte-se a nós
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-white" style={darkBgStyle}>
        <div className="container mx-auto px-4 text-center">
          <Link to="/" className="inline-flex items-center justify-center mb-4">
            <img
              src={logo}
              alt="EduSustenta"
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          <p className="text-white/70 text-sm">
            © 2025 EduSustenta. Educação para um futuro sustentável.
          </p>
        </div>
      </footer>
    </div>
  );
}
