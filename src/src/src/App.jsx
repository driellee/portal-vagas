import React, { useEffect, useMemo, useState } from 'react'

const SITE = {
  title: 'Vagas Tech BR',
  subtitle: 'Portal aberto de vagas de tecnologia no Brasil',
  brandEmoji: '💼',
  contactEmail: 'dricruzeiro@live.com',
  ctaDiscord: null,
  itemsPerPage: 10,
  utm: '?utm_source=jobboard&utm_medium=apply_button',
}

const KNOWN_STACKS = ['Ruby on Rails','React','TypeScript','Next.js','Tailwind','PostgreSQL','AWS','Vercel']
const LEVELS = ['Júnior','Pleno','Sênior','Principal']
const CONTRACTS = ['CLT','PJ','Freelance']
const MODELS = ['Remoto','Híbrido','Presencial']

const DEMO = [
  {
    id: 'senior-ror-react-001',
    title: 'Senior Full Stack Engineer (Ruby on Rails + React)',
    company: 'Confidencial (cliente Brasil)',
    contract: 'CLT',
    model: 'Remoto',
    location: 'Brasil',
    seniority: 'Sênior',
    stacks: ['Ruby on Rails','React','PostgreSQL','AWS','Next.js','Tailwind','TypeScript','Vercel'],
    niceToHave: ['DevOps','UI/UX','Open-source','Creator platforms'],
    salary: 'R$ 20k – 28k CLT (faixa indicativa)',
    description: 'Leia atentamente os requisitos antes de se candidatar. Esta vaga é para profissionais que atendam ao perfil descrito.',
    applyUrl: 'mailto:talentos@empresa.com?subject=Senior%20Full%20Stack%20(Rails%20%2B%20React)',
    postedAt: '2025-08-09',
    source: 'Orgânica',
  },
]

function useJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('jobs.json', { cache: 'no-store' })
        if (!res.ok) throw new Error('Sem jobs.json – usando DEMO')
        const data = await res.json()
        setJobs(Array.isArray(data) ? data : DEMO)
      } catch (e) {
        setJobs(DEMO)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])
  return { jobs, loading }
}

const badgeStyles = {
  default: 'px-2 py-1 rounded-full text-xs border',
  solid: 'px-2 py-1 rounded-full text-xs',
  map: {
    CLT: 'bg-green-100 border-green-300 text-green-900',
    PJ: 'bg-yellow-100 border-yellow-300 text-yellow-900',
    Freelance: 'bg-purple-100 border-purple-300 text-purple-900',
    Remoto: 'bg-blue-100 border-blue-300 text-blue-900',
    Híbrido: 'bg-teal-100 border-teal-300 text-teal-900',
    Presencial: 'bg-orange-100 border-orange-300 text-orange-900',
    Sênior: 'bg-zinc-800 text-white',
    Pleno: 'bg-zinc-700 text-white',
    Júnior: 'bg-zinc-600 text-white',
    Principal: 'bg-black text-white',
  },
}

function Badge({ children, tone = 'default' }) {
  const style = badgeStyles.map[children] || (tone === 'solid' ? 'bg-zinc-100 text-zinc-800' : 'border-zinc-300 text-zinc-700')
  const base = tone === 'solid' ? badgeStyles.solid : badgeStyles.default
  return <span className={`${base} ${style}`}>{children}</span>
}

function Header() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{SITE.brandEmoji}</div>
          <div>
            <h1 className="text-xl font-bold">{SITE.title}</h1>
            <p className="text-sm text-zinc-600">{SITE.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {SITE.ctaDiscord && (
            <a href={SITE.ctaDiscord} className="px-3 py-2 rounded-xl border shadow-sm hover:shadow">Comunidade</a>
          )}
          <a href={`mailto:${SITE.contactEmail}?subject=Parceria%20de%20vagas`} className="px-3 py-2 rounded-xl border shadow-sm hover:shadow">Publicar vaga</a>
        </div>
      </div>
    </header>
  )
}

function Filters({ query, setQuery, selected, setSelected, totals }) {
  const toggle = (group, value) => {
    const current = new Set(selected[group])
    current.has(value) ? current.delete(value) : current.add(value)
    setSelected({ ...selected, [group]: Array.from(current) })
  }
  const clearAll = () => {
    setQuery('')
    setSelected({ levels: [], contracts: [], models: [], stacks: [] })
  }
  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busque por título, empresa, stack, localização…"
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring"
        />
        <div className="grid md:grid-cols-4 gap-3">
          <FilterGroup title="Nível" options={LEVELS} selected={selected.levels} onToggle={(v) => toggle('levels', v)} />
          <FilterGroup title="Contrato" options={CONTRACTS} selected={selected.contracts} onToggle={(v) => toggle('contracts', v)} />
          <FilterGroup title="Modelo" options={MODELS} selected={selected.models} onToggle={(v) => toggle('models', v)} />
          <FilterGroup title="Stacks" options={KNOWN_STACKS} selected={selected.stacks} onToggle={(v) => toggle('stacks', v)} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <button onClick={clearAll} className="text-zinc-600 underline">Limpar filtros</button>
          <div className="text-zinc-500">{totals} vaga(s) encontradas</div>
        </div>
      </div>
    </div>
  )
}

function FilterGroup({ title, options, selected, onToggle }) {
  return (
    <div>
      <div className="text-xs font-semibold text-zinc-500 mb-2">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button key={opt} onClick={() => onToggle(opt)} className={`px-3 py-1 rounded-full border text-sm hover:shadow ${selected.includes(opt) ? 'bg-black text-white border-black' : 'bg-white'}`}>{opt}</button>
        ))}
      </div>
    </div>
  )
}

function JobCard({ job }) {
  return (
    <article className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold leading-tight">{job.title}</h3>
          <p className="text-zinc-600">{job.company}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge>{job.contract}</Badge>
            <Badge>{job.model}</Badge>
            <Badge tone="solid">{job.seniority}</Badge>
            {job.location && <span className="text-xs text-zinc-500">{job.location}</span>}
          </div>
        </div>
        <div className="text-right min-w-[180px]">
          {job.salary && <div className="text-sm font-medium">{job.salary}</div>}
          {job.postedAt && <div className="text-xs text-zinc-500">Publicado: {formatDate(job.postedAt)}</div>}
        </div>
      </div>
      {job.stacks?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {job.stacks.map((s) => (
            <span key={s} className="px-2 py-1 text-xs rounded-full bg-zinc-100">{s}</span>
          ))}
        </div>
      ) : null}
      {job.description && (
        <p className="mt-4 text-sm text-zinc-700 line-clamp-3">{job.description}</p>
      )}
      <div className="mt-4 flex items-center gap-2">
        {job.applyUrl && (
          <a href={`${job.applyUrl}${job.applyUrl?.startsWith('http') ? SITE.utm : ''}`} target={job.applyUrl.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90">Candidatar-se</a>
        )}
        <button onClick={() => navigator.share ? navigator.share({ title: job.title, text: job.company, url: window.location.href }) : copyLink()} className="px-3 py-2 rounded-xl border hover:shadow">Compartilhar</button>
      </div>
    </article>
  )
}

function copyLink() {
  try {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copiado!')
  } catch {
    alert('Não foi possível copiar o link.')
  }
}

function formatDate(s) {
  try {
    const d = new Date(s)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return s
  }
}

function paginate(arr, page, perPage) {
  const start = (page - 1) * perPage
  return arr.slice(start, start + perPage)
}

export default function App() {
  const { jobs, loading } = useJobs()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState({ levels: [], contracts: [], models: [], stacks: [] })
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const hasQ = (job) => !q || [job.title, job.company, job.location, job.description, ...(job.stacks || [])].filter(Boolean).join(' ').toLowerCase().includes(q)
    const hasLevel = (job) => !selected.levels.length || selected.levels.includes(job.seniority)
    const hasContract = (job) => !selected.contracts.length || selected.contracts.includes(job.contract)
    const hasModel = (job) => !selected.models.length || selected.models.includes(job.model)
    const hasStacks = (job) => !selected.stacks.length || selected.stacks.every((s) => job.stacks?.includes(s))
    const list = jobs.filter((job) => hasQ(job) && hasLevel(job) && hasContract(job) && hasModel(job) && hasStacks(job))
    list.sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0))
    return list
  }, [jobs, query, selected])

  useEffect(() => { setPage(1) }, [query, selected])

  const total = filtered.length
  const perPage = SITE.itemsPerPage
  const pages = Math.max(1, Math.ceil(total / perPage))
  const visible = paginate(filtered, page, perPage)

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <Filters query={query} setQuery={setQuery} selected={selected} setSelected={setSelected} totals={total} />
        {loading ? (
          <div className="text-center py-20 text-zinc-500">Carregando vagas…</div>
        ) : (
          <div className="grid gap-4">
            {visible.map((job) => (<JobCard key={job.id} job={job} />))}
            {!visible.length && (<div className="py-16 text-center text-zinc-500">Nenhuma vaga encontrada com esses filtros.</div>)}
          </div>
        )}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-2 border rounded-xl disabled:opacity-40" disabled={page === 1}>Anterior</button>
            <div className="text-sm text-zinc-600">Página {page} de {pages}</div>
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} className="px-3 py-2 border rounded-xl disabled:opacity-40" disabled={page === pages}>Próxima</button>
          </div>
        )}
        <footer className="py-10 text-center text-sm text-zinc-500">
          <div>© {new Date().getFullYear()} {SITE.title}. Feito com ❤ para a comunidade.</div>
          <div>Quer divulgar uma vaga? <a className="underline" href={`mailto:${SITE.contactEmail}?subject=Divulgar%20vaga`}>envie aqui</a>.</div>
        </footer>
      </main>
    </div>
  )
}
