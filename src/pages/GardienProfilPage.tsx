import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { api } from '../services/api'

interface Gardien {
  id: string
  nom: string
  prenom: string
  ville: string | null
  avatar_url: string | null
  description_gardien: string | null
  experience_animaux: string | null
  type_logement: string | null
  jardin: boolean | null
  animaux_acceptes: string[] | null
  note_moyenne: number | null
  nb_avis: number | null
  profil_gardien_verifie: boolean | null
}

interface Review {
  id: string
  auteur_id: string
  cible_id: string
  note: number
  commentaire: string | null
  recommande: boolean | null
  created_at: string
}

interface Dispo {
  id: string
  date_debut: string
  date_fin: string
  disponible: boolean
}

const ESPECE_EMOJI: Record<string, string> = {
  Chien: '🐕', Chat: '🐈', Lapin: '🐇', Oiseau: '🐦',
  Rongeur: '🐹', Reptile: '🦎', Poisson: '🐟', Autre: '🐾',
}

const MONTH_NAMES = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAY_LABELS  = ['L','M','M','J','V','S','D']

function expandDispos(dispos: Dispo[]): Set<string> {
  const set = new Set<string>()
  for (const d of dispos) {
    if (!d.disponible) continue
    const cur = new Date(d.date_debut)
    const end = new Date(d.date_fin)
    while (cur <= end) {
      set.add(cur.toISOString().split('T')[0])
      cur.setDate(cur.getDate() + 1)
    }
  }
  return set
}

function CalendarReadOnly({ disponibles }: { disponibles: Set<string> }) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year,  setYear]  = useState(now.getFullYear())
  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y-1) } else setMonth(m => m-1) }
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y+1) } else setMonth(m => m+1) }
  const firstDay    = new Date(year, month, 1).getDay()
  const offset      = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-3">
        <button type="button" onClick={prev} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-sm">‹</button>
        <span className="text-sm font-bold text-gray-800">Disponibilités — {MONTH_NAMES[month]} {year}</span>
        <button type="button" onClick={next} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-sm">›</button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d,i) => <div key={i} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: offset }).map((_,i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_,i) => {
          const day = i + 1
          const key = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
          const dispo = disponibles.has(key)
          return (
            <div key={key}
              className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium ${dispo ? 'text-white' : 'text-gray-400'}`}
              style={{ backgroundColor: dispo ? '#3A5220' : '#F3F4F6' }}>
              {day}
            </div>
          )
        })}
      </div>
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#3A5220' }} /><span className="text-xs text-gray-500">Disponible</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-gray-200" /><span className="text-xs text-gray-500">Indisponible</span></div>
      </div>
    </div>
  )
}

function Stars({ note }: { note: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className="text-sm" style={{ color: i <= Math.round(note) ? '#F59E0B' : '#D1D5DB' }}>★</span>
      ))}
    </span>
  )
}

function Badge({ label, color }: { label: string; color: 'green' | 'pink' }) {
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-bold"
      style={{
        backgroundColor: color === 'green' ? '#D4E6C3' : '#FCE4EC',
        color: color === 'green' ? '#3A5220' : '#D91B5C',
      }}>
      {label}
    </span>
  )
}

function Tag({ label }: { label: string }) {
  return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-700">{label}</span>
}

export default function GardienProfilPage() {
  const { id } = useParams<{ id: string }>()

  const [gardien, setGardien]   = useState<Gardien | null>(null)
  const [reviews, setReviews]   = useState<Review[]>([])
  const [dispos, setDispos]     = useState<Set<string>>(new Set())
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [favori, setFavori]     = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [g, rv, dp] = await Promise.all([
          api.get<Gardien>(`/users/gardiens/${id}`),
          api.get<{ data: Review[]; total: number }>(`/reviews/user/${id}`),
          api.get<{ data: Dispo[]; total: number }>(`/disponibilites/${id}`),
        ])
        setGardien(g)
        setReviews(rv.data || [])
        setDispos(expandDispos(dp.data || []))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <Header />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Chargement...</div>
      </div>
    )
  }

  if (error || !gardien) {
    return (
      <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <Header />
        <div className="flex-1 flex items-center justify-center text-red-500 text-sm">{error || 'Gardien introuvable'}</div>
      </div>
    )
  }

  const nbAvis  = gardien.nb_avis ?? reviews.length
  const note    = gardien.note_moyenne ?? (reviews.length > 0 ? reviews.reduce((s, r) => s + r.note, 0) / reviews.length : 0)
  const noteRounded = Math.round(note * 10) / 10

  const badges: { label: string; color: 'green' | 'pink' }[] = []
  if (gardien.profil_gardien_verifie) badges.push({ label: 'Profil vérifié', color: 'green' })
  if (gardien.experience_animaux === 'experimente') badges.push({ label: 'Gardien expérimenté', color: 'green' })
  else if (gardien.experience_animaux === 'intermediaire') badges.push({ label: 'Gardien intermédiaire', color: 'green' })

  const animauxAcceptes = gardien.animaux_acceptes ?? []
  const logementTags = [
    gardien.type_logement,
    gardien.jardin ? 'Jardin' : null,
  ].filter(Boolean) as string[]

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>

      <Header />

      {/* Hero vert */}
      <div className="w-full h-36 relative" style={{ backgroundColor: '#3A5220' }}>
        <div className="absolute top-4 max-w-5xl w-full left-1/2 -translate-x-1/2 px-6">
          <Link to="/gardiens" className="text-sm font-semibold text-white/70 hover:text-white transition-colors">
            ← Retour aux résultats
          </Link>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1" style={{ backgroundColor: '#F0EBE1' }}>
        <div className="max-w-5xl mx-auto px-6 pb-16">
          <div className="flex gap-8 items-start">

            {/* ── Colonne gauche ── */}
            <div className="flex-1 min-w-0">

              {/* Avatar + infos */}
              <div className="flex items-start gap-5 mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-md shrink-0 -mt-10 relative z-10 overflow-hidden bg-[#D4E6C3] flex items-center justify-center">
                  {gardien.avatar_url
                    ? <img src={gardien.avatar_url} alt={gardien.nom} className="w-full h-full object-cover" />
                    : <span className="text-2xl font-black text-[#3A5220]">{((gardien.prenom?.[0] ?? '') + (gardien.nom?.[0] ?? '')).toUpperCase()}</span>}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {gardien.prenom} {gardien.nom}
                      </h1>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {badges.map(b => <Badge key={b.label} label={b.label} color={b.color} />)}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Stars note={noteRounded} />
                        <span className="text-sm font-bold text-gray-700">{noteRounded || '—'}</span>
                        <span className="text-sm text-gray-400">({nbAvis} avis)</span>
                        {gardien.ville && <>
                          <span className="text-gray-300">·</span>
                          <span className="text-sm text-gray-500">{gardien.ville}</span>
                        </>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                      <button type="button" onClick={() => setFavori(f => !f)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all"
                        style={{ borderColor: favori ? '#D91B5C' : '#D1D5DB', color: favori ? '#D91B5C' : '#6B7280' }}>
                        {favori ? '♥' : '♡'} Favoris
                      </button>
                      <Link to={`/gardiens/${id}/reserver`}
                        className="px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 transition"
                        style={{ backgroundColor: '#3A5220' }}>
                        Demander une garde
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* À propos */}
              {gardien.description_gardien && (
                <div className="mb-6">
                  <h2 className="text-base font-black text-gray-900 mb-2">À propos</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{gardien.description_gardien}</p>
                </div>
              )}

              {/* Animaux acceptés */}
              {animauxAcceptes.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-base font-black text-gray-900 mb-3">Animaux acceptés</h2>
                  <div className="flex flex-wrap gap-2">
                    {animauxAcceptes.map(a => (
                      <span key={a} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: '#D4E6C3', color: '#3A5220' }}>
                        {ESPECE_EMOJI[a] ?? '🐾'} {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Logement */}
              {logementTags.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-base font-black text-gray-900 mb-3">Mon logement</h2>
                  <div className="flex flex-wrap gap-2">
                    {logementTags.map(l => <Tag key={l} label={l} />)}
                  </div>
                </div>
              )}

              {/* Avis */}
              <div>
                <h2 className="text-base font-black text-gray-900 mb-4">Avis ({reviews.length})</h2>
                {reviews.length === 0 && (
                  <div className="bg-white rounded-2xl p-8 text-center">
                    <p className="text-gray-400 text-sm">Aucun avis pour l'instant</p>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  {reviews.map(rv => (
                    <div key={rv.id} className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#D4E6C3] flex items-center justify-center text-xs font-black text-[#3A5220] shrink-0">
                          ?
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">Propriétaire</p>
                          <p className="text-xs text-gray-400">
                            {new Date(rv.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <Stars note={rv.note} />
                      {rv.commentaire && (
                        <p className="text-sm text-gray-600 leading-relaxed mt-2">{rv.commentaire}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Sidebar droite ── */}
            <div className="w-72 shrink-0 sticky top-6 flex flex-col gap-4">

              <CalendarReadOnly disponibles={dispos} />

              <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-3">
                <p className="text-sm font-black text-gray-800">Demander une garde</p>
                <Link to={`/gardiens/${id}/reserver`}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition text-center"
                  style={{ backgroundColor: '#3A5220' }}>
                  Envoyer une demande
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
