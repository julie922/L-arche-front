import { useState } from 'react'
import { Link } from 'react-router-dom'

const MOCK_GARDE = {
  gardeId: '1',
  animal: { nom: 'Luna', race: 'Border Collie', emoji: '🐕' },
  proprietaire: 'Camille R.',
  gardien: 'Jules Martin',
  dateDebut: '2025-03-10',
  dateFin: '2025-03-17',
  dateAujourdHui: 'Mercredi 12 mars',
  jourActuel: 3,
  jourTotal: 7,
  joursRestants: 5,
}

const CHECKS = [
  { id: 'repas_matin', label: 'Repas du matin',  icon: '🦴' },
  { id: 'repas_soir',  label: 'Repas du soir',   icon: '🦴' },
  { id: 'promenade',   label: 'Promenade',        icon: '🐾' },
  { id: 'medicaments', label: 'Médicaments',      icon: '💊' },
  { id: 'bonne_nuit',  label: 'Bonne nuit',       icon: '🌙' },
]

const HUMEURS = [
  { value: 5, emoji: '😊', label: 'Excellent' },
  { value: 4, emoji: '🙂', label: 'Bien' },
  { value: 3, emoji: '😐', label: 'Moyen' },
  { value: 2, emoji: '😕', label: 'Pas top' },
  { value: 1, emoji: '😢', label: 'Difficile' },
]

export default function JournalGardienPage() {
  const g = MOCK_GARDE
  const [checks, setChecks]   = useState<Record<string, boolean>>({})
  const [humeur, setHumeur]   = useState<number | null>(null)
  const [note, setNote]       = useState('')
  const [photos, setPhotos]   = useState<File[]>([])

  const toggleCheck = (id: string) =>
    setChecks(prev => ({ ...prev, [id]: !prev[id] }))

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setPhotos(prev => [...prev, ...files].slice(0, 6))
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // TODO: POST /api/gardes/:id/journal
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>

      {/* Navbar */}
      <nav className="w-full bg-white border-b border-gray-100 px-8 h-14 flex items-center justify-between shrink-0">
        <Link to="/"><img src="/logo1.png" alt="L'Arche" className="h-8 w-auto" /></Link>
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-[#3A5220] transition-colors flex items-center gap-1">
            ← Dashboard
          </Link>
          <Link to="/messages" className="text-sm font-semibold text-gray-500 hover:text-[#3A5220] transition-colors">
            Messagerie
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">

        {/* Carte garde */}
        <div className="rounded-2xl px-5 py-4 mb-6 flex items-center justify-between" style={{ backgroundColor: '#3A5220' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#D4E6C3] flex items-center justify-center text-2xl shrink-0">
              {g.animal.emoji}
            </div>
            <div>
              <h1 className="text-lg font-black text-white">{g.animal.nom} — {g.animal.race}</h1>
              <p className="text-xs text-white/70">Garde de {g.proprietaire} · {g.dateDebut.split('-')[2].replace(/^0/, '')}-{g.dateFin.split('-')[2].replace(/^0/, '')} mars 2025</p>
              <p className="text-xs text-white/60">Aujourd'hui : {g.dateAujourdHui} · Jour {g.jourActuel}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-3xl font-black text-white">J-{g.joursRestants}</p>
            <p className="text-xs font-bold tracking-widest" style={{ color: '#A8C539' }}>AVANT LA FIN</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Checks du jour */}
          <div className="bg-white rounded-2xl p-5">
            <h2 className="text-base font-black text-gray-900 mb-4">Checks du jour</h2>
            <div className="grid grid-cols-2 gap-3">
              {CHECKS.map(c => {
                const done = !!checks[c.id]
                return (
                  <button key={c.id} type="button" onClick={() => toggleCheck(c.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                      done ? 'border-[#D91B5C] bg-pink-50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                    }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{c.icon}</span>
                      <span className="text-sm font-semibold text-gray-800">{c.label}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      done ? 'text-white' : 'border-2 border-gray-200'
                    }`} style={done ? { backgroundColor: '#D91B5C' } : {}}>
                      {done && <span className="text-xs">✓</span>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Humeur */}
          <div className="bg-white rounded-2xl p-5">
            <h2 className="text-base font-black text-gray-900 mb-4">Comment va {g.animal.nom} aujourd'hui ?</h2>
            <div className="flex justify-center gap-4">
              {HUMEURS.map(h => (
                <button key={h.value} type="button" onClick={() => setHumeur(h.value)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    humeur === h.value ? 'scale-110' : 'opacity-60 hover:opacity-80'
                  }`}>
                  <span className={`text-4xl transition-all ${humeur === h.value ? 'filter-none' : ''}`}
                    style={{ filter: humeur === h.value ? 'none' : 'grayscale(0.3)' }}>
                    {h.emoji}
                  </span>
                  {humeur === h.value && (
                    <span className="text-xs font-bold" style={{ color: '#3A5220' }}>{h.label}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Note du jour */}
          <div className="bg-white rounded-2xl p-5">
            <h2 className="text-base font-black text-gray-900 mb-3">Note du jour</h2>
            <textarea rows={4} value={note} onChange={e => setNote(e.target.value)}
              placeholder={`${g.animal.nom} est en pleine forme ! Grande balade ce matin au parc...`}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent placeholder-gray-400" />
          </div>

          {/* Photos du jour */}
          <div className="bg-white rounded-2xl p-5">
            <h2 className="text-base font-black text-gray-900 mb-4">Photos du jour</h2>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative">
                  <img src={URL.createObjectURL(photo)} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white text-xs flex items-center justify-center">
                    ×
                  </button>
                </div>
              ))}
              {photos.length < 6 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#3A5220] transition-colors">
                  <span className="text-2xl text-gray-300">+</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
                </label>
              )}
            </div>
          </div>

          {/* Bouton envoi */}
          <button type="submit"
            className="w-full py-4 rounded-2xl font-bold text-white text-base hover:opacity-90 transition"
            style={{ backgroundColor: '#3A5220' }}>
            Envoyer la mise à jour à {g.proprietaire.split(' ')[0]} →
          </button>
        </form>
      </main>
    </div>
  )
}
