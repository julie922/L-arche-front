import { Link } from 'react-router-dom'
import Header from '../components/Header'

// ─── Mock données ─────────────────────────────────────────────────────────────
const MOCK_USER_NOM = 'Camille'

const MOCK_GARDE_EN_COURS = {
  animal:     'Luna',
  gardien:    { id: 'jules-martin', nom: 'Jules Martin', note: 4.9, verifie: true, avatar: null, derniereMaj: '14:32' },
  dateDebut:  '2025-03-10',
  dateFin:    '2025-03-17',
  jourActuel: 3,
  jourTotal:  7,
}

const MOCK_ANIMAUX = [
  { id: 1, nom: 'Luna',  race: 'Border Collie', age: '3 ans', emoji: '🐕' },
  { id: 2, nom: 'Minou', race: 'Chat',          age: '5 ans', emoji: '🐈' },
]

const MOCK_FAVORIS = [
  { id: 'jules-martin', nom: 'Jules M.', note: 4.9, ville: 'Lyon 3e', verifie: true, avatar: null },
  { id: 'marie-t',      nom: 'Marie T.', note: 4.8, ville: 'Lyon 6e', verifie: true, avatar: null },
]

const MOCK_HISTORIQUE = [
  { id: 1, animal: 'Luna',  gardien: 'Jules M.', dates: '10–17 mars', statut: 'en_cours' as const, note: null },
  { id: 2, animal: 'Minou', gardien: 'Marie T.', dates: 'Fév 2025',   statut: 'termine'  as const, note: 4 },
  { id: 3, animal: 'Luna',  gardien: 'Marie T.', dates: 'Jan 2025',   statut: 'termine'  as const, note: 4 },
  { id: 4, animal: 'Luna',  gardien: 'Jules M.', dates: 'Déc 2024',   statut: 'termine'  as const, note: 5 },
]

// ─── Composants utilitaires ───────────────────────────────────────────────────
function Stars({ note, max = 5 }: { note: number; max?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className="text-xs" style={{ color: i < note ? '#F59E0B' : '#D1D5DB' }}>★</span>
      ))}
    </span>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function DashboardProprioPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>

      {/* Navbar */}
      <Header isConnected />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">

        {/* En-tête */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Bonjour {MOCK_USER_NOM}
            </h1>
            {MOCK_GARDE_EN_COURS && (
              <p className="text-sm mt-1" style={{ color: '#3A5220' }}>
                {MOCK_GARDE_EN_COURS.animal} est en bonne compagnie chez {MOCK_GARDE_EN_COURS.gardien.nom.split(' ')[0]}
              </p>
            )}
          </div>
          <Link to="/gardiens"
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition shrink-0"
            style={{ backgroundColor: '#3A5220' }}>
            Trouver un gardien
          </Link>
        </div>

        {/* Garde en cours */}
        {MOCK_GARDE_EN_COURS && (
          <div className="rounded-2xl px-6 py-5 mb-8 flex items-center justify-between gap-6"
            style={{ backgroundColor: '#3A5220' }}>
            <div>
              <p className="text-xs font-black tracking-widest mb-1" style={{ color: '#A8C539' }}>GARDE EN COURS</p>
              <h2 className="text-xl font-black text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Garde en cours — {MOCK_GARDE_EN_COURS.animal}
              </h2>
              <p className="text-sm text-white/70 mb-4">
                Chez {MOCK_GARDE_EN_COURS.gardien.nom} · Jour {MOCK_GARDE_EN_COURS.jourActuel} sur {MOCK_GARDE_EN_COURS.jourTotal}
              </p>
              <div className="flex gap-3">
                <button type="button"
                  className="px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition"
                  style={{ backgroundColor: '#A8C539', color: '#1A2E0A' }}>
                  Voir le journal
                </button>
                <button type="button"
                  className="px-4 py-2 rounded-xl text-sm font-bold border-2 border-white/40 text-white hover:bg-white/10 transition">
                  Envoyer un message
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-14 h-14 rounded-full bg-gray-300 border-2 border-white/30" />
              <div className="text-right">
                <p className="text-sm font-black text-white">{MOCK_GARDE_EN_COURS.gardien.nom}</p>
                <p className="text-xs text-white/70">
                  Vérifié ★ {MOCK_GARDE_EN_COURS.gardien.note}
                </p>
                <p className="text-xs text-white/50">
                  Dernière mise à jour : {MOCK_GARDE_EN_COURS.gardien.derniereMaj}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Deux colonnes */}
        <div className="grid grid-cols-2 gap-8">

          {/* ── Colonne gauche ───────────────────────────────── */}
          <div className="flex flex-col gap-8">

            {/* Mes animaux */}
            <div>
              <h2 className="text-base font-black text-gray-900 mb-4">Mes animaux</h2>
              <div className="grid grid-cols-3 gap-3">
                {MOCK_ANIMAUX.map(a => (
                  <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-[#D4E6C3] flex items-center justify-center text-2xl">
                      {a.emoji}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-gray-900">{a.nom}</p>
                      <p className="text-xs text-gray-400">{a.race} · {a.age}</p>
                    </div>
                    <Link to="/profil?tab=animaux"
                      className="w-full text-center py-1.5 rounded-lg text-xs font-bold border-2 hover:bg-pink-50 transition"
                      style={{ borderColor: '#D91B5C', color: '#D91B5C' }}>
                      Modifier
                    </Link>
                  </div>
                ))}

                {/* Bouton ajouter */}
                <Link to="/profil?tab=animaux"
                  className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-3 flex flex-col items-center justify-center gap-1 hover:border-gray-300 transition">
                  <span className="text-2xl text-gray-300">+</span>
                  <span className="text-xs font-bold text-gray-400">Ajouter</span>
                </Link>
              </div>
            </div>

            {/* Mes favoris */}
            <div>
              <h2 className="text-base font-black text-gray-900 mb-4">Mes favoris</h2>
              <div className="flex flex-col gap-2">
                {MOCK_FAVORIS.map(g => (
                  <div key={g.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-black text-gray-900">{g.nom}</p>
                        <span className="text-xs font-bold" style={{ color: '#F59E0B' }}>★</span>
                        <span className="text-xs text-gray-600">{g.note}</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {g.ville}{g.verifie ? ' · Vérifié' : ''}
                      </p>
                    </div>
                    <Link to={`/gardiens/${g.id}`}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold border-2 hover:bg-pink-50 transition shrink-0"
                      style={{ borderColor: '#D91B5C', color: '#D91B5C' }}>
                      Contacter
                    </Link>
                  </div>
                ))}
                {MOCK_FAVORIS.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">Aucun gardien en favori</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Colonne droite — Historique ───────────────────── */}
          <div>
            <h2 className="text-base font-black text-gray-900 mb-4">Historique des gardes</h2>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Animal', 'Gardien', 'Dates', 'Avis'].map(col => (
                      <th key={col} className="text-left px-4 py-3 text-xs font-black tracking-widest text-gray-400 uppercase">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_HISTORIQUE.map(h => (
                    <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-800">{h.animal}</td>
                      <td className="px-4 py-3 text-gray-600">{h.gardien}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{h.dates}</td>
                      <td className="px-4 py-3">
                        {h.statut === 'en_cours' ? (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full border"
                            style={{ borderColor: '#3A5220', color: '#3A5220' }}>
                            En cours
                          </span>
                        ) : (
                          <Stars note={h.note ?? 0} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
