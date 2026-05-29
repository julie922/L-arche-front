import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'

// Mock animaux de l'utilisateur connecté (viendra du back)
const MOCK_ANIMAUX = [
  { id: 1, nom: 'Luna',  espece: 'Border Collie', age: '3 ans', emoji: '🐕', veto: 'Dr Rousseau',  telVeto: '04 72 00 00 00' },
  { id: 2, nom: 'Minou', espece: 'Chat',          age: '5 ans', emoji: '🐈', veto: 'Dr Martin',    telVeto: '04 78 11 22 33' },
]

// Mock gardien (viendra du back via l'id)
const MOCK_GARDIEN = {
  nom: 'Jules Martin',
  verifie: true,
  note: 4.9,
  nbAvis: 28,
  ville: 'Lyon 3e',
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
  const gardien = MOCK_GARDIEN // TODO: fetch par id

  const [animauxSelec, setAnimauxSelec] = useState<number[]>([])
  const [typeGarde, setTypeGarde]       = useState('domicile')
  const [dateDebut, setDateDebut]       = useState('')
  const [dateFin, setDateFin]           = useState('')
  const [instructions, setInstructions] = useState('')
  const [veto, setVeto]                 = useState('')
  const [telVeto, setTelVeto]           = useState('')
  const [assurance, setAssurance]       = useState(false)

  const toggleAnimal = (animalId: number) =>
    setAnimauxSelec(prev =>
      prev.includes(animalId)
        ? prev.filter(id => id !== animalId)
        : [...prev, animalId]
    )

  // Infos véto des animaux sélectionnés (une ligne par animal)
  const vetsSelectionnes = animauxSelec
    .map(id => MOCK_ANIMAUX.find(a => a.id === id))
    .filter((a): a is typeof MOCK_ANIMAUX[0] => !!a)

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // TODO: POST /api/demandes
  }

  const inputCls = "border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent w-full"

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
      <Header />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-10">

        {/* En-tête */}
        <p className="text-xs font-black tracking-widest mb-1" style={{ color: '#5A7A1A' }}>DEMANDE DE GARDE</p>
        <h1 className="text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
          Réserver {gardien.nom}
        </h1>

        {/* Carte gardien */}
        <div className="rounded-2xl px-4 py-3 flex items-center gap-3 mb-6" style={{ backgroundColor: '#E8F0DC' }}>
          <div className="w-12 h-12 rounded-full bg-gray-300 shrink-0" />
          <div>
            <p className="text-sm font-black text-gray-900">
              {gardien.nom}
              {gardien.verifie && <span className="ml-2 text-xs font-bold" style={{ color: '#3A5220' }}>· Vérifié</span>}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs" style={{ color: '#F59E0B' }}>{'★'.repeat(5)}</span>
              <span className="text-xs text-gray-600">{gardien.note} · {gardien.nbAvis} avis · {gardien.ville}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Animal concerné */}
          <div>
            <label className="text-sm font-bold text-gray-800 block mb-3">Animal concerné</label>
            <div className="grid grid-cols-3 gap-3">
              {MOCK_ANIMAUX.map(animal => {
                const selected = animauxSelec.includes(animal.id)
                return (
                  <button key={animal.id} type="button" onClick={() => toggleAnimal(animal.id)}
                    className="flex flex-col items-center p-4 rounded-2xl border-2 transition-all"
                    style={{
                      borderColor: selected ? '#D91B5C' : '#E5E7EB',
                      backgroundColor: selected ? '#FFF0F5' : 'white',
                    }}>
                    <span className="text-3xl mb-2">{animal.emoji}</span>
                    <span className="text-sm font-black text-gray-900">{animal.nom}</span>
                    <span className="text-xs text-gray-500">{animal.espece} · {animal.age}</span>
                  </button>
                )
              })}
              {/* Bouton ajouter */}
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
              <div className="relative">
                <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)}
                  className={inputCls} required />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-800">Date de fin</label>
              <div className="relative">
                <input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)}
                  className={inputCls} required />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-800">Instructions pour {gardien.nom.split(' ')[0]}</label>
            <textarea rows={4} value={instructions} onChange={e => setInstructions(e.target.value)}
              placeholder={`Luna mange 2 fois par jour (8h et 19h). Elle prend un comprimé le matin avec la pâtée. Elle adore les balles mais a peur des aspirateurs !`}
              className={inputCls + ' resize-none'} />
          </div>

          {/* Vétérinaire — une ligne par animal sélectionné */}
          {vetsSelectionnes.length > 0 && (
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-gray-800">
                Vétérinaire{vetsSelectionnes.length > 1 ? 's' : ''}
              </label>
              {vetsSelectionnes.map(animal => (
                <div key={animal.id} className="flex flex-col gap-1.5">
                  {vetsSelectionnes.length > 1 && (
                    <p className="text-xs font-bold text-gray-500 flex items-center gap-1">
                      <span>{animal.emoji}</span> {animal.nom}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text"
                      placeholder="Dr Rousseau"
                      defaultValue={animal.veto}
                      className={inputCls} />
                    <input type="tel"
                      placeholder="04 72 00 00 00"
                      defaultValue={animal.telVeto}
                      className={inputCls} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Champs vides si aucun animal sélectionné */}
          {vetsSelectionnes.length === 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-800">Vétérinaire</label>
                <input type="text" placeholder="Dr Rousseau" value={veto}
                  onChange={e => setVeto(e.target.value)} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-800">Téléphone véto</label>
                <input type="tel" placeholder="04 72 00 00 00" value={telVeto}
                  onChange={e => setTelVeto(e.target.value)} className={inputCls} />
              </div>
            </div>
          )}

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

          {/* Info rémunération */}
          <div className="rounded-xl px-4 py-3 text-sm text-gray-600" style={{ backgroundColor: '#E8F0DC' }}>
            La rémunération est convenue directement entre vous et le gardien.
          </div>

          {/* Bouton envoi */}
          <button type="submit"
            className="w-full py-4 rounded-2xl font-bold text-white text-base hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#3A5220' }}>
            Envoyer la demande à {gardien.nom.split(' ')[0]} →
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
