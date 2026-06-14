import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { api } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

interface Reservation {
  id: string
  proprietaire_id: string
  gardien_id: string
  animal_id: string
  date_debut: string
  date_fin: string
  statut: string
}

interface Animal {
  id: string
  nom: string
  espece: string
}

interface Gardien {
  id: string
  nom: string
  prenom: string
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
  const { gardeId } = useParams<{ gardeId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [animal, setAnimal]           = useState<Animal | null>(null)
  const [gardien, setGardien]         = useState<Gardien | null>(null)
  const [loading, setLoading]         = useState(true)
  const [submitting, setSubmitting]   = useState(false)
  const [error, setError]             = useState('')
  const [done, setDone]               = useState(false)

  const [noteGlobale, setNoteGlobale]     = useState(0)
  const [notesCriteres, setNotesCriteres] = useState<Record<string, number>>({})
  const [commentaire, setCommentaire]     = useState('')
  const [recommande, setRecommande]       = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const resa = await api.get<Reservation>(`/reservations/${gardeId}`)
        setReservation(resa)
        const [anim, gard] = await Promise.all([
          api.get<Animal>(`/animals/${resa.animal_id}`),
          api.get<Gardien>(`/users/gardiens/${resa.gardien_id}`),
        ])
        setAnimal(anim)
        setGardien(gard)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }
    if (gardeId) load()
  }, [gardeId])

  const setCritere = (id: string, val: number) =>
    setNotesCriteres(prev => ({ ...prev, [id]: val }))

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!reservation || !noteGlobale) return
    setSubmitting(true)
    setError('')
    try {
      // Marquer la garde comme terminée si ce n'est pas déjà fait
      if (reservation.statut === 'confirmee') {
        await api.patch(`/reservations/${gardeId}/complete`, {})
      }
      // Publier l'avis
      const criteriasText = Object.entries(notesCriteres)
        .map(([id, val]) => `${CRITERES.find(c => c.id === id)?.label}: ${val}/5`)
        .join(', ')
      const fullCommentaire = criteriasText && commentaire
        ? `${commentaire}\n[${criteriasText}]`
        : commentaire || (criteriasText ? `[${criteriasText}]` : '')

      await api.post('/reviews', {
        reservation_id: reservation.id,
        cible_id: reservation.gardien_id,
        note: noteGlobale,
        commentaire: fullCommentaire || null,
        recommande,
      })
      setDone(true)
      setTimeout(() => navigate('/dashboard-proprio'), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la publication')
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

  const gardienPrenom = gardien?.prenom || gardien?.nom || 'le gardien'
  const animalNom = animal?.nom || '…'
  const dateRange = reservation
    ? `${new Date(reservation.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au ${new Date(reservation.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
    : ''

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>

      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-10">

        {done && (
          <div className="w-full max-w-lg mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 font-bold text-center">
            Avis publié ! Merci pour votre retour. Redirection...
          </div>
        )}
        {error && (
          <div className="w-full max-w-lg mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {/* En-tête */}
        <div className="text-center mb-8">
          <p className="text-xs font-black tracking-widest mb-2" style={{ color: '#5A7A1A' }}>FIN DE GARDE</p>
          <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {animalNom} est rentré(e) à la maison
          </h1>
          <p className="text-sm text-gray-500">Garde du {dateRange} — {gardienPrenom}</p>
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
                  <div className="w-16 h-0.5 mt-4.5" style={{ backgroundColor: i < 1 ? '#D91B5C' : '#E5E7EB' }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Formulaire avis */}
        <div className="bg-white rounded-2xl shadow-sm w-full max-w-lg px-8 py-8">
          <h2 className="text-xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            Votre avis sur {gardienPrenom}
          </h2>
          <p className="text-sm text-gray-400 mb-6">Votre retour aide toute la communauté</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Note globale */}
            <div className="flex justify-center">
              <StarRating value={noteGlobale} onChange={setNoteGlobale} size="lg" />
            </div>
            {!noteGlobale && <p className="text-xs text-center text-gray-400">Cliquez sur une étoile pour noter</p>}

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
                placeholder={`${gardienPrenom} est exceptionnel ! ${animalNom} était aux anges...`}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent placeholder-gray-400" />
            </div>

            {/* Recommande */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={recommande} onChange={e => setRecommande(e.target.checked)}
                className="w-4 h-4 rounded" style={{ accentColor: '#D91B5C' }} />
              <span className="text-sm font-semibold" style={{ color: '#D91B5C' }}>
                Je recommande {gardienPrenom} à d'autres propriétaires
              </span>
            </label>

            {/* Bouton */}
            <button type="submit" disabled={submitting || !noteGlobale}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm hover:opacity-90 transition disabled:opacity-50"
              style={{ backgroundColor: '#3A5220' }}>
              {submitting ? 'Publication...' : 'Publier mon avis →'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
