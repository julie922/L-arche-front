import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import NavbarPublic from '../components/NavbarPublic'
import { ESPECES } from '../data/especes'

function Wave() {
  return (
    <div className="w-full overflow-hidden leading-none" style={{ marginBottom: '-2px' }}>
      <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 md:h-20">
        <path fill="#F0EBE1" d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" />
      </svg>
    </div>
  )
}

function Footer() {
  return (
    <footer style={{ backgroundColor: '#3A5220', fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-5xl mx-auto px-8 py-6 border-t border-white/20 flex justify-between items-center">
        <span className="text-sm text-white/70">2025 L'Arche · Association loi 1901</span>
        <span className="text-sm font-semibold" style={{ color: '#A8C539' }}>Pour les animaux</span>
      </div>
    </footer>
  )
}

const STAT_LABELS: Record<string, string> = {
  sociabilite: 'Sociabilité',
  activite: 'Activité',
  independance: 'Indépendance',
  entretien: 'Entretien',
}

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
      <span className="text-xs text-white/80 font-semibold">{label}</span>
      <div className="w-full h-1.5 rounded-full bg-white/20">
        <div className="h-1.5 rounded-full" style={{ width: `${value * 10}%`, backgroundColor: '#A8C539' }} />
      </div>
      <span className="text-xs font-black" style={{ color: '#A8C539' }}>{value}/10</span>
    </div>
  )
}

function AccordionItem({ titre, contenu }: { titre: string; contenu: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center py-4 text-left group">
        <span className="font-bold text-gray-800 text-sm">{titre}</span>
        <span className="text-xl font-light text-gray-400 group-hover:text-gray-600 transition-colors w-6 text-center">
          {open ? '×' : '+'}
        </span>
      </button>
      {open && <p className="text-sm text-gray-600 leading-relaxed pb-4 pr-8">{contenu}</p>}
    </div>
  )
}

export default function SousEspeceDetailPage() {
  const { id, sousId } = useParams<{ id: string; sousId: string }>()
  const espece   = ESPECES.find(e => e.id === id)
  const sousEspece = espece?.sousEspeces?.find(s => s.id === sousId)

  if (!espece || !sousEspece) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F0EBE1' }}>
        <NavbarPublic />
        <p className="text-gray-500 mt-20">Sous-espèce introuvable.</p>
        <Link to={`/fiches-especes/${id}`} className="mt-4 text-sm font-bold hover:underline" style={{ color: '#3A5220' }}>
          ← Retour à la fiche {espece?.nom}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <NavbarPublic />

      {/* ── Hero ──────────────────────────────────────────── */}
      <header className="relative flex flex-col items-center justify-center pt-12 pb-0 px-8 text-center"
        style={{ backgroundColor: '#3A5220', minHeight: '300px' }}>

        {/* Fil d'Ariane */}
        <div className="absolute top-4 left-6 flex items-center gap-2 text-white/60 text-xs font-semibold">
          <Link to="/fiches-especes" className="hover:text-white transition-colors">Fiches espèces</Link>
          <span>›</span>
          <Link to={`/fiches-especes/${espece.id}`} className="hover:text-white transition-colors">{espece.nom}</Link>
          <span>›</span>
          <span className="text-white">{sousEspece.nom}</span>
        </div>

        <div className="text-6xl mb-4"
          style={{ filter: 'brightness(0) saturate(100%) invert(80%) sepia(40%) saturate(400%) hue-rotate(55deg)' }}>
          {sousEspece.emoji}
        </div>

        <p className="text-xs font-black tracking-widest mb-1" style={{ color: '#A8C539' }}>
          {espece.nom.toUpperCase()}
        </p>
        <h1 className="text-4xl font-black text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          {sousEspece.nom}
        </h1>
        <p className="text-white/80 text-sm max-w-md mx-auto leading-relaxed mb-8">
          {sousEspece.intro}
        </p>

        <div className="flex gap-8 flex-wrap justify-center mb-8">
          {Object.entries(sousEspece.stats).map(([key, val]) => (
            <StatBar key={key} label={STAT_LABELS[key]} value={val} />
          ))}
        </div>

        <Wave />
      </header>

      {/* ── Contenu ───────────────────────────────────────── */}
      <main className="flex-1 px-4 py-10" style={{ backgroundColor: '#F0EBE1' }}>
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

          <div className="rounded-xl border border-gray-300 bg-white/60 p-5">
            <p className="font-black text-gray-900 text-sm mb-2">Ce que tout gardien doit savoir</p>
            <p className="text-sm text-gray-600 leading-relaxed">{sousEspece.gardienInfo}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm px-6 py-2">
            {sousEspece.sections.map((section, i) => (
              <AccordionItem key={i} titre={section.titre} contenu={section.contenu} />
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link to={`/fiches-especes/${espece.id}`}
              className="text-sm font-bold hover:underline" style={{ color: '#3A5220' }}>
              ← Toutes les races de {espece.nom.toLowerCase()}
            </Link>
            <Link to="/fiches-especes"
              className="px-6 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#3A5220' }}>
              Trouver un gardien →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
