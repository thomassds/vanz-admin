import type { ReactNode } from 'react'

// Página de documentação viva do Design System.
// Fonte de verdade dos valores: standards/design.md + src/style.css (@theme)

interface ColorToken {
  name: string
  className: string
  hex: string
  usage: string
}

const brandColors: ColorToken[] = [
  { name: 'primary', className: 'bg-primary', hex: '#00B4E0', usage: 'Botões, links, ícones, destaques' },
  { name: 'primary-hover', className: 'bg-primary-hover', hex: '#009EC8', usage: 'Hover de elementos primários' },
  { name: 'primary-light', className: 'bg-primary-light', hex: '#E0F7FC', usage: 'Fundo de badges e destaques leves' },
  { name: 'navy', className: 'bg-navy', hex: '#0D1B3E', usage: 'Títulos e textos de alto contraste' },
  { name: 'navy-light', className: 'bg-navy-light', hex: '#1A2F5E', usage: 'Subtítulos e variação de navy' },
]

const neutralColors: ColorToken[] = [
  { name: 'white', className: 'bg-white', hex: '#FFFFFF', usage: 'Cards, inputs, páginas' },
  { name: 'surface', className: 'bg-surface', hex: '#F0F9FF', usage: 'Seções de marketing, painéis' },
  { name: 'gray-50', className: 'bg-gray-50', hex: '#F8FAFC', usage: 'Fundo geral da área logada' },
  { name: 'gray-100', className: 'bg-gray-100', hex: '#F1F5F9', usage: 'Bordas leves, hover' },
  { name: 'gray-200', className: 'bg-gray-200', hex: '#E2E8F0', usage: 'Bordas de inputs, divisores' },
  { name: 'gray-400', className: 'bg-gray-400', hex: '#94A3B8', usage: 'Placeholders, texto secundário' },
  { name: 'gray-600', className: 'bg-gray-600', hex: '#475569', usage: 'Corpo de texto, labels' },
  { name: 'gray-900', className: 'bg-gray-900', hex: '#0F172A', usage: 'Texto principal' },
]

const statusColors: ColorToken[] = [
  { name: 'success', className: 'bg-success', hex: '#16A34A', usage: 'Ativo, pago, confirmado' },
  { name: 'success-light', className: 'bg-success-light', hex: '#DCFCE7', usage: 'Fundo de badge de sucesso' },
  { name: 'danger', className: 'bg-danger', hex: '#DC2626', usage: 'Erros, vencido, exclusão' },
  { name: 'danger-light', className: 'bg-danger-light', hex: '#FEE2E2', usage: 'Fundo de badge de erro' },
  { name: 'warning', className: 'bg-warning', hex: '#D97706', usage: 'Alertas, pendências' },
  { name: 'warning-light', className: 'bg-warning-light', hex: '#FEF3C7', usage: 'Fundo de badge de alerta' },
  { name: 'info', className: 'bg-info', hex: '#0EA5E9', usage: 'Informações, status cobrado' },
  { name: 'info-light', className: 'bg-info-light', hex: '#E0F2FE', usage: 'Fundo de badge informativo' },
]

const semanticTokens: ColorToken[] = [
  { name: 'app', className: 'bg-app', hex: '#F8FAFC / #0B1220', usage: 'Fundo geral' },
  { name: 'card', className: 'bg-card', hex: '#FFFFFF / #101A2E', usage: 'Cards, sidebar, topbar' },
  { name: 'card-hover', className: 'bg-card-hover', hex: '#F1F5F9 / #182338', usage: 'Hover de itens' },
  { name: 'border', className: 'bg-border', hex: '#E2E8F0 / #233049', usage: 'Bordas e divisores' },
  { name: 'input', className: 'bg-input', hex: '#FFFFFF / #0D1728', usage: 'Fundo de inputs' },
  { name: 'primary-soft', className: 'bg-primary-soft', hex: '#E0F7FC / #0E2A38', usage: 'Destaque primário' },
  { name: 'success-soft', className: 'bg-success-soft', hex: '#DCFCE7 / #0F2A1A', usage: 'Badge sucesso' },
  { name: 'danger-soft', className: 'bg-danger-soft', hex: '#FEE2E2 / #331416', usage: 'Badge erro' },
  { name: 'warning-soft', className: 'bg-warning-soft', hex: '#FEF3C7 / #33260D', usage: 'Badge alerta' },
  { name: 'info-soft', className: 'bg-info-soft', hex: '#E0F2FE / #0C2536', usage: 'Badge info' },
]

const typeScale = [
  { token: 'text-xs', size: '12px', weight: '400', family: 'Nunito', usage: 'Legendas, hints', className: 'text-xs font-body' },
  { token: 'text-sm', size: '14px', weight: '400', family: 'Nunito', usage: 'Labels, textos auxiliares', className: 'text-sm font-body' },
  { token: 'text-base', size: '16px', weight: '400', family: 'Nunito', usage: 'Corpo principal', className: 'text-base font-body' },
  { token: 'text-lg', size: '18px', weight: '500', family: 'Nunito', usage: 'Destaque, subtítulo', className: 'text-lg font-medium font-body' },
  { token: 'text-xl', size: '20px', weight: '600', family: 'Montserrat', usage: 'Títulos de card/seção', className: 'text-xl font-semibold font-heading text-navy' },
  { token: 'text-2xl', size: '24px', weight: '700', family: 'Montserrat', usage: 'Títulos de página', className: 'text-2xl font-bold font-heading text-navy' },
  { token: 'text-3xl', size: '30px', weight: '700', family: 'Montserrat', usage: 'Títulos grandes', className: 'text-3xl font-bold font-heading text-navy' },
  { token: 'text-4xl', size: '36px', weight: '800', family: 'Montserrat', usage: 'Headlines de marketing', className: 'text-4xl font-extrabold font-heading text-navy' },
  { token: 'text-5xl', size: '48px', weight: '800', family: 'Montserrat', usage: 'Logo e hero text', className: 'text-5xl font-extrabold font-heading text-primary' },
]

const spacingScale = [
  { token: '1', px: 4, usage: 'Micro espaçamento' },
  { token: '2', px: 8, usage: 'Padding de badges e chips' },
  { token: '3', px: 12, usage: 'Gap entre ícone e texto' },
  { token: '4', px: 16, usage: 'Padding de inputs e botões' },
  { token: '5', px: 20, usage: 'Entre campos de formulário' },
  { token: '6', px: 24, usage: 'Padding de cards' },
  { token: '8', px: 32, usage: 'Entre seções' },
  { token: '10', px: 40, usage: 'Padding de layouts internos' },
  { token: '12', px: 48, usage: 'Espaçamento de páginas' },
  { token: '16', px: 64, usage: 'Seções grandes' },
]

const radiusScale = [
  { token: 'rounded', value: '4px', className: 'rounded', usage: 'Inputs, badges pequenos' },
  { token: 'rounded-md', value: '6px', className: 'rounded-md', usage: 'Botões' },
  { token: 'rounded-lg', value: '8px', className: 'rounded-lg', usage: 'Cards, modais, dropdowns' },
  { token: 'rounded-xl', value: '12px', className: 'rounded-xl', usage: 'Cards maiores, painéis' },
  { token: 'rounded-2xl', value: '16px', className: 'rounded-2xl', usage: 'Ícones de feature' },
  { token: 'rounded-full', value: '9999px', className: 'rounded-full', usage: 'Avatares, chips' },
]

const shadowScale = [
  { token: 'shadow-sm', className: 'shadow-sm', usage: 'Inputs em hover/focus' },
  { token: 'shadow', className: 'shadow', usage: 'Cards padrão' },
  { token: 'shadow-md', className: 'shadow-md', usage: 'Dropdowns, tooltips' },
  { token: 'shadow-lg', className: 'shadow-lg', usage: 'Modais, drawers' },
  { token: 'shadow-xl', className: 'shadow-xl', usage: 'Modais grandes, popovers' },
]

const statusBadges = [
  { label: 'Ativo / Pago', className: 'bg-success-light text-success' },
  { label: 'Pendente', className: 'bg-warning-light text-warning' },
  { label: 'Vencido', className: 'bg-danger-light text-danger' },
  { label: 'Cobrado', className: 'bg-info-light text-info' },
  { label: 'Cancelado', className: 'bg-gray-100 text-gray-600' },
  { label: 'Inativo', className: 'bg-gray-100 text-gray-600' },
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-1 font-heading text-2xl font-bold text-navy">{title}</h2>
      <div className="mb-6 h-1 w-12 rounded-full bg-primary" />
      {children}
    </section>
  )
}

function ColorGrid({ title, tokens }: { title: string; tokens: ColorToken[] }) {
  return (
    <div className="mb-8">
      <h3 className="mb-3 font-heading text-lg font-semibold text-navy-light">{title}</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {tokens.map((token) => (
          <div key={token.name} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className={`h-16 ${token.className} border-b border-gray-100`} />
            <div className="p-3">
              <p className="font-mono text-sm font-bold text-gray-900">{token.name}</p>
              <p className="font-mono text-xs text-gray-400">{token.hex}</p>
              <p className="mt-1 text-xs text-gray-600">{token.usage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-navy px-8 py-10">
        <p className="font-heading text-5xl font-extrabold text-primary">VANZ</p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white">Design System</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-400">
          Documentação viva dos tokens visuais. Fonte de verdade:{' '}
          <code className="rounded bg-navy-light px-1.5 py-0.5 font-mono text-xs text-primary-light">standards/design.md</code>{' '}
          +{' '}
          <code className="rounded bg-navy-light px-1.5 py-0.5 font-mono text-xs text-primary-light">src/style.css</code>
        </p>
      </header>

      <div className="mx-auto max-w-6xl px-8 py-12">
        {/* 1. Cores */}
        <Section title="1. Cores">
          <ColorGrid title="Marca" tokens={brandColors} />
          <ColorGrid title="Neutros" tokens={neutralColors} />
          <ColorGrid title="Status / Feedback" tokens={statusColors} />
          <ColorGrid title="Tokens Semânticos (light / dark — mudam com o tema)" tokens={semanticTokens} />
        </Section>

        {/* 2. Tipografia */}
        <Section title="2. Tipografia">
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="font-heading text-3xl font-bold text-navy">Montserrat</p>
              <p className="mt-1 text-sm text-gray-600">Headings — pesos 500, 600, 700, 800</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="font-body text-3xl text-gray-900">Nunito</p>
              <p className="mt-1 text-sm text-gray-600">Body — pesos 400, 500, 700</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            {typeScale.map((t) => (
              <div key={t.token} className="flex items-baseline gap-6 border-b border-gray-100 px-6 py-4 last:border-b-0">
                <span className="w-24 shrink-0 font-mono text-xs text-gray-400">{t.token}</span>
                <span className={t.className}>Vanz transporte escolar</span>
                <span className="ml-auto hidden shrink-0 text-xs text-gray-400 sm:block">
                  {t.size} · {t.weight} · {t.family} — {t.usage}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* 3. Espaçamento */}
        <Section title="3. Espaçamento">
          <p className="mb-4 text-sm text-gray-600">Escala base do Tailwind — múltiplos de 4px.</p>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            {spacingScale.map((s) => (
              <div key={s.token} className="mb-3 flex items-center gap-4 last:mb-0">
                <span className="w-8 shrink-0 font-mono text-xs text-gray-400">{s.token}</span>
                <div className="h-4 rounded-sm bg-primary" style={{ width: s.px }} />
                <span className="text-xs text-gray-600">{s.px}px — {s.usage}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* 4. Bordas */}
        <Section title="4. Bordas e Arredondamentos">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {radiusScale.map((r) => (
              <div key={r.token} className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className={`h-16 w-16 border-2 border-primary bg-primary-light ${r.className}`} />
                <p className="font-mono text-xs font-bold text-gray-900">{r.token}</p>
                <p className="text-center text-xs text-gray-600">{r.value}</p>
                <p className="text-center text-xs text-gray-400">{r.usage}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 5. Sombras */}
        <Section title="5. Sombras">
          <div className="grid grid-cols-2 gap-6 rounded-lg bg-gray-100 p-8 sm:grid-cols-5">
            {shadowScale.map((s) => (
              <div key={s.token} className={`flex h-24 flex-col items-center justify-center rounded-lg bg-white ${s.className}`}>
                <p className="font-mono text-xs font-bold text-gray-900">{s.token}</p>
                <p className="px-2 text-center text-xs text-gray-400">{s.usage}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 6. Componentes */}
        <Section title="6. Componentes Visuais Padrão">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Botões */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-heading text-lg font-semibold text-navy-light">Botões</h3>
              <div className="flex flex-wrap items-center gap-4">
                <button className="rounded-md bg-primary px-6 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
                  Primário
                </button>
                <button className="rounded-md border border-gray-200 bg-white px-6 py-3 font-heading text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100">
                  Secundário
                </button>
                <button className="rounded-md px-6 py-3 font-heading text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100">
                  Ghost
                </button>
                <button className="pointer-events-none rounded-md bg-primary px-6 py-3 font-heading text-sm font-semibold text-white opacity-50" disabled>
                  Disabled
                </button>
                <button className="rounded-md bg-danger px-6 py-3 font-heading text-sm font-semibold text-white transition-colors hover:opacity-90">
                  Destrutivo
                </button>
              </div>
              <p className="mt-4 text-xs text-gray-400">
                Montserrat 600 · px-6 py-3 · rounded-md · hover: primary-hover
              </p>
            </div>

            {/* Inputs */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-heading text-lg font-semibold text-navy-light">Inputs</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-600">Padrão</label>
                  <input
                    className="w-full rounded border border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none"
                    placeholder="Digite seu email"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-danger">Com erro</label>
                  <input
                    className="w-full rounded border border-danger bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none"
                    placeholder="email inválido"
                  />
                  <p className="mt-1 text-xs text-danger">Informe um email válido.</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-400">
                Borda gray-200 · focus primary · rounded · px-4 py-3
              </p>
            </div>

            {/* Badges */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
              <h3 className="mb-4 font-heading text-lg font-semibold text-navy-light">Badges de Status</h3>
              <div className="flex flex-wrap gap-3">
                {statusBadges.map((b) => (
                  <span key={b.label} className={`rounded-full px-3 py-1 text-xs font-bold ${b.className}`}>
                    {b.label}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-400">
                Sempre via variante semântica — nunca cor hardcoded.
              </p>
            </div>
          </div>
        </Section>

        {/* 7. Layout */}
        <Section title="7. Layout (área logada)">
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <div className="flex h-64">
              <div className="flex w-40 shrink-0 flex-col bg-navy p-3">
                <p className="mb-3 font-heading text-sm font-extrabold text-primary">VANZ</p>
                <div className="rounded bg-primary px-2 py-1.5 text-xs font-bold text-white">Item ativo</div>
                <div className="px-2 py-1.5 text-xs text-gray-400">Item inativo</div>
                <div className="px-2 py-1.5 text-xs text-gray-400">Item inativo</div>
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex h-10 shrink-0 items-center border-b border-gray-200 bg-white px-4">
                  <span className="text-xs text-gray-600">Topbar — 64px, white, borda gray-200</span>
                </div>
                <div className="flex-1 bg-gray-50 p-4">
                  <span className="text-xs text-gray-600">Conteúdo — gray-50, px-8 py-6</span>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Sidebar 240px (colapsada 64px), background navy, item ativo primary.
          </p>
        </Section>

        {/* 8. Regras */}
        <Section title="8. Regras">
          <ul className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
            <li>• Nenhum valor de cor hardcoded — sempre via token (<code className="font-mono text-xs">text-primary</code>, <code className="font-mono text-xs">bg-navy</code>).</li>
            <li>• Cores de status sempre via Badge com variante semântica.</li>
            <li>• Texto sempre em <code className="font-mono text-xs">gray-900</code> ou <code className="font-mono text-xs">navy</code> — nunca preto puro.</li>
            <li>• Heading sempre Montserrat, body sempre Nunito.</li>
            <li>• Gradientes apenas em áreas de marketing — nunca na área logada.</li>
          </ul>
        </Section>
      </div>
    </main>
  )
}
