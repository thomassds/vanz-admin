import type { ReactNode } from 'react'

const features = [
  { title: 'Segurança', text: 'Proteção em tempo real', icon: 'shield' as const },
  { title: 'Rastreamento', text: 'Localização e rotas ao vivo', icon: 'pin' as const },
  { title: 'Comunicação', text: 'Avisos instantâneos para pais', icon: 'chat' as const },
]

const stats = [
  { label: 'Rotas ativas agora', value: '137', dotClass: 'bg-success' },
  { label: 'Vans em operação', value: '75', dotClass: 'bg-info' },
  { label: 'Alunos transportados', value: '1.125', dotClass: 'bg-primary' },
]

function FeatureIcon({ type }: { type: 'shield' | 'pin' | 'chat' }) {
  if (type === 'shield') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary">
        <path fill="currentColor" d="M12 2 4 5v6c0 5.2 3.4 9.9 8 11 4.6-1.1 8-5.8 8-11V5l-8-3Zm-1.2 14.8-3.4-3.4 1.4-1.4 2 2 4.2-4.2 1.4 1.4-5.6 5.6Z" />
      </svg>
    )
  }
  if (type === 'pin') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary">
        <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary">
      <path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 7a1.5 1.5 0 1 0 0 .01V11Zm5 0a1.5 1.5 0 1 0 0 .01V11Zm5 0a1.5 1.5 0 1 0 0 .01V11Z" />
    </svg>
  )
}

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen w-full bg-app font-body text-text lg:h-screen lg:overflow-hidden">
      <section className="flex min-h-screen w-full flex-col lg:h-full lg:flex-row">
        {/* Painel de marca — 100% CSS, sem imagens */}
        <article className="relative isolate overflow-hidden bg-navy px-6 py-8 lg:flex lg:w-[56%] lg:flex-col lg:justify-between lg:px-14 lg:py-12">
          {/* Brilhos decorativos */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/25 blur-[120px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-info/20 blur-[140px]"
          />
          {/* Grade sutil de fundo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
          />

          <header className="relative">
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/40">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary">
                  <path
                    fill="currentColor"
                    d="M3 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H3V6Zm0 3h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Zm12 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
                  />
                </svg>
              </span>
              <h1 className="m-0 font-heading text-4xl font-extrabold tracking-tight text-white lg:text-5xl">
                VANZ
              </h1>
            </div>
            <p className="mt-3 text-center font-heading text-sm font-medium text-white/60 lg:text-left lg:text-base">
              Gestão inteligente para transporte escolar
            </p>
          </header>

          <div className="relative mt-12 hidden max-w-[560px] lg:block">
            <h2 className="m-0 font-heading text-[2.75rem] font-bold leading-[1.12] text-white">
              Mais segurança.
              <br />
              Mais controle.
              <br />
              <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                Mais confiança.
              </span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
              Acompanhe rotas em tempo real, gerencie alunos e mantenha pais,
              escola e condutores sempre conectados.
            </p>

            <div className="mt-10 grid max-w-[540px] grid-cols-3 gap-4">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-white/10"
                >
                  <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
                    <FeatureIcon type={feature.icon} />
                  </span>
                  <h3 className="m-0 font-heading text-sm font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-xs leading-snug text-white/55">
                    {feature.text}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div
            className="relative mt-10 hidden max-w-[620px] grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm lg:grid"
            aria-label="Métricas de operação"
          >
            {stats.map((item) => (
              <article key={item.label} className="px-5 py-4">
                <p className="m-0 text-xs font-medium text-white/55">
                  {item.label}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`h-2 w-2 animate-pulse rounded-full ${item.dotClass}`} />
                  <strong className="font-heading text-3xl font-bold leading-none text-white">
                    {item.value}
                  </strong>
                </div>
              </article>
            ))}
          </div>
        </article>

        {/* Slot de autenticação */}
        <aside className="flex flex-1 items-start justify-center px-4 py-8 lg:items-center lg:overflow-y-auto lg:px-8 lg:py-6">
          <div
            className="w-full max-w-[440px] rounded-3xl border border-border bg-card p-7 shadow-xl shadow-black/5 sm:p-9"
            aria-label="Acesso da plataforma"
          >
            {children}
          </div>
        </aside>
      </section>
    </main>
  )
}
