import { useState } from 'react'
import { Link } from 'react-router-dom'

const MOCK_GARDE = {
  id: '1',
  animal:  'Luna',
  gardien: { nom: 'Jules', prenom: 'Jules', id: 'jules-martin' },
  dates:   '10 au 17 mars 2025',
}

const CRITERES = [
  { id: 'communication', label: 'Communication', icon: '💬' },
  { id: 'ponctualite',   label: 'Ponctualité',   icon: '🕐' },
  { id: 'soin',          label: "Soin de l'animal", icon: '🐾' },
  { id: 'logement',      label: 'Logement',       icon: '🏠' },
]

const ETAPES = ['Compte-rendu', 'Retour confirmé', 'Laisser un avis']

function StarRating({ value, onChange, size = 'lg' }: { value: number; onChange: (n: number) => void; size?: 'sm' | 'lg' }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          className={`transition-transform hover:scale-110 ${size === 'lg' ? 'text-4xl' : 'text-base'}`}
          style={{ color: i <= (hovered || value) ? '#D91B5C' : '#D1D5DB' }}>
          ★
        </button>
      ))}
    </div>
  )
}

export default function FinDeGardePage() {
  const g = MOCK_GARDE
  const [noteGlobale, setNoteGlobale]   = useState(0)
  const [notesCriteres, setNotesCriteres] = useState<Record<string, number>>({})
  const [commentaire, setCommentaire]   = useState('')
  const [recommande, setRecommande]     = useState(false)

  const setCritere = (id: string, val: number) =>
    setNotesCriteres(prev => ({ ...prev, [id]: val }))

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // TODO: POST /api/gardes/:id/avis
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>

      {/* Navbar minimale */}
      <nav className="w-full bg-white border-b border-gray-100 px-8 h-14 flex items-center">
        <Link to="/"><img src="/logo1.png" alt="L'Arche" className="h-8 w-auto" /></Link>
      </nav>

      <main className="flex-1 flex flex-col items-center px-4 py-10">

        {/* En-tête */}
        <div className="text-center mb-8">
          <p className="text-xs font-black tracking-widest mb-2" style={{ color: '#5A7A1A' }}>FIN DE GARDE</p>
          <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {g.animal} est rentrée à la maison
          </h1>
          <p className="text-sm text-gray-500">Garde du {g.dates} - {g.gardien.nom}</p>
        </div>

        {/* Indicateur d'étapes */}
        <div className="flex items-start justify-center gap-0 mb-10">
          {ETAPES.map((label, i) => {
            const done   = i < 2
            const active = i === 2
            return (
              <div key={i} className="flex items-start">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                    done   ? 'text-white' :
                    active ? 'text-white' : 'bg-white border-gray-300 text-gray-400'
                  }`} style={done ? { backgroundColor: '#D91B5C', borderColor: '#D91B5C' } : active ? { backgroundColor: '#3A5220', borderColor: '#3A5220' } : {}}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className={`mt-1 text-xs font-semibold ${active ? 'text-gray-800' : done ? 'text-gray-400' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </div>
                {i < ETAPES.length - 1 && (
                  <div className="w-16 h-[2px] mt-[18px]" style={{ backgroundColor: i < 1 ? '#D91B5C' : '#E5E7EB' }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Formulaire avis */}
        <div className="bg-white rounded-2xl shadow-sm w-full max-w-lg px-8 py-8">
          <h2 className="text-xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            Votre avis sur {g.gardien.prenom}
          </h2>
          <p className="text-sm text-gray-400 mb-6">Votre retour aide toute la communauté</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Note globale */}
            <div className="flex justify-center">
              <StarRating value={noteGlobale} onChange={setNoteGlobale} size="lg" />
            </div>

            {/* Notes par critère */}
            <div className="grid grid-cols-2 gap-3">
              {CRITERES.map(c => (
                <div key={c.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{c.icon}</span>
                    <span className="text-xs font-bold text-gray-700">{c.label}</span>
                  </div>
                  <StarRating value={notesCriteres[c.id] ?? 0} onChange={v => setCritere(c.id, v)} size="sm" />
                </div>
              ))}
            </div>

            {/* Commentaire */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-800">Votre commentaire</label>
              <textarea rows={4} value={commentaire} onChange={e => setCommentaire(e.target.value)}
                placeholder={`${g.gardien.prenom} est exceptionnel ! ${g.animal} était aux anges...`}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent placeholder-gray-400" />
            </div>

            {/* Recommande */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={recommande} onChange={e => setRecommande(e.target.checked)}
                className="w-4 h-4 rounded" style={{ accentColor: '#D91B5C' }} />
              <span className="text-sm font-semibold" style={{ color: '#D91B5C' }}>
                Je recommande {g.gardien.prenom} à d'autres propriétaires
              </span>
            </label>

            {/* Bouton */}
            <button type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm hover:opacity-90 transition"
              style={{ backgroundColor: '#3A5220' }}>
              Publier mon avis →
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
