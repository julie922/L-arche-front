import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'

// ─── Données mock (remplacées par API plus tard) ──────────────────────────────
const MOCK_GARDIEN = {
  id: 'jules-martin',
  nom: 'Jules Martin',
  profilVerifie: true,
  niveauExperience: 'experimente' as 'debutant' | 'intermediaire' | 'experimente',
  soinsSpeciaux: true,
  ville: 'Lyon 3e',
  distance: '1.2 km',
  bio: "Passionné par les animaux depuis l'enfance, j'ai grandi avec des chiens et des chats. J'ai gardé plus d'une vingtaine d'animaux ces trois dernières années. Votre compagnon sera traité comme le mien — avec beaucoup d'amour et d'attention au quotidien.",
  langues: ['Français', 'Anglais'],
  animaux: ['Chiens', 'Chats', 'Lapins'],
  logement: ['Maison', 'Jardin clos', 'Sans autres animaux'],
  logementIcons: ['🏠', '🛏️', '🌿'],
  disponibles: new Set([
    '2025-03-01','2025-03-02','2025-03-06','2025-03-07',
    '2025-03-08','2025-03-09','2025-03-10','2025-03-11',
    '2025-03-17','2025-03-18','2025-03-19','2025-03-20','2025-03-21',
  ]),
  reponseDélai: '1 heure',
  avis: [
    { id: 1, auteur: 'Camille R.', date: 'Janvier 2025',   animal: 'Luna (Border Collie)', note: 5, texte: "Jules est exceptionnel ! Luna était ravie et le journal quotidien avec photos nous a permis de partir l'esprit tranquille. On recommande sans hésiter." },
    { id: 2, auteur: 'Marc L.',    date: 'Novembre 2024',  animal: 'Milo (Labrador)',      note: 5, texte: "Très professionnel, à l'écoute et vraiment passionné. Milo a adoré son séjour. Merci Jules !" },
    { id: 3, auteur: 'Sophie D.',  date: 'Octobre 2024',   animal: 'Noisette (Chat)',      note: 4, texte: "Très bon gardien, Noisette était bien soignée. Bonne communication tout au long de la garde." },
  ],
}

// Calculs dérivés — tout se met à jour automatiquement si les avis changent
function computeStats(avis: typeof MOCK_GARDIEN.avis) {
  const nbAvis = avis.length
  const note   = nbAvis > 0
    ? Math.round((avis.reduce((s, a) => s + a.note, 0) / nbAvis) * 10) / 10
    : 0
  const repartition = [5,4,3,2,1].map(n => ({
    note: n,
    count: avis.filter(a => a.note === n).length,
    pct: nbAvis > 0 ? Math.round((avis.filter(a => a.note === n).length / nbAvis) * 100) : 0,
  }))
  return { nbAvis, note, repartition }
}

// Badges calculés depuis les données du gardien
function computeBadges(g: typeof MOCK_GARDIEN) {
  const badges: { label: string; color: 'green' | 'pink' }[] = []
  if (g.profilVerifie)
    badges.push({ label: 'Profil vérifié', color: 'green' })
  if (g.niveauExperience === 'experimente')
    badges.push({ label: 'Gardien expérimenté', color: 'green' })
  else if (g.niveauExperience === 'intermediaire')
    badges.push({ label: 'Gardien intermédiaire', color: 'green' })
  if (g.soinsSpeciaux)
    badges.push({ label: 'Soins spéciaux', color: 'pink' })
  return badges
}

// ─── Composants utilitaires ───────────────────────────────────────────────────
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

// ─── Calendrier lecture seule ─────────────────────────────────────────────────
const MONTH_NAMES = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAY_LABELS  = ['L','M','M','J','V','S','D']

function CalendarReadOnly({ disponibles }: { disponibles: Set<string> }) {
  const [month, setMonth] = useState(2) // Mars
  const [year,  setYear]  = useState(2025)

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y-1) } else setMonth(m => m-1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y+1) } else setMonth(m => m+1) }

  const firstDay    = new Date(year, month, 1).getDay()
  const offset      = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-3">
        <button type="button" onClick={prevMonth} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-sm">‹</button>
        <span className="text-sm font-bold text-gray-800">Disponibilités — {MONTH_NAMES[month]} {year}</span>
        <button type="button" onClick={nextMonth} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-sm">›</button>
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

// ─── Page principale ──────────────────────────────────────────────────────────
export default function GardienProfilPage() {
  const { id } = useParams<{ id: string }>()
  const gardien = MOCK_GARDIEN // TODO: fetch par id

  const { note, nbAvis } = computeStats(gardien.avis)
  const badges = computeBadges(gardien)

  const [favori, setFavori] = useState(false)

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>

      <Header />

      {/* Hero vert avec lien retour */}
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

            {/* ── Colonne gauche ───────────────────────────────── */}
            <div className="flex-1 min-w-0">

              {/* Avatar + infos */}
              <div className="flex items-start gap-5 mb-6">
                <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-white shadow-md shrink-0 -mt-10 relative z-10" />
                <div className="flex-1 pt-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {gardien.nom}
                      </h1>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {badges.map(b => <Badge key={b.label} label={b.label} color={b.color} />)}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Stars note={note} />
                        <span className="text-sm font-bold text-gray-700">{note}</span>
                        <span className="text-sm text-gray-400">({nbAvis} avis)</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-sm text-gray-500">{gardien.ville}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-sm text-gray-500">{gardien.distance}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                      <button type="button" onClick={() => setFavori(f => !f)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all"
                        style={{ borderColor: favori ? '#D91B5C' : '#D1D5DB', color: favori ? '#D91B5C' : '#6B7280' }}>
                        {favori ? '♥' : '♡'} Favoris
                      </button>
                      <button type="button"
                        className="px-4 py-2 rounded-xl border-2 border-gray-300 text-sm font-bold text-gray-700 hover:border-gray-400 transition">
                        Contacter
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
              <div className="mb-6">
                <h2 className="text-base font-black text-gray-900 mb-2">À propos</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{gardien.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {gardien.langues.map(l => <Tag key={l} label={l} />)}
                  {gardien.animaux.map(a => (
                    <span key={a} className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: '#D4E6C3', color: '#3A5220' }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mon logement */}
              <div className="mb-8">
                <h2 className="text-base font-black text-gray-900 mb-3">Mon logement</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {gardien.logement.map(l => <Tag key={l} label={l} />)}
                </div>
                <div className="flex gap-6">
                  {gardien.logementIcons.map((icon, i) => (
                    <div key={i} className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-2xl shadow-sm">
                      {icon}
                    </div>
                  ))}
                </div>
              </div>

              {/* Avis */}
              <div>
                <h2 className="text-base font-black text-gray-900 mb-4">Avis ({nbAvis})</h2>
                <div className="flex flex-col gap-3">
                  {gardien.avis.map(avis => (
                    <div key={avis.id} className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#D4E6C3] flex items-center justify-center text-xs font-black text-[#3A5220] shrink-0">
                          {avis.auteur[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{avis.auteur}</p>
                          <p className="text-xs text-gray-400">{avis.date} · {avis.animal}</p>
                        </div>
                      </div>
                      <Stars note={avis.note} />
                      <p className="text-sm text-gray-600 leading-relaxed mt-2">{avis.texte}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Sidebar droite (sticky) ───────────────────────── */}
            <div className="w-72 shrink-0 sticky top-6 flex flex-col gap-4">

              <CalendarReadOnly disponibles={gardien.disponibles} />

              <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-3">
                <p className="text-sm font-black text-gray-800">Demander une garde</p>
                <Link to={`/gardiens/${id}/reserver`}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition text-center"
                  style={{ backgroundColor: '#3A5220' }}>
                  Envoyer une demande
                </Link>
                <button type="button"
                  className="w-full py-3 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition">
                  Envoyer un message
                </button>
                <p className="text-xs text-gray-400 text-center">
                  Répond généralement sous <span className="font-bold text-gray-600">{gardien.reponseDélai}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
