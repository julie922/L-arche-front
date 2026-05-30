import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Demande {
  id: number
  proprietaire: { nom: string; avatar: string | null }
  animal: { nom: string; race: string; avatar: string | null }
  dateDebut: string
  dateFin: string
  typeGarde: string
  statut: 'en_attente' | 'confirmee' | 'refusee' | 'terminee'
}

// ─── Mock données ─────────────────────────────────────────────────────────────
const MOCK_GARDIEN_NOM = 'Jules'

const MOCK_DEMANDES: Demande[] = [
  { id: 1, proprietaire: { nom: 'Camille R.', avatar: null }, animal: { nom: 'Luna',  race: 'Border Collie', avatar: null }, dateDebut: '2025-03-10', dateFin: '2025-03-17', typeGarde: 'Garde à domicile', statut: 'en_attente' },
  { id: 2, proprietaire: { nom: 'Marc L.',    avatar: null }, animal: { nom: 'Mimi',  race: 'Ragdoll',       avatar: null }, dateDebut: '2025-03-20', dateFin: '2025-03-25', typeGarde: 'Garde à domicile', statut: 'en_attente' },
  { id: 3, proprietaire: { nom: 'Sophie T.',  avatar: null }, animal: { nom: 'Rex',   race: 'Labrador',      avatar: null }, dateDebut: '2025-04-01', dateFin: '2025-04-05', typeGarde: 'Promenade',        statut: 'en_attente' },
  { id: 4, proprietaire: { nom: 'Paul D.',    avatar: null }, animal: { nom: 'Felix', race: 'Siamois',       avatar: null }, dateDebut: '2025-03-11', dateFin: '2025-03-14', typeGarde: 'Garde à domicile', statut: 'confirmee'  },
  { id: 5, proprietaire: { nom: 'Lucie M.',   avatar: null }, animal: { nom: 'Bella', race: 'Labrador',      avatar: null }, dateDebut: '2025-03-22', dateFin: '2025-03-26', typeGarde: 'Visite à domicile', statut: 'confirmee' },
  { id: 6, proprietaire: { nom: 'Thomas B.',  avatar: null }, animal: { nom: 'Max',   race: 'Golden',        avatar: null }, dateDebut: '2025-02-10', dateFin: '2025-02-15', typeGarde: 'Garde à domicile', statut: 'terminee'   },
]

// Jours avec une garde confirmée
const GARDES_DATES = new Set([
  '2025-03-11','2025-03-12','2025-03-13','2025-03-14',
  '2025-03-22','2025-03-23','2025-03-24','2025-03-25','2025-03-26',
])
const DISPOS_DATES = new Set([
  '2025-03-04','2025-03-05','2025-03-08','2025-03-09','2025-03-10',
  '2025-03-15','2025-03-16','2025-03-17','2025-03-18','2025-03-19',
])

// ─── Utilitaires ──────────────────────────────────────────────────────────────
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function nbNuits(debut: string, fin: string) {
  return Math.ceil((new Date(fin).getTime() - new Date(debut).getTime()) / 86400000)
}

function typeIcon(type: string) {
  if (type === 'Promenade') return '🐾'
  if (type === 'Visite à domicile') return '🚗'
  return '🏠'
}

// ─── Calendrier sidebar ───────────────────────────────────────────────────────
const MONTH_NAMES = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAY_LABELS  = ['L','M','M','J','V','S','D']

function CalendarDashboard({ gardes, dispos }: { gardes: Set<string>; dispos: Set<string> }) {
  const [month, setMonth] = useState(2)
  const [year,  setYear]  = useState(2025)
  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y-1) } else setMonth(m => m-1) }
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y+1) } else setMonth(m => m+1) }
  const firstDay    = new Date(year, month, 1).getDay()
  const offset      = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-bold text-gray-800">Disponibilités — {MONTH_NAMES[month]} {year}</span>
        <div className="flex gap-1">
          <button type="button" onClick={prev} className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 text-xs">‹</button>
          <button type="button" onClick={next} className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 text-xs">›</button>
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
          const isDispo = dispos.has(key)
          return (
            <div key={key}
              className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium ${
                isGarde ? 'text-white' : isDispo ? 'text-[#3A5220]' : 'text-gray-400'
              }`}
              style={{ backgroundColor: isGarde ? '#3A5220' : isDispo ? '#D4E6C3' : 'transparent' }}>
              {day}
            </div>
          )
        })}
      </div>
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#3A5220' }} /><span className="text-xs text-gray-500">Garde</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#D4E6C3' }} /><span className="text-xs text-gray-500">Disponible</span></div>
      </div>
    </div>
  )
}

// ─── Carte demande ────────────────────────────────────────────────────────────
function CarteDemandeAttente({ d, onAccepter, onRefuser }: {
  d: Demande; onAccepter: (id: number) => void; onRefuser: (id: number) => void
}) {
  const nuits = nbNuits(d.dateDebut, d.dateFin)
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-start gap-4">
      <div className="flex flex-col gap-1 shrink-0">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="w-10 h-10 rounded-full bg-[#D4E6C3] flex items-center justify-center text-lg">🐾</div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-gray-900 text-sm mb-1">
          {d.proprietaire.nom} — {d.animal.nom} ({d.animal.race})
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">📅 {formatDate(d.dateDebut).replace(/ \d{4}/, '')} – {formatDate(d.dateFin)}</span>
          <span className="flex items-center gap-1">{typeIcon(d.typeGarde)} {d.typeGarde} · {nuits} nuit{nuits > 1 ? 's' : ''}</span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => onAccepter(d.id)}
            className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold text-white hover:opacity-90 transition"
            style={{ backgroundColor: '#D91B5C' }}>
            ✓ Accepter
          </button>
          <button type="button" onClick={() => onRefuser(d.id)}
            className="px-4 py-1.5 rounded-lg text-xs font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition">
            Refuser
          </button>
          <Link to={`/demandes/${d.id}`}
            className="px-4 py-1.5 rounded-lg text-xs font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition">
            Voir les détails
          </Link>
        </div>
      </div>
    </div>
  )
}

function CarteConfirmee({ d }: { d: Demande }) {
  const nuits = nbNuits(d.dateDebut, d.dateFin)
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-start gap-4">
      <div className="flex flex-col gap-1 shrink-0">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="w-10 h-10 rounded-full bg-[#D4E6C3] flex items-center justify-center text-lg">🐾</div>
      </div>
      <div className="flex-1">
        <p className="font-black text-gray-900 text-sm mb-1">
          {d.proprietaire.nom} — {d.animal.nom} ({d.animal.race})
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-2">
          <span>📅 {formatDate(d.dateDebut).replace(/ \d{4}/, '')} – {formatDate(d.dateFin)}</span>
          <span>{typeIcon(d.typeGarde)} {d.typeGarde} · {nuits} nuit{nuits > 1 ? 's' : ''}</span>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#D4E6C3', color: '#3A5220' }}>
          ✓ Confirmée
        </span>
      </div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function DashboardGardienPage() {
  const [tab, setTab] = useState<'demandes' | 'confirmees' | 'historique'>('demandes')
  const [demandes, setDemandes] = useState<Demande[]>(MOCK_DEMANDES)

  const enAttente  = demandes.filter(d => d.statut === 'en_attente')
  const confirmees = demandes.filter(d => d.statut === 'confirmee')
  const historique = demandes.filter(d => d.statut === 'terminee' || d.statut === 'refusee')

  const accepter = (id: number) =>
    setDemandes(prev => prev.map(d => d.id === id ? { ...d, statut: 'confirmee' } : d))

  const refuser = (id: number) =>
    setDemandes(prev => prev.map(d => d.id === id ? { ...d, statut: 'refusee' } : d))

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>

      {/* Navbar connectée */}
      <Header isConnected />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">

        {/* Bannière vérification */}
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl mb-6 text-sm"
          style={{ backgroundColor: '#E8F0DC', border: '1px solid #C8D5B0' }}>
          <span style={{ color: '#3A5220' }}>ℹ️</span>
          <span className="text-gray-700">Votre vérification d'identité est en attente de traitement.</span>
          <Link to="/profil?tab=verification" className="font-bold hover:underline ml-1" style={{ color: '#D91B5C' }}>
            Vérifier le statut →
          </Link>
        </div>

        <div className="flex gap-8 items-start">

          {/* ── Colonne principale ────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* En-tête */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Bonjour {MOCK_GARDIEN_NOM}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Vous avez{' '}
                  <span className="font-black" style={{ color: '#D91B5C' }}>{enAttente.length} demande{enAttente.length > 1 ? 's' : ''} en attente</span>
                  {' '}et{' '}
                  <span className="font-black text-gray-800">{confirmees.length} garde{confirmees.length > 1 ? 's' : ''} confirmée{confirmees.length > 1 ? 's' : ''}</span>
                  {' '}ce mois
                </p>
              </div>
              <Link to="/profil?tab=gardien"
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition shrink-0"
                style={{ backgroundColor: '#3A5220' }}>
                Modifier mes disponibilités
              </Link>
            </div>

            {/* Onglets */}
            <div className="flex gap-0 border-b border-gray-200 mb-5">
              {[
                { key: 'demandes',   label: 'Demandes',  count: enAttente.length },
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

            {/* Contenu onglet Demandes */}
            {tab === 'demandes' && (
              <div className="flex flex-col gap-3">
                {enAttente.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center">
                    <p className="text-3xl mb-2">📭</p>
                    <p className="font-bold text-gray-700">Aucune demande en attente</p>
                  </div>
                ) : enAttente.map(d => (
                  <CarteDemandeAttente key={d.id} d={d} onAccepter={accepter} onRefuser={refuser} />
                ))}
              </div>
            )}

            {/* Contenu onglet Confirmées */}
            {tab === 'confirmees' && (
              <div className="flex flex-col gap-3">
                {confirmees.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center">
                    <p className="text-3xl mb-2">📅</p>
                    <p className="font-bold text-gray-700">Aucune garde confirmée</p>
                  </div>
                ) : confirmees.map(d => <CarteConfirmee key={d.id} d={d} />)}
              </div>
            )}

            {/* Contenu onglet Historique */}
            {tab === 'historique' && (
              <div className="flex flex-col gap-3">
                {historique.length === 0 ? (
                  <div className="bg-white rounded-2xl p-10 text-center">
                    <p className="text-3xl mb-2">📖</p>
                    <p className="font-bold text-gray-700">Aucun historique</p>
                  </div>
                ) : historique.map(d => (
                  <div key={d.id} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4 opacity-70">
                    <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex-1">
                      <p className="font-black text-gray-700 text-sm">{d.proprietaire.nom} — {d.animal.nom} ({d.animal.race})</p>
                      <p className="text-xs text-gray-400">{formatDate(d.dateDebut)} · {d.typeGarde}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      d.statut === 'terminee' ? 'bg-gray-100 text-gray-500' : 'bg-red-50 text-red-400'
                    }`}>
                      {d.statut === 'terminee' ? 'Terminée' : 'Refusée'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar calendrier ────────────────────────────── */}
          <div className="w-64 shrink-0 sticky top-6">
            <CalendarDashboard gardes={GARDES_DATES} dispos={DISPOS_DATES} />
          </div>
        </div>
      </main>
    </div>
  )
}
