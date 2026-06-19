import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

interface Demande {
  id: string
  proprietaire_id: string
  gardien_id: string
  animal_id: string
  date_debut: string
  date_fin: string
  statut: 'en_attente' | 'confirmee' | 'refusee' | 'terminee' | 'annulee'
  instructions: string | null
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function nbNuits(debut: string, fin: string) {
  return Math.ceil((new Date(fin).getTime() - new Date(debut).getTime()) / 86400000)
}

const MONTH_NAMES = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAY_LABELS  = ['L','M','M','J','V','S','D']

function CalendarDashboard({ gardes }: { gardes: Set<string> }) {
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
        <span className="text-sm font-bold text-gray-800">{MONTH_NAMES[month]} {year}</span>
        <div className="flex gap-1">
          <button type="button" onClick={prev} className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 text-xs">&#8249;</button>
          <button type="button" onClick={next} className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 text-xs">&#8250;</button>
        </div>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d,i) => <div key={i} className="text-center text-xs font-bold text-gray-300 py-0.5">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: offset }).map((_,i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_,i) => {
          const day = i + 1
          const key = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
          const isGarde = gardes.has(key)
          return (
            <div key={key}
              className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium ${isGarde ? 'text-white' : 'text-gray-400'}`}
              style={{ backgroundColor: isGarde ? '#3A5220' : 'transparent' }}>
              {day}
            </div>
          )
        })}
      </div>
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#3A5220' }} /><span className="text-xs text-gray-500">Garde</span></div>
      </div>
    </div>
  )
}

function CarteDemandeAttente({ d, onAccepter, onRefuser, loading }: {
  d: Demande; onAccepter: (id: string) => void; onRefuser: (id: string) => void; loading: boolean
}) {
  const nuits = nbNuits(d.date_debut, d.date_fin)
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-[#D4E6C3] flex items-center justify-center text-lg shrink-0">🐾</div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-gray-900 text-sm mb-1">Demande #{d.id.slice(0, 8)}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
          <span>📅 {formatDate(d.date_debut).replace(/ \d{4}/, '')} – {formatDate(d.date_fin)}</span>
          <span>🌙 {nuits} nuit{nuits > 1 ? 's' : ''}</span>
        </div>
        {d.instructions && <p className="text-xs text-gray-400 mb-3 italic">"{d.instructions}"</p>}
        <div className="flex gap-2">
          <button type="button" onClick={() => onAccepter(d.id)} disabled={loading}
            className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold text-white hover:opacity-90 transition disabled:opacity-50"
            style={{ backgroundColor: '#D91B5C' }}>
            Accepter
          </button>
          <button type="button" onClick={() => onRefuser(d.id)} disabled={loading}
            className="px-4 py-1.5 rounded-lg text-xs font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">
            Refuser
          </button>
        </div>
      </div>
    </div>
  )
}

function CarteConfirmee({ d }: { d: Demande }) {
  const nuits = nbNuits(d.date_debut, d.date_fin)
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-[#D4E6C3] flex items-center justify-center text-lg shrink-0">🐾</div>
      <div className="flex-1">
        <p className="font-black text-gray-900 text-sm mb-1">Garde #{d.id.slice(0, 8)}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-2">
          <span>📅 {formatDate(d.date_debut).replace(/ \d{4}/, '')} – {formatDate(d.date_fin)}</span>
          <span>🌙 {nuits} nuit{nuits > 1 ? 's' : ''}</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#D4E6C3', color: '#3A5220' }}>
            Confirmée
          </span>
          <Link to={`/garde/${d.id}/journal`}
            className="text-xs font-bold px-3 py-1 rounded-full border-2 hover:bg-gray-50 transition border-gray-200 text-gray-600">
            Journal
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function DashboardGardienPage() {
  const { user } = useAuth()
  const [tab, setTab]             = useState<'demandes' | 'confirmees' | 'historique'>('demandes')
  const [demandes, setDemandes]   = useState<Demande[]>([])
  const [loading, setLoading]     = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await api.get<{ data: Demande[]; total: number }>('/reservations?role=gardien')
        setDemandes(res.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const enAttente  = demandes.filter(d => d.statut === 'en_attente')
  const confirmees = demandes.filter(d => d.statut === 'confirmee')
  const historique = demandes.filter(d => ['terminee','refusee','annulee'].includes(d.statut))

  const gardesDates = new Set<string>()
  confirmees.forEach(d => {
    const debut = new Date(d.date_debut)
    const fin   = new Date(d.date_fin)
    for (const dt = new Date(debut); dt <= fin; dt.setDate(dt.getDate() + 1)) {
      gardesDates.add(dt.toISOString().split('T')[0])
    }
  })

  const accepter = async (id: string) => {
    setActionLoading(true)
    try {
      await api.patch(`/reservations/${id}/confirm`, {})
      setDemandes(prev => prev.map(d => d.id === id ? { ...d, statut: 'confirmee' } : d))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setActionLoading(false)
    }
  }

  const refuser = async (id: string) => {
    setActionLoading(true)
    try {
      await api.patch(`/reservations/${id}/cancel`, {})
      setDemandes(prev => prev.map(d => d.id === id ? { ...d, statut: 'annulee' } : d))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>

      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">

        {user && !user.identite_verifiee && (
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl mb-6 text-sm"
            style={{ backgroundColor: '#E8F0DC', border: '1px solid #C8D5B0' }}>
            <span>ℹ️</span>
            <span className="text-gray-700">Votre vérification d'identité est en attente.</span>
            <Link to="/profil?tab=verification" className="font-bold hover:underline ml-1" style={{ color: '#D91B5C' }}>
              Vérifier →
            </Link>
          </div>
        )}

        {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="flex gap-8 items-start">

          <div className="flex-1 min-w-0">

            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Bonjour {user?.prenom || user?.nom || ''}
                </h1>
                {!loading && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-black" style={{ color: '#D91B5C' }}>{enAttente.length} demande{enAttente.length !== 1 ? 's' : ''} en attente</span>
                    {' · '}
                    <span className="font-black text-gray-800">{confirmees.length} garde{confirmees.length !== 1 ? 's' : ''} confirmée{confirmees.length !== 1 ? 's' : ''}</span>
                  </p>
                )}
              </div>
              <Link to="/profil?tab=gardien"
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition shrink-0"
                style={{ backgroundColor: '#3A5220' }}>
                Mes disponibilités
              </Link>
            </div>

            <div className="flex gap-0 border-b border-gray-200 mb-5">
              {[
                { key: 'demandes',   label: 'Demandes',   count: enAttente.length },
                { key: 'confirmees', label: 'Confirmées', count: confirmees.length },
                { key: 'historique', label: 'Historique', count: null },
              ].map(t => (
                <button key={t.key} type="button"
                  onClick={() => setTab(t.key as typeof tab)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold border-b-2 -mb-px transition-colors ${
                    tab === t.key ? 'border-[#D91B5C] text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}>
                  {t.label}
                  {t.count !== null && t.count > 0 && (
                    <span className="text-xs font-black text-white px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: tab === t.key ? '#D91B5C' : '#9CA3AF' }}>
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {loading && <div className="text-center py-10 text-gray-400 text-sm">Chargement...</div>}

            {!loading && tab === 'demandes' && (
              <div className="flex flex-col gap-3">
                {enAttente.length === 0
                  ? <div className="bg-white rounded-2xl p-10 text-center"><p className="text-3xl mb-2">📭</p><p className="font-bold text-gray-700">Aucune demande en attente</p></div>
                  : enAttente.map(d => <CarteDemandeAttente key={d.id} d={d} onAccepter={accepter} onRefuser={refuser} loading={actionLoading} />)}
              </div>
            )}

            {!loading && tab === 'confirmees' && (
              <div className="flex flex-col gap-3">
                {confirmees.length === 0
                  ? <div className="bg-white rounded-2xl p-10 text-center"><p className="text-3xl mb-2">📅</p><p className="font-bold text-gray-700">Aucune garde confirmée</p></div>
                  : confirmees.map(d => <CarteConfirmee key={d.id} d={d} />)}
              </div>
            )}

            {!loading && tab === 'historique' && (
              <div className="flex flex-col gap-3">
                {historique.length === 0
                  ? <div className="bg-white rounded-2xl p-10 text-center"><p className="text-3xl mb-2">📖</p><p className="font-bold text-gray-700">Aucun historique</p></div>
                  : historique.map(d => (
                    <div key={d.id} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4 opacity-70">
                      <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                      <div className="flex-1">
                        <p className="font-black text-gray-700 text-sm">Garde #{d.id.slice(0, 8)}</p>
                        <p className="text-xs text-gray-400">{formatDate(d.date_debut)} → {formatDate(d.date_fin)}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        d.statut === 'terminee' ? 'bg-gray-100 text-gray-500'
                        : d.statut === 'annulee' ? 'bg-orange-50 text-orange-400'
                        : 'bg-red-50 text-red-400'
                      }`}>
                        {d.statut === 'terminee' ? 'Terminée' : d.statut === 'annulee' ? 'Annulée' : 'Refusée'}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="w-64 shrink-0 sticky top-6">
            <CalendarDashboard gardes={gardesDates} />
          </div>
        </div>
      </main>
    </div>
  )
}
