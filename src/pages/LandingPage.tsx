import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-navy/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <span className="font-['Montserrat',sans-serif] text-xl font-bold text-white">VANS</span>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-gray-400 transition hover:text-white">
            Funcionalidades
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-gray-400 transition hover:text-white">
            Como funciona
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-300 transition hover:text-white"
          >
            Entrar
          </Link>
          <Link
            to="/onboarding"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Começar grátis
          </Link>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy px-6 pb-0 pt-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -left-32 top-40 h-72 w-72 rounded-full bg-primary/5 blur-[80px]" />
        <div className="absolute -right-32 top-60 h-72 w-72 rounded-full bg-blue-500/5 blur-[80px]" />
      </div>

      {/* Grid dots background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #00B4E0 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-semibold tracking-wide text-primary">
            Gestão financeira para frotas de vans
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-['Montserrat',sans-serif] text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl">
          Chega de planilha
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(90deg, #00B4E0, #4dd9f7)' }}
          >
            para sua frota
          </span>
        </h1>

        {/* Subtext */}
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-gray-400">
          Contratos, clientes, contas a receber e a pagar centralizados em uma plataforma
          simples. Acompanhe tudo em tempo real e tome decisões com dados.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/onboarding"
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-hover sm:w-auto"
          >
            Começar gratuitamente
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 transition group-hover:translate-x-0.5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link
            to="/login"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-8 py-3.5 text-sm font-semibold text-gray-300 backdrop-blur transition hover:border-white/30 hover:text-white sm:w-auto"
          >
            Já tenho conta
          </Link>
        </div>

        {/* Trust line */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-gray-600">
          {['Sem cartão de crédito', 'Configure em 5 minutos', 'Suporte incluso'].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-primary/60">
                <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
              </svg>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Dashboard mockup */}
      <div className="relative mx-auto mt-20 w-full max-w-5xl">
        {/* Floating cards */}
        <div className="absolute -left-4 top-10 z-10 hidden rounded-xl border border-white/10 bg-navy-light/90 p-4 shadow-xl backdrop-blur md:block">
          <p className="text-xs text-gray-500">Receita do mês</p>
          <p className="mt-1 text-xl font-bold text-primary">R$ 18.400</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
              <path fillRule="evenodd" d="M8 2a.75.75 0 0 1 .75.75v8.69l1.97-1.97a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 10.53a.75.75 0 1 1 1.06-1.06l1.97 1.97V2.75A.75.75 0 0 1 8 2Z" clipRule="evenodd" transform="rotate(180 8 8)" />
            </svg>
            +12% vs mês anterior
          </div>
        </div>

        <div className="absolute -right-4 top-24 z-10 hidden rounded-xl border border-white/10 bg-navy-light/90 p-4 shadow-xl backdrop-blur md:block">
          <p className="text-xs text-gray-500">Contratos ativos</p>
          <p className="mt-1 text-xl font-bold text-white">24</p>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full ${i < 4 ? 'bg-primary/70' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>

        {/* Main mockup window */}
        <div className="overflow-hidden rounded-t-2xl border border-b-0 border-white/10 bg-[#0a1628] shadow-2xl shadow-black/60">
          {/* Browser bar */}
          <div className="flex h-10 items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4">
            <span className="h-3 w-3 rounded-full bg-red-500/50" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/50" />
            <span className="h-3 w-3 rounded-full bg-green-500/50" />
            <div className="ml-3 flex h-5 flex-1 max-w-xs items-center gap-2 rounded-md bg-white/5 px-3">
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 text-gray-600">
                <path fillRule="evenodd" d="M8 1a.75.75 0 0 1 .75.75v2.663l1.116-.905a.75.75 0 1 1 .941 1.164L8.47 6.29a.75.75 0 0 1-.94 0L5.193 4.672a.75.75 0 1 1 .94-1.164L7.25 4.413V1.75A.75.75 0 0 1 8 1Zm-4.25 8a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5ZM2 10.75A2.75 2.75 0 0 1 4.75 8h6.5A2.75 2.75 0 0 1 14 10.75v.5A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-.5Z" clipRule="evenodd" />
              </svg>
              <span className="text-[10px] text-gray-600">app.vans.com.br/dashboard</span>
            </div>
          </div>

          {/* App layout */}
          <div className="flex h-[380px]">
            {/* Sidebar */}
            <div className="hidden w-52 shrink-0 flex-col border-r border-white/10 bg-navy p-4 md:flex">
              <div className="mb-6 px-2 font-['Montserrat',sans-serif] text-base font-bold text-white">VANS</div>
              {[
                { label: 'Dashboard', active: true },
                { label: 'Clientes', active: false },
                { label: 'Contratos', active: false },
                { label: 'Contas a receber', active: false },
                { label: 'Contas a pagar', active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2`}
                  style={item.active ? { backgroundColor: 'rgba(0,180,224,0.15)' } : {}}
                >
                  <div className={`h-3 w-3 rounded ${item.active ? 'bg-primary' : 'bg-white/15'}`} />
                  <span className={`text-xs font-medium ${item.active ? 'text-primary' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden p-5">
              <div className="mb-1 text-[11px] font-semibold text-gray-600">Visão geral</div>
              <div className="mb-5 font-['Montserrat',sans-serif] text-base font-bold text-white">
                Dashboard
              </div>

              {/* KPI Cards */}
              <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  { label: 'Receita mensal', value: 'R$ 18.400', badge: '+12%', color: 'text-primary', badgeColor: 'text-green-400 bg-green-400/10' },
                  { label: 'Contratos ativos', value: '24', badge: '3 novos', color: 'text-white', badgeColor: 'text-blue-400 bg-blue-400/10' },
                  { label: 'A receber', value: 'R$ 6.200', badge: '8 parcelas', color: 'text-yellow-400', badgeColor: 'text-yellow-400 bg-yellow-400/10' },
                  { label: 'A pagar', value: 'R$ 2.800', badge: '5 itens', color: 'text-orange-400', badgeColor: 'text-orange-400 bg-orange-400/10' },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-lg border border-white/5 bg-white/[0.04] p-3">
                    <p className="text-[10px] text-gray-500">{kpi.label}</p>
                    <p className={`mt-1.5 text-base font-bold ${kpi.color}`}>{kpi.value}</p>
                    <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold ${kpi.badgeColor}`}>
                      {kpi.badge}
                    </span>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="rounded-lg border border-white/5 bg-white/[0.03]">
                <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
                  <span className="text-[11px] font-semibold text-gray-400">Próximos vencimentos</span>
                  <div className="h-4 w-12 rounded bg-white/5" />
                </div>
                {[
                  { name: 'João Silva', value: 'R$ 850', badge: 'Pendente', color: 'bg-gray-500/20 text-gray-400' },
                  { name: 'Maria Costa', value: 'R$ 1.200', badge: 'Cobrado', color: 'bg-blue-500/20 text-blue-400' },
                  { name: 'Pedro Alves', value: 'R$ 750', badge: 'Vencido', color: 'bg-red-500/20 text-red-400' },
                  { name: 'Ana Souza', value: 'R$ 980', badge: 'Pago', color: 'bg-green-500/20 text-green-400' },
                ].map((row) => (
                  <div key={row.name} className="flex items-center gap-3 border-b border-white/[0.04] px-4 py-2.5 last:border-0">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-primary/20" />
                    <span className="flex-1 text-xs text-gray-300">{row.name}</span>
                    <span className="text-xs font-semibold text-white">{row.value}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${row.color}`}>
                      {row.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="h-24 bg-gradient-to-b from-transparent to-navy" />
      </div>
    </section>
  )
}

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path fill="currentColor" d="M6 2h9l5 5v15H6V2Zm8 1.5V8h4.5L14 3.5ZM8 12h8v1.5H8V12Zm0 4h8v1.5H8V16Z" />
      </svg>
    ),
    title: 'Gestão de contratos',
    description: 'Crie, edite e acompanhe contratos com clientes. Renove, suspenda ou cancele com histórico completo de alterações.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path fill="currentColor" d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-7 2-7 4.5V20h14v-2.5c0-2.5-3-4.5-7-4.5Zm9-3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 2c-1 0-1.94.18-2.78.49 1.71 1 2.78 2.45 2.78 4.01V20h5v-2.5c0-2.5-2.5-4.5-5-4.5Z" />
      </svg>
    ),
    title: 'Gestão de clientes',
    description: 'Cadastre clientes e dependentes. Acesse o histórico de contratos e recebíveis de cada cliente em uma única tela.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path fill="currentColor" d="M3 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H3V6Zm0 3h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Zm12 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
      </svg>
    ),
    title: 'Contas a receber',
    description: 'Acompanhe todas as parcelas geradas pelos contratos. Registre pagamentos e controle inadimplências com facilidade.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path fill="currentColor" d="M5 2h14v20l-3-2-2 2-2-2-2 2-2-2-3 2V2Zm2 4h10v1.5H7V6Zm0 4h10v1.5H7V10Zm0 4h6v1.5H7V14Z" />
      </svg>
    ),
    title: 'Contas a pagar',
    description: 'Registre despesas operacionais por categoria — combustível, salários, manutenção e mais. Nunca perca uma conta de vista.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path fill="currentColor" d="M3 3h18v2H3V3Zm0 16h18v2H3v-2ZM3 8h2v8H3V8Zm16 0h2v8h-2V8ZM7 8h4v2H7V8Zm6 0h4v2h-4V8Zm-6 4h4v2H7v-2Zm6 0h4v2h-4v-2Z" />
      </svg>
    ),
    title: 'Dashboard financeiro',
    description: 'Visão consolidada da receita mensal, contratos ativos, próximos vencimentos e fluxo de caixa em tempo real.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm1 14.93V18h-2v-1.07A8 8 0 0 1 4.07 11H6v-2H4.07A8 8 0 0 1 11 4.07V6h2V4.07A8 8 0 0 1 19.93 11H18v2h1.93A8 8 0 0 1 13 16.93ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
      </svg>
    ),
    title: 'Histórico de alterações',
    description: 'Todo evento registrado: quem alterou, o que mudou e quando. Rastreabilidade total para auditorias e revisões.',
  },
]

function Features() {
  return (
    <section id="features" className="bg-gray-50 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Funcionalidades
          </p>
          <h2 className="font-['Montserrat',sans-serif] text-3xl font-bold text-navy md:text-4xl">
            Tudo que sua frota precisa
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            De contratos a despesas, centralize a gestão financeira da sua operação em uma plataforma simples e completa.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <h3 className="mb-2 font-['Montserrat',sans-serif] text-base font-bold text-navy">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Crie sua conta',
      description: 'Cadastre-se gratuitamente em menos de 2 minutos. Sem cartão de crédito.',
    },
    {
      number: '02',
      title: 'Cadastre clientes e contratos',
      description: 'Adicione seus clientes e formalize os contratos com valores, datas e condições de pagamento.',
    },
    {
      number: '03',
      title: 'Acompanhe tudo em tempo real',
      description: 'Veja o fluxo de caixa, gerencie recebimentos e controle despesas direto do dashboard.',
    },
  ]

  return (
    <section id="how-it-works" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Como funciona
          </p>
          <h2 className="font-['Montserrat',sans-serif] text-3xl font-bold text-navy md:text-4xl">
            Simples de começar
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.number} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="absolute left-1/2 top-6 hidden h-px w-full -translate-y-1/2 bg-gray-200 md:block" />
              )}
              <div className="relative mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary font-['Montserrat',sans-serif] text-sm font-bold text-white">
                {step.number}
              </div>
              <h3 className="mb-2 font-['Montserrat',sans-serif] text-lg font-bold text-navy">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const TESTIMONIALS = [
  {
    name: 'Carlos Mendes',
    role: 'Proprietário · 12 vans',
    avatar: 'CM',
    color: 'bg-blue-500',
    text: 'Antes eu controlava tudo em planilha e sempre tinha erro. Hoje em 5 minutos já sei exatamente quanto tenho a receber no mês e quais contratos vencem essa semana.',
  },
  {
    name: 'Rosana Ferreira',
    role: 'Gestora · 8 vans',
    avatar: 'RF',
    color: 'bg-violet-500',
    text: 'O controle de contas a pagar foi o que mais me ajudou. Combustível, manutenção, salários — tudo categorizado. Finalmente consigo ver se o negócio está dando lucro de verdade.',
  },
  {
    name: 'André Lima',
    role: 'Autônomo · 3 vans',
    avatar: 'AL',
    color: 'bg-emerald-500',
    text: 'Sistema simples, sem complicação. Cadastrei meus clientes e contratos em menos de uma hora. O histórico de alterações me salvou quando precisei revisar um contrato antigo.',
  },
  {
    name: 'Patrícia Nunes',
    role: 'Sócia-proprietária · 20 vans',
    avatar: 'PN',
    color: 'bg-orange-500',
    text: 'A visão do dashboard com receita, contratos ativos e próximos vencimentos tudo junto é exatamente o que eu precisava para apresentar para a sócia todo mês.',
  },
  {
    name: 'Marcelo Santos',
    role: 'Proprietário · 6 vans',
    avatar: 'MS',
    color: 'bg-rose-500',
    text: 'Quando suspendi um contrato o sistema cancelou os recebíveis automaticamente. Isso evitou uma bagunça enorme no financeiro. Não troco por nada.',
  },
  {
    name: 'Juliana Carvalho',
    role: 'Gestora operacional · 15 vans',
    avatar: 'JC',
    color: 'bg-cyan-600',
    text: 'Consigo acompanhar cada cliente separadamente, ver o histórico de pagamentos e identificar quem está atrasado de forma bem rápida. Recomendo muito.',
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-yellow-400">
          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
        </svg>
      ))}
    </div>
  )
}

function Testimonials() {
  return (
    <section className="bg-gray-50 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Depoimentos
          </p>
          <h2 className="font-['Montserrat',sans-serif] text-3xl font-bold text-navy md:text-4xl">
            Quem usa, aprova
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-500">
            Gestores de frotas de todos os tamanhos usam o VANS para organizar o financeiro e tomar decisões com mais segurança.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <Stars />
              <p className="flex-1 text-sm leading-relaxed text-gray-600">"{t.text}"</p>
              <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${t.color}`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaBanner() {
  return (
    <section className="bg-navy px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-['Montserrat',sans-serif] text-3xl font-bold text-white md:text-4xl">
          Pronto para organizar sua frota?
        </h2>
        <p className="mt-4 text-gray-400">
          Comece agora e tenha controle total da sua operação em minutos.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/onboarding"
            className="w-full rounded-md bg-primary px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover sm:w-auto"
          >
            Criar conta grátis
          </Link>
          <Link
            to="/login"
            className="w-full rounded-md border border-white/20 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
          >
            Já tenho conta
          </Link>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <span className="font-['Montserrat',sans-serif] text-lg font-bold text-navy">VANS</span>
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} VANS. Todos os direitos reservados.
        </p>
        <div className="flex gap-6">
          <Link to="/login" className="text-xs text-gray-400 hover:text-gray-700">
            Entrar
          </Link>
          <Link to="/onboarding" className="text-xs text-gray-400 hover:text-gray-700">
            Criar conta
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </div>
  )
}
