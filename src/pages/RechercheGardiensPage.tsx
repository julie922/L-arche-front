import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { api } from '../services/api'

interface Gardien {
  id: string
  nom: string
  prenom: string | null
  ville: string | null
  avatar_url: string | null
  note_moyenne: number | null
  nb_avis: number | null
  profil_gardien_verifie: boolean
  animaux_acceptes: string[] | null
  distance_km?: number
}

const ESPECES = ['Chien', 'Chat', 'Lapin', 'Rongeur', 'Reptile', 'Oiseau']
const DISTANCES = [5, 20, 50]
const NOTES_MIN = [3, 4, 4.5]

const ESPECE_EMOJI: Record<string, string> = {
  Chien: '🐕', Chat: '🐈', Lapin: '🐇', Oiseau: '🐦', Rongeur: '🐹',
  Reptile: '🦎', Poisson: '🐟', Autre: '🐾',
}

function Stars({ note }: { note: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className="text-xs" style={{ color: i <= Math.round(note) ? '#F59E0B' : '#D1D5DB' }}>&#9733;</span>
      ))}
    </span>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className="relative w-10 h-5 rounded-full transition-colors shrink-0"
      style={{ backgroundColor: checked ? '#3A5220' : '#D1D5DB' }}>
      <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
        style={{ left: checked ? 'calc(100% - 18px)' : '2px' }} />
    </button>
  )
}

export default function RechercheGardiensPage() {
  const [localisation, setLocalisation] = useState('')
  const [distance,     setDistance]     = useState(20)
  const [dateDebut,    setDateDebut]     = useState('')
  const [dateFin,      setDateFin]       = useState('')
  const [espece,       setEspece]        = useState('')
  const [noteMin,      setNoteMin]       = useState(0)
  const [verifieOnly,  setVerifieOnly]   = useState(false)
  const [vue,          setVue]           = useState<'liste' | 'carte' | 'pertinence'>('liste')

  const [gardiens, setGardiens] = useState<Gardien[]>([])
  const [loading,  setLoading]  = useState(false)
  const [total,    setTotal]    = useState(0)
  const [error,    setError]    = useState('')

  const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent"

  const search = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ limit: '30', offset: '0' })
      if (espece) params.set('espece', espece.toLowerCase())
      if (noteMin > 0) params.set('note_min', String(noteMin))
      if (verifieOnly) params.set('verifie', 'true')
      const res = await api.get<{ data: Gardien[]; total: number }>(`/users/gardiens?${params}`)
      setGardiens(res.data || [])
      setTotal(res.total || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche')
    } finally {
      setLoading(false)
    }
  }, [espece, noteMin, verifieOnly])

  useEffect(() => { search() }, [search])

  const reset = () => {
    setNoteMin(0); setVerifieOnly(false); setDistance(20); setEspece('')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Header />

      <div className="flex flex-1" style={{ backgroundColor: '#F0EBE1' }}>

        {/* ── Sidebar filtres ───────────────────────────────────── */}
        <aside className="w-64 shrink-0 bg-white border-r border-gray-100 px-5 py-6 flex flex-col gap-6">
          <h2 className="text-base font-black text-gray-900">Filtres</h2>

          {/* Localisation */}
          <div>
            <p className="text-xs font-black tracking-widest text-gray-400 mb-2">LOCALISATION</p>
            <input type="text" value={localisation} onChange={e => setLocalisation(e.target.value)}
              className={inputCls} placeholder="Ville, code postal" />
            <div className="flex justify-between mt-3 mb-1">
              {DISTANCES.map(d => (
                <button key={d} type="button" onClick={() => setDistance(d)}
                  className={`text-xs font-bold px-2 py-1 rounded-full transition-all ${distance === d ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                  style={distance === d ? { backgroundColor: '#3A5220' } : {}}>
                  {d} km
                </button>
              ))}
            </div>
            <input type="range" min={5} max={50} step={5} value={distance}
              onChange={e => setDistance(Number(e.target.value))}
              className="w-full accent-[#3A5220]" />
          </div>

          {/* Dates */}
          <div>
            <p className="text-xs font-black tracking-widest text-gray-400 mb-2">DATES</p>
            <div className="flex flex-col gap-2">
              <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} className={inputCls} />
              <input type="date" value={dateFin}   onChange={e => setDateFin(e.target.value)}   className={inputCls} />
            </div>
          </div>

          {/* Espèce */}
          <div>
            <p className="text-xs font-black tracking-widest text-gray-400 mb-2">ESPÈCE</p>
            <select value={espece} onChange={e => setEspece(e.target.value)} className={inputCls + ' bg-white'}>
              <option value="">Toutes les espèces</option>
              {ESPECES.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          {/* Note minimum */}
          <div>
            <p className="text-xs font-black tracking-widest text-gray-400 mb-2">NOTE MINIMUM</p>
            <div className="flex gap-2">
              {NOTES_MIN.map(n => (
                <button key={n} type="button" onClick={() => setNoteMin(n)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all"
                  style={{
                    backgroundColor: noteMin === n ? '#E8F0DC' : 'white',
                    borderColor:     noteMin === n ? '#3A5220' : '#E5E7EB',
                    color:           noteMin === n ? '#3A5220' : '#6B7280',
                  }}>
                  <span style={{ color: '#F59E0B' }}>&#9733;</span>{n}+
                </button>
              ))}
            </div>
          </div>

          {/* Badge vérifié */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Badge vérifié uniquement</span>
            <Toggle checked={verifieOnly} onChange={() => setVerifieOnly(v => !v)} />
          </div>

          {/* Boutons */}
          <div className="flex flex-col gap-2 mt-auto">
            <button type="button" onClick={search} disabled={loading}
              className="w-full py-2.5 rounded-xl font-bold text-white text-sm hover:opacity-90 transition disabled:opacity-50"
              style={{ backgroundColor: '#3A5220' }}>
              {loading ? 'Recherche...' : 'Appliquer'}
            </button>
            <button type="button" onClick={reset}
              className="text-sm text-gray-400 hover:text-gray-600 transition text-center">
              Réinitialiser
            </button>
          </div>
        </aside>

        {/* ── Résultats ─────────────────────────────────────────── */}
        <main className="flex-1 px-6 py-6">

          {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

          {/* En-tête résultats */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-700">
              <span className="font-black">{loading ? '...' : total} gardien{total !== 1 ? 's' : ''}</span> trouvé{total !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
              {(['liste','carte','pertinence'] as const).map(v => (
                <button key={v} type="button" onClick={() => setVue(v)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
                  style={{
                    backgroundColor: vue === v ? '#3A5220' : 'transparent',
                    color:           vue === v ? 'white'   : '#6B7280',
                  }}>
                  {v === 'liste' ? 'Liste' : v === 'carte' ? 'Carte' : 'Pertinence'}
                </button>
              ))}
            </div>
          </div>

          {/* Grille */}
          {vue === 'liste' && (
            <>
              {loading && <div className="text-center py-20 text-gray-400">Chargement...</div>}
              {!loading && gardiens.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="font-bold text-gray-700 mb-1">Aucun gardien trouvé</p>
                  <p className="text-sm text-gray-400">Essayez d'élargir vos critères de recherche</p>
                </div>
              )}
              {!loading && gardiens.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {gardiens.map(g => (
                    <Link key={g.id} to={`/gardiens/${g.id}`}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                      <div className="relative h-36 bg-gray-200">
                        {g.avatar_url ? (
                          <img src={g.avatar_url} alt={g.nom} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-[#D4E6C3] flex items-center justify-center text-2xl font-black text-[#3A5220]">
                              {(g.prenom?.[0] ?? g.nom?.[0] ?? '?').toUpperCase()}
                            </div>
                          </div>
                        )}
                        {g.profil_gardien_verifie && (
                          <span className="absolute bottom-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: '#D4E6C3', color: '#3A5220' }}>
                            Vérifié
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-black text-gray-900 text-sm mb-0.5">
                          {g.prenom ? `${g.prenom} ${g.nom[0]}.` : g.nom}
                        </p>
                        {g.ville && (
                          <div className="flex items-center gap-1 mb-1.5">
                            <span className="text-xs" style={{ color: '#D91B5C' }}>📍</span>
                            <span className="text-xs text-gray-500">
                              {g.ville}{g.distance_km ? ` · ${g.distance_km} km` : ''}
                            </span>
                          </div>
                        )}
                        {g.note_moyenne != null && (
                          <div className="flex items-center justify-between mb-1.5">
                            <Stars note={g.note_moyenne} />
                            <span className="text-xs text-gray-400">{g.nb_avis ?? 0} avis</span>
                          </div>
                        )}
                        {g.animaux_acceptes && g.animaux_acceptes.length > 0 && (
                          <div className="flex gap-0.5 mb-1.5">
                            {g.animaux_acceptes.slice(0, 4).map((a, i) => (
                              <span key={i} className="text-sm">{ESPECE_EMOJI[a] ?? '🐾'}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {vue === 'carte' && (
            <div className="bg-white rounded-2xl h-96 flex items-center justify-center border border-gray-200">
              <p className="text-gray-400 text-sm">— Vue carte à implémenter —</p>
            </div>
          )}

          {vue === 'pertinence' && (
            <div className="bg-white rounded-2xl h-96 flex items-center justify-center border border-gray-200">
              <p className="text-gray-400 text-sm">— Tri par pertinence —</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
