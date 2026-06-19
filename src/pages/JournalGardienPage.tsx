import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { api } from '../services/api'

interface Reservation {
  id: string
  proprietaire_id: string
  gardien_id: string
  animal_id: string
  date_debut: string
  date_fin: string
  statut: string
  instructions: string | null
}

interface Animal {
  id: string
  nom: string
  espece: string
  race: string | null
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

const ESPECE_EMOJI: Record<string, string> = {
  Chien: '🐕', Chat: '🐈', Lapin: '🐇', Oiseau: '🐦', Rongeur: '🐹',
  Reptile: '🦎', Poisson: '🐟', Autre: '🐾',
}

function diffDays(a: string, b: string) {
  return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

export default function JournalGardienPage() {
  const { gardeId } = useParams<{ gardeId: string }>()
  const navigate = useNavigate()

  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [animal, setAnimal]           = useState<Animal | null>(null)
  const [loading, setLoading]         = useState(true)
  const [submitting, setSubmitting]   = useState(false)
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState(false)

  const [checks, setChecks]   = useState<Record<string, boolean>>({})
  const [humeur, setHumeur]   = useState<number | null>(null)
  const [note, setNote]       = useState('')
  const [photos, setPhotos]   = useState<File[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const resa = await api.get<Reservation>(`/reservations/${gardeId}`)
        setReservation(resa)
        const anim = await api.get<Animal>(`/animals/${resa.animal_id}`)
        setAnimal(anim)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }
    if (gardeId) load()
  }, [gardeId])

  const toggleCheck = (id: string) =>
    setChecks(prev => ({ ...prev, [id]: !prev[id] }))

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setPhotos(prev => [...prev, ...files].slice(0, 6))
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!gardeId) return
    setSubmitting(true)
    setError('')
    try {
      const checksDone = CHECKS.filter(c => checks[c.id]).map(c => c.label)
      const humeurLabel = HUMEURS.find(h => h.value === humeur)?.label ?? ''
      const lignes = [
        checksDone.length > 0 ? `Checks : ${checksDone.join(', ')}` : null,
        humeur ? `Humeur : ${humeurLabel} (${humeur}/5)` : null,
        note || null,
      ].filter(Boolean)

      await api.post(`/journaux/${gardeId}`, {
        type_entree: 'message',
        contenu: lignes.join('\n'),
      })

      for (const file of photos) {
        const fd = new FormData()
        fd.append('media', file)
        await api.postMultipart(`/journaux/${gardeId}/upload`, fd)
      }

      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
        <Header />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Chargement...</div>
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
        <Header />
        <div className="flex-1 flex items-center justify-center text-red-500 text-sm">{error || 'Garde introuvable'}</div>
      </div>
    )
  }

  const jourActuel  = diffDays(reservation.date_debut, new Date().toISOString().split('T')[0]) + 1
  const joursRestants = diffDays(new Date().toISOString().split('T')[0], reservation.date_fin)
  const animalEmoji = animal ? (ESPECE_EMOJI[animal.espece] ?? '🐾') : '🐾'
  const animalNom   = animal?.nom ?? '…'
  const animalRace  = animal?.race ?? animal?.espece ?? ''

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>

      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">

        {success && (
          <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 font-bold text-center">
            Mise à jour envoyée ! Redirection...
          </div>
        )}
        {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

        {/* Carte garde */}
        <div className="rounded-2xl px-5 py-4 mb-6 flex items-center justify-between" style={{ backgroundColor: '#3A5220' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#D4E6C3] flex items-center justify-center text-2xl shrink-0">
              {animalEmoji}
            </div>
            <div>
              <h1 className="text-lg font-black text-white">{animalNom} — {animalRace}</h1>
              <p className="text-xs text-white/70">
                Du {new Date(reservation.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au {new Date(reservation.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs text-white/60">
                Aujourd'hui · Jour {jourActuel}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-3xl font-black text-white">J-{joursRestants}</p>
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
            <h2 className="text-base font-black text-gray-900 mb-4">Comment va {animalNom} aujourd'hui ?</h2>
            <div className="flex justify-center gap-4">
              {HUMEURS.map(h => (
                <button key={h.value} type="button" onClick={() => setHumeur(h.value)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    humeur === h.value ? 'scale-110' : 'opacity-60 hover:opacity-80'
                  }`}>
                  <span className="text-4xl">{h.emoji}</span>
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
              placeholder={`${animalNom} est en pleine forme ! Grande balade ce matin au parc...`}
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
          <button type="submit" disabled={submitting}
            className="w-full py-4 rounded-2xl font-bold text-white text-base hover:opacity-90 transition disabled:opacity-50"
            style={{ backgroundColor: '#3A5220' }}>
            {submitting ? 'Envoi en cours...' : 'Envoyer la mise à jour →'}
          </button>
        </form>
      </main>
    </div>
  )
}
