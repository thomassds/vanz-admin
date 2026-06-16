import type { ReactNode } from 'react'
import backgroundHome from '@/assets/background-home.png'

const features = [
  { title: 'Segurança', text: 'Proteção em tempo real', icon: 'shield' as const },
  { title: 'Rastreamento', text: 'Localização e rotas ao vivo', icon: 'pin' as const },
  { title: 'Comunicação', text: 'Avisos instantâneos para pais', icon: 'chat' as const },
]

const stats = [
  { label: 'Rotas ativas agora', value: '137', dot: '#37A52D' },
  { label: 'Vans em operação', value: '75', dot: '#26AAFF' },
  { label: 'Alunos transportados', value: '1.125', dot: '#7A53FF', tag: '#37A52D' },
]

function FeatureIcon({ type }: { type: 'shield' | 'pin' | 'chat' }) {
  if (type === 'shield') {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#00c8ff]">
        <path fill="currentColor" d="M12 2 4 5v6c0 5.2 3.4 9.9 8 11 4.6-1.1 8-5.8 8-11V5l-8-3Zm-1.2 14.8-3.4-3.4 1.4-1.4 2 2 4.2-4.2 1.4 1.4-5.6 5.6Z" />
      </svg>
    )
  }
  if (type === 'pin') {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#00c8ff]">
        <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#00c8ff]">
      <path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 7a1.5 1.5 0 1 0 0 .01V11Zm5 0a1.5 1.5 0 1 0 0 .01V11Zm5 0a1.5 1.5 0 1 0 0 .01V11Z" />
    </svg>
  )
}

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="h-screen w-screen max-h-screen max-w-screen overflow-hidden bg-white text-[#0c315e] [font-family:'Nunito','Segoe_UI',sans-serif]">
      <section className="grid h-full w-full max-h-full max-w-full grid-rows-[58%_42%] overflow-hidden lg:grid-cols-[66.7%_33.3%] lg:grid-rows-1">

        {/* Left — marketing panel */}
        <article className="relative h-full min-h-0 overflow-hidden bg-gradient-to-br from-[#edf4fb] via-[#e7f1fa] to-[#dcecf8] px-[18px] pb-3 pt-5 sm:px-8 lg:px-[56px] lg:pb-6 lg:pt-[52px]">
          <img
            src={backgroundHome}
            alt=""
            className="absolute inset-0 h-full max-h-full w-full max-w-full object-cover object-[58%_center] opacity-95 lg:opacity-80"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#f1f8fde6] via-[#f3faff9e] to-[#eefaff1f] lg:bg-gradient-to-r lg:from-[#f1f8fdf5] lg:via-[#f0f8fdea] lg:to-[#ecf8ff26]"
            aria-hidden="true"
          />

          <header className="relative z-10">
            <h1 className="m-0 text-center font-['Montserrat',sans-serif] text-[clamp(4.1rem,20vw,5.4rem)] font-bold leading-[0.86] tracking-[0.01em] text-[#00c8ff] drop-shadow-[0_4px_4px_rgba(0,0,0,0.18)] lg:text-left lg:text-[96px]">
              VANS
            </h1>
            <p className="mt-1.5 text-center font-['Montserrat',sans-serif] text-[1.05rem] font-semibold text-[#708097] lg:text-left lg:text-base">
              Gestão inteligente para transporte escolar
            </p>
          </header>

          <div className="relative z-10 mt-0 hidden max-w-[540px] lg:mt-[56px] lg:block">
            <h2 className="m-0 font-['Montserrat',sans-serif] text-[48px] font-bold leading-[1.1] tracking-[-0.01em] text-[#002c66]">
              Mais segurança.
              <br />
              Mais controle.
              <br />
              <span className="text-[#00c8ff]">Mais confiança.</span>
            </h2>
            <p className="mt-4 max-w-[430px] font-['Montserrat',sans-serif] text-[16px] font-semibold leading-[1.28] text-[#708097]">
              Acompanhe rotas em tempo real, gerencie alunos e mantenha pais,
              escola e condutores sempre conectados.
            </p>
          </div>

          <div className="relative z-10 mt-[36px] hidden max-w-[560px] grid-cols-3 gap-[22px] lg:grid">
            {features.map((feature) => (
              <article key={feature.title}>
                <span className="mb-2 inline-flex h-[50px] w-[50px] items-center justify-center rounded-[12px] border-2 border-[#00c8ff] bg-[#fffffff0]">
                  <FeatureIcon type={feature.icon} />
                </span>
                <h3 className="m-0 font-['Montserrat',sans-serif] text-[16px] font-bold text-[#002c66]">
                  {feature.title}
                </h3>
                <p className="mt-1 max-w-[125px] font-['Montserrat',sans-serif] text-xs font-medium leading-[1.18] text-[#708097]">
                  {feature.text}
                </p>
              </article>
            ))}
          </div>

          <div
            className="relative z-10 mt-[42px] hidden max-w-[730px] grid-cols-3 overflow-hidden rounded-xl border border-[#c7d9e9] bg-[#ffffffeb] shadow-[0_12px_20px_rgba(21,94,142,0.16)] lg:grid"
            aria-label="Métricas de operação"
          >
            {stats.map((item) => (
              <article key={item.label} className="border-r border-[#d3e1ec] px-8 py-4 last:border-r-0">
                <p className="m-0 flex items-center justify-between font-['Montserrat',sans-serif] text-[14px] font-semibold text-[#708097]">
                  <span>{item.label}</span>
                  {item.tag ? (
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.tag }} />
                  ) : null}
                </p>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.dot }} />
                  <strong className="font-['Montserrat',sans-serif] text-[38px] font-bold leading-none text-[#002c66]">
                    {item.value}
                  </strong>
                </div>
              </article>
            ))}
          </div>
        </article>

        {/* Right — auth slot */}
        <aside className="relative flex h-full items-center justify-center overflow-hidden bg-[#f7f9fc] px-4 py-3 lg:px-0 lg:py-6">
          <div
            className="w-full max-w-[411px] rounded-[22px] border border-[#cde0ee] bg-[#fffffff2] p-4 shadow-[0_18px_32px_rgba(25,63,89,0.21)] lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
            aria-label="Acesso da plataforma"
          >
            {children}
          </div>
        </aside>

      </section>
    </main>
  )
}
