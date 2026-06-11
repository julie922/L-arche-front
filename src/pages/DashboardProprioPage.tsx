import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

interface Reservation {
  id: string
  proprietaire_id: string
  gardien_id: string
  animal_id: string
  date_debut: string
  date_fin: string
  statut: 'en_attente' | 'confirmee' | 'terminee' | 'annulee'
}

interface Animal {
  id: string
  nom: string
  espece: string
  race: string | null
  age: string | null
  photo_url: string | null
}

const ESPECE_EMOJI: Record<string, string> = {
  Chien: '🐕', Chat: '🐈', Lapin: '🐇', Oiseau: '🐦', Rongeur: '🐹',
  Reptile: '🦎', Poisson: '🐟', Autre: '🐾',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Stars({ note, max = 5 }: { note: number; max?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className="text-xs" style={{ color: i < note ? '#F59E0B' : '#D1D5DB' }}>&#9733;</span>
      ))}
    </span>
  )
}

export default function DashboardProprioPage() {
  const { user } = useAuth()
  const [animaux, setAnimaux]           = useState<Animal[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [animRes, resaRes] = await Promise.all([
          api.get<{ data: Animal[]; total: number }>('/animals/my'),
          api.get<{ data: Reservation[]; total: number }>('/bookings?role=proprietaire'),
        ])
        setAnimaux(animRes.data || [])
        setReservations(resaRes.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const gardeEnCours = reservations.find(r => r.statut === 'confirmee')
  const historique   = reservations.filter(r => r.statut !== 'en_attente')

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>

      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">

        {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Bonjour {user?.prenom || user?.nom || ''}
            </h1>
            {gardeEnCours && (
              <p className="text-sm mt-1" style={{ color: '#3A5220' }}>Une garde est actuellement en cours</p>
            )}
          </div>
          <Link to="/gardiens"
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition shrink-0"
            style={{ backgroundColor: '#3A5220' }}>
            Trouver un gardien
          </Link>
        </div>

        {/* Garde en cours */}
        {gardeEnCours && (
          <div className="rounded-2xl px-6 py-5 mb-8" style={{ backgroundColor: '#3A5220' }}>
            <p className="text-xs font-black tracking-widest mb-1" style={{ color: '#A8C539' }}>GARDE EN COURS</p>
            <h2 className="text-xl font-black text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Garde confirmée
            </h2>
            <p className="text-sm text-white/70 mb-4">
              Du {formatDate(gardeEnCours.date_debut)} au {formatDate(gardeEnCours.date_fin)}
            </p>
            <Link to={`/garde/${gardeEnCours.id}/suivi`}
              className="inline-block px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition"
              style={{ backgroundColor: '#A8C539', color: '#1A2E0A' }}>
              Voir le journal
            </Link>
          </div>
        )}

        {loading && <div className="text-center py-10 text-gray-400 text-sm">Chargement...</div>}

        {!loading && (
          <div className="grid grid-cols-2 gap-8">

            <div className="flex flex-col gap-8">

              {/* Mes animaux */}
              <div>
                <h2 className="text-base font-black text-gray-900 mb-4">Mes animaux</h2>
                <div className="grid grid-cols-3 gap-3">
                  {animaux.map(a => (
                    <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-[#D4E6C3] flex items-center justify-center text-2xl overflow-hidden">
                        {a.photo_url
                          ? <img src={a.photo_url} alt={a.nom} className="w-full h-full object-cover" />
                          : (ESPECE_EMOJI[a.espece] ?? '🐾')}
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-black text-gray-900">{a.nom}</p>
                        <p className="text-xs text-gray-400">{[a.espece, a.race].filter(Boolean).join(' · ')}</p>
                      </div>
                      <Link to="/profil?tab=animaux"
                        className="w-full text-center py-1.5 rounded-lg text-xs font-bold border-2 hover:bg-pink-50 transition"
                        style={{ borderColor: '#D91B5C', color: '#D91B5C' }}>
                        Modifier
                      </Link>
                    </div>
                  ))}
                  <Link to="/profil?tab=animaux"
                    className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-3 flex flex-col items-center justify-center gap-1 hover:border-gray-300 transition">
                    <span className="text-2xl text-gray-300">+</span>
                    <span className="text-xs font-bold text-gray-400">Ajouter</span>
                  </Link>
                </div>
              </div>

              {/* Demandes en attente */}
              {reservations.filter(r => r.statut === 'en_attente').length > 0 && (
                <div>
                  <h2 className="text-base font-black text-gray-900 mb-4">Demandes en attente</h2>
                  <div className="flex flex-col gap-2">
                    {reservations.filter(r => r.statut === 'en_attente').map(r => (
                      <div key={r.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                        <p className="text-sm font-bold text-gray-800">Garde #{r.id.slice(0, 8)}</p>
                        <p className="text-xs text-gray-400">{formatDate(r.date_debut)} → {formatDate(r.date_fin)}</p>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full inline-block mt-1.5" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>En attente de confirmation</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Historique */}
            <div>
              <h2 className="text-base font-black text-gray-900 mb-4">Historique des gardes</h2>
              {historique.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center">
                  <p className="text-gray-400 text-sm">Aucune garde pour l'instant</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Garde', 'Dates', 'Statut'].map(col => (
                          <th key={col} className="text-left px-4 py-3 text-xs font-black tracking-widest text-gray-400 uppercase">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {historique.map(r => (
                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-semibold text-gray-800">#{r.id.slice(0, 6)}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(r.date_debut)} – {formatDate(r.date_fin)}</td>
                          <td className="px-4 py-3">
                            {r.statut === 'confirmee' ? (
                              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#D4E6C3', color: '#3A5220' }}>En cours</span>
                            ) : r.statut === 'terminee' ? (
                              <Stars note={0} />
                            ) : (
                              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">Annulée</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
