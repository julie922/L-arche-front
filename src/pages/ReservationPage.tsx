import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { api } from '../services/api'

interface Animal {
  id: string
  nom: string
  espece: string
  race: string | null
  age: string | null
}

interface Gardien {
  id: string
  nom: string
  prenom: string
  ville: string | null
  note_moyenne: number | null
  nb_avis: number | null
  profil_gardien_verifie: boolean | null
}

const ESPECE_EMOJI: Record<string, string> = {
  Chien: '🐕', Chat: '🐈', Lapin: '🐇', Oiseau: '🐦',
  Rongeur: '🐹', Reptile: '🦎', Poisson: '🐟', Autre: '🐾',
}

const TYPES_GARDE = [
  { id: 'domicile',  label: 'À domicile du gardien' },
  { id: 'visite',    label: 'Visite à domicile' },
  { id: 'promenade', label: 'Promenade' },
]

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

export default function ReservationPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [animaux, setAnimaux]   = useState<Animal[]>([])
  const [gardien, setGardien]   = useState<Gardien | null>(null)
  const [loading, setLoading]   = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState('')

  const [animalSelec, setAnimalSelec] = useState<string | null>(null)
  const [typeGarde, setTypeGarde]     = useState('domicile')
  const [dateDebut, setDateDebut]     = useState('')
  const [dateFin, setDateFin]         = useState('')
  const [instructions, setInstructions] = useState('')
  const [assurance, setAssurance]     = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [animRes, gardRes] = await Promise.all([
          api.get<{ data: Animal[]; total: number }>('/animals'),
          api.get<Gardien>(`/users/gardiens/${id}`),
        ])
        setAnimaux(animRes.data || [])
        setGardien(gardRes)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!animalSelec || !dateDebut || !dateFin || !id) return
    setSubmitting(true)
    setError('')
    try {
      await api.post('/reservations', {
        gardien_id: id,
        animal_id: animalSelec,
        date_debut: dateDebut,
        date_fin: dateFin,
        instructions: instructions || null,
        assurance,
      })
      navigate('/dashboard-proprio')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi')
      setSubmitting(false)
    }
  }

  const inputCls = "border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent w-full"

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
        <Header />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Chargement...</div>
      </div>
    )
  }

  const gardienNom = gardien ? `${gardien.prenom} ${gardien.nom}` : '…'
  const gardienPrenom = gardien?.prenom || gardienNom

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
      <Header />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-10">

        <p className="text-xs font-black tracking-widest mb-1" style={{ color: '#5A7A1A' }}>DEMANDE DE GARDE</p>
        <h1 className="text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
          Réserver {gardienNom}
        </h1>

        {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

        {/* Carte gardien */}
        {gardien && (
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3 mb-6" style={{ backgroundColor: '#E8F0DC' }}>
            <div className="w-12 h-12 rounded-full bg-[#D4E6C3] flex items-center justify-center text-lg font-black text-[#3A5220] shrink-0">
              {((gardien.prenom?.[0] ?? '') + (gardien.nom?.[0] ?? '')).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-black text-gray-900">
                {gardienNom}
                {gardien.profil_gardien_verifie && <span className="ml-2 text-xs font-bold" style={{ color: '#3A5220' }}>· Vérifié</span>}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs" style={{ color: '#F59E0B' }}>{'★'.repeat(5)}</span>
                <span className="text-xs text-gray-600">
                  {gardien.note_moyenne ?? '—'} · {gardien.nb_avis ?? 0} avis
                  {gardien.ville ? ` · ${gardien.ville}` : ''}
                </span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Animal concerné */}
          <div>
            <label className="text-sm font-bold text-gray-800 block mb-3">Animal concerné</label>
            {animaux.length === 0 && (
              <p className="text-sm text-gray-400 mb-3">Vous n'avez pas encore ajouté d'animal. <Link to="/profil?tab=animaux" className="font-bold underline" style={{ color: '#D91B5C' }}>Ajouter un animal</Link></p>
            )}
            <div className="grid grid-cols-3 gap-3">
              {animaux.map(animal => {
                const selected = animalSelec === animal.id
                return (
                  <button key={animal.id} type="button" onClick={() => setAnimalSelec(animal.id)}
                    className="flex flex-col items-center p-4 rounded-2xl border-2 transition-all"
                    style={{
                      borderColor: selected ? '#D91B5C' : '#E5E7EB',
                      backgroundColor: selected ? '#FFF0F5' : 'white',
                    }}>
                    <span className="text-3xl mb-2">{ESPECE_EMOJI[animal.espece] ?? '🐾'}</span>
                    <span className="text-sm font-black text-gray-900">{animal.nom}</span>
                    <span className="text-xs text-gray-500">{[animal.espece, animal.race].filter(Boolean).join(' · ')}</span>
                  </button>
                )
              })}
              <Link to="/profil?tab=animaux"
                className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors bg-white">
                <span className="text-2xl text-gray-400 mb-1">+</span>
                <span className="text-xs text-gray-500 font-semibold">Ajouter</span>
              </Link>
            </div>
          </div>

          {/* Type de garde */}
          <div>
            <label className="text-sm font-bold text-gray-800 block mb-3">Type de garde</label>
            <div className="flex flex-wrap gap-2">
              {TYPES_GARDE.map(t => (
                <button key={t.id} type="button" onClick={() => setTypeGarde(t.id)}
                  className="px-4 py-2 rounded-full text-sm font-bold transition-all border-2"
                  style={{
                    backgroundColor: typeGarde === t.id ? '#3A5220' : 'white',
                    borderColor:     typeGarde === t.id ? '#3A5220' : '#E5E7EB',
                    color:           typeGarde === t.id ? 'white'   : '#374151',
                  }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-800">Date de début</label>
              <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={inputCls} required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-800">Date de fin</label>
              <input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)}
                min={dateDebut || new Date().toISOString().split('T')[0]}
                className={inputCls} required />
            </div>
          </div>

          {/* Instructions */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-800">Instructions pour {gardienPrenom}</label>
            <textarea rows={4} value={instructions} onChange={e => setInstructions(e.target.value)}
              placeholder="Luna mange 2 fois par jour. Elle prend un comprimé le matin avec la pâtée..."
              className={inputCls + ' resize-none'} />
          </div>

          {/* Assurance */}
          <div className="border border-gray-200 rounded-2xl p-4 bg-white flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-black text-gray-900 mb-0.5">Assurance garde — optionnelle</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Couverture accidents et soins vétérinaires urgents pendant la garde
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-bold" style={{ color: '#3A5220' }}>+ 12€</span>
              <Toggle checked={assurance} onChange={() => setAssurance(a => !a)} />
            </div>
          </div>

          {/* Info */}
          <div className="rounded-xl px-4 py-3 text-sm text-gray-600" style={{ backgroundColor: '#E8F0DC' }}>
            La rémunération est convenue directement entre vous et le gardien.
          </div>

          {/* Bouton */}
          <button type="submit" disabled={submitting || !animalSelec || !dateDebut || !dateFin}
            className="w-full py-4 rounded-2xl font-bold text-white text-base hover:opacity-90 transition disabled:opacity-50"
            style={{ backgroundColor: '#3A5220' }}>
            {submitting ? 'Envoi en cours...' : `Envoyer la demande à ${gardienPrenom} →`}
          </button>

          <Link to={`/gardiens/${id}`}
            className="text-center text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← Retour au profil
          </Link>
        </form>
      </main>
    </div>
  )
}
