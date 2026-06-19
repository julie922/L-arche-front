import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
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
}

interface Animal {
  id: string
  nom: string
  espece: string
  race: string | null
}

interface JournalEntry {
  id: string
  reservation_id: string
  auteur_id: string
  type_entree: 'message' | 'photo' | 'statut' | 'alerte'
  contenu: string | null
  media_url: string | null
  created_at: string
}

const ESPECE_EMOJI: Record<string, string> = {
  Chien: '🐕', Chat: '🐈', Lapin: '🐇', Oiseau: '🐦', Rongeur: '🐹',
  Reptile: '🦎', Poisson: '🐟', Autre: '🐾',
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
    heure: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  }
}

export default function JournalProprioPage() {
  const { gardeId } = useParams<{ gardeId: string }>()

  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [animal, setAnimal]           = useState<Animal | null>(null)
  const [entries, setEntries]         = useState<JournalEntry[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const resa = await api.get<Reservation>(`/reservations/${gardeId}`)
        setReservation(resa)

        const [animRes, journalRes] = await Promise.all([
          api.get<Animal>(`/animals/${resa.animal_id}`),
          api.get<{ data: JournalEntry[]; total: number }>(`/journaux/${gardeId}`),
        ])
        setAnimal(animRes)
        setEntries((journalRes.data || []).slice().reverse())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }
    if (gardeId) load()
  }, [gardeId])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
        <Header />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Chargement...</div>
      </div>
    )
  }

  const animalEmoji = animal ? (ESPECE_EMOJI[animal.espece] ?? '🐾') : '🐾'
  const animalNom   = animal?.nom ?? '…'

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>

      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">

        {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

        {/* Carte animal */}
        {reservation && (
          <div className="rounded-2xl px-5 py-4 mb-8 flex items-center justify-between" style={{ backgroundColor: '#3A5220' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#D4E6C3] flex items-center justify-center text-2xl shrink-0">
                {animalEmoji}
              </div>
              <div>
                <h1 className="text-lg font-black text-white">{animalNom} est entre de bonnes mains</h1>
                <p className="text-xs text-white/70">
                  Du {new Date(reservation.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au {new Date(reservation.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            <Link to="/messages"
              className="px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition shrink-0"
              style={{ backgroundColor: '#A8C539', color: '#1A2E0A' }}>
              Envoyer un message
            </Link>
          </div>
        )}

        {entries.length === 0 && !loading && (
          <div className="bg-white rounded-2xl p-10 text-center">
            <p className="text-3xl mb-2">📖</p>
            <p className="font-bold text-gray-700">Aucune entrée dans le journal pour l'instant</p>
            <p className="text-sm text-gray-400 mt-1">Le gardien publiera les mises à jour ici</p>
          </div>
        )}

        {/* Timeline des entrées */}
        {entries.length > 0 && (
          <div className="relative flex flex-col gap-6">
            <div className="absolute left-2 top-4 bottom-4 w-0.5 bg-gray-200" />

            {entries.map((e, idx) => {
              const { date, heure } = formatDateTime(e.created_at)
              const isFirst = idx === entries.length - 1
              return (
                <div key={e.id} className="relative pl-8">
                  <div className="absolute left-0 top-4 w-4 h-4 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: isFirst ? '#D91B5C' : '#E5E7EB' }} />

                  <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-gray-500 capitalize">{date} · {heure}</span>
                      {isFirst && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FCE4EC', color: '#D91B5C' }}>
                          Début de garde
                        </span>
                      )}
                      {e.type_entree === 'alerte' && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-500">Alerte</span>
                      )}
                    </div>

                    {e.contenu && (
                      <p className="text-sm text-gray-700 leading-relaxed mb-3 whitespace-pre-line">
                        {e.type_entree === 'message' && !isFirst && (
                          <span className="font-bold" style={{ color: '#D91B5C' }}>Mise à jour : </span>
                        )}
                        {e.contenu}
                      </p>
                    )}

                    {e.media_url && (
                      <div className="mt-2">
                        <img src={e.media_url} alt="photo de garde" className="rounded-xl max-h-64 object-cover w-full" />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
