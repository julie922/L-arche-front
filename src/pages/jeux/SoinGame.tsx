import { useState } from 'react'
import { Link } from 'react-router-dom'

const ANIMAUX = [
  { id: 'chien',  nom: 'Chien',  emoji: '🐕', couleur: '#8B5CF6' },
  { id: 'chat',   nom: 'Chat',   emoji: '🐈', couleur: '#EC4899' },
  { id: 'lapin',  nom: 'Lapin',  emoji: '🐇', couleur: '#F97316' },
]

const ACTIONS = [
  { id: 'manger',   label: 'Nourrir',   emoji: '🍖', jauge: 'faim',   gain: 30 },
  { id: 'promener', label: 'Promener',  emoji: '🦮', jauge: 'activite', gain: 30 },
  { id: 'calin',    label: 'Câliner',   emoji: '🤗', jauge: 'amour',  gain: 30 },
  { id: 'soigner',  label: 'Soigner',   emoji: '🪥', jauge: 'sante',  gain: 30 },
]

const MESSAGES = [
  'Ton animal a besoin de toi tous les jours !',
  'Les animaux ne peuvent pas se nourrir seuls.',
  'Un câlin par jour, c\'est indispensable !',
  'Promener son chien, c\'est obligatoire !',
]

interface Jauges { faim: number; activite: number; amour: number; sante: number }

function Jauge({ label, emoji, value }: { label: string; emoji: string; value: number }) {
  const color = value > 60 ? '#3A5220' : value > 30 ? '#F59E0B' : '#EF4444'
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg w-7 shrink-0">{emoji}</span>
      <div className="flex-1">
        <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
          <span>{label}</span><span>{value}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }} />
        </div>
      </div>
    </div>
  )
}

export default function SoinGame() {
  const [animal, setAnimal] = useState<typeof ANIMAUX[0] | null>(null)
  const [jauges, setJauges] = useState<Jauges>({ faim: 50, activite: 50, amour: 50, sante: 50 })
  const [message, setMessage] = useState('')
  const [jour, setJour] = useState(1)
  const [fini, setFini] = useState(false)

  const agir = (action: typeof ACTIONS[0]) => {
    setJauges(prev => {
      const val = Math.min(100, prev[action.jauge as keyof Jauges] + action.gain)
      return { ...prev, [action.jauge]: val }
    })
    setMessage(`Tu as ${action.label.toLowerCase()} ${animal!.nom} ! +${action.gain}% ${action.emoji}`)
    setTimeout(() => setMessage(''), 2000)
  }

  const passerJournee = () => {
    setJauges(prev => ({
      faim:     Math.max(0, prev.faim - 25),
      activite: Math.max(0, prev.activite - 20),
      amour:    Math.max(0, prev.amour - 15),
      sante:    Math.max(0, prev.sante - 10),
    }))
    if (jour >= 7) { setFini(true); return }
    setJour(j => j + 1)
    setMessage('Une nouvelle journée commence ! Pense à ton animal 🌅')
    setTimeout(() => setMessage(''), 2500)
  }

  const bonheur = Math.round((jauges.faim + jauges.activite + jauges.amour + jauges.sante) / 4)
  const humeur = bonheur > 70 ? '😊' : bonheur > 40 ? '😐' : '😢'

  if (fini) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
        <div className="bg-white rounded-3xl shadow-sm p-8 max-w-sm w-full text-center">
          <div className="text-6xl mb-4">{bonheur > 60 ? '🏆' : bonheur > 40 ? '👍' : '💪'}</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            {bonheur > 60 ? 'Super gardien !' : 'Bien essayé !'}
          </h2>
          <p className="text-4xl mb-2">{humeur}</p>
          <p className="text-sm font-bold mb-1" style={{ color: '#3A5220' }}>Bonheur de {animal!.nom} : {bonheur}%</p>
          <p className="text-sm text-gray-500 mt-4 leading-relaxed">
            {bonheur > 60
              ? `Bravo ! Tu sais prendre soin de ${animal!.nom}. Un animal c'est du bonheur... mais aussi de la responsabilité chaque jour ! 🐾`
              : `${animal!.nom} avait besoin de plus d'attention. Les animaux comptent sur nous tous les jours, même pendant les vacances !`}
          </p>
          <button onClick={() => { setAnimal(null); setJauges({ faim: 50, activite: 50, amour: 50, sante: 50 }); setJour(1); setFini(false) }}
            className="mt-6 w-full py-3 rounded-2xl font-black text-white hover:opacity-90"
            style={{ backgroundColor: '#3A5220' }}>
            Rejouer !
          </button>
          <Link to="/jeux" className="block mt-3 text-sm text-gray-400 hover:text-gray-600">← Retour aux jeux</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
      <div className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between sticky top-0 z-40">
        <Link to="/jeux" className="text-sm font-bold text-gray-500 hover:text-[#3A5220]">← Jeux</Link>
        <span className="font-black text-gray-900">❤️ Prends soin de moi</span>
        {animal && <span className="text-sm text-gray-500">Jour {jour}/7</span>}
      </div>

      <main className="flex-1 flex flex-col items-center px-4 py-8">

        {!animal ? (
          <div className="text-center max-w-md">
            <div className="text-5xl mb-4">❤️</div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Prends soin de moi !</h1>
            <p className="text-sm text-gray-500 mb-8">Choisis ton animal et prends-en soin pendant 7 jours.</p>
            <div className="grid grid-cols-3 gap-4">
              {ANIMAUX.map(a => (
                <button key={a.id} onClick={() => setAnimal(a)}
                  className="bg-white rounded-3xl p-5 flex flex-col items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border-2 border-transparent hover:border-[#3A5220]">
                  <span className="text-5xl">{a.emoji}</span>
                  <span className="font-black text-gray-900 text-sm">{a.nom}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm flex flex-col gap-4">
            {/* Animal */}
            <div className="bg-white rounded-3xl p-5 text-center shadow-sm">
              <div className="text-6xl mb-1">{animal.emoji}</div>
              <p className="text-3xl mb-1">{humeur}</p>
              <p className="font-black text-gray-900">{animal.nom}</p>
              <p className="text-xs text-gray-500">Bonheur : {bonheur}%</p>
            </div>

            {/* Message feedback */}
            {message && (
              <div className="bg-[#E8F0DC] rounded-2xl px-4 py-3 text-sm font-bold text-[#3A5220] text-center">
                {message}
              </div>
            )}

            {/* Jauges */}
            <div className="bg-white rounded-3xl p-5 shadow-sm flex flex-col gap-3">
              <Jauge label="Faim"     emoji="🍖" value={jauges.faim} />
              <Jauge label="Activité" emoji="🦮" value={jauges.activite} />
              <Jauge label="Amour"    emoji="🤗" value={jauges.amour} />
              <Jauge label="Santé"    emoji="🪥" value={jauges.sante} />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              {ACTIONS.map(a => (
                <button key={a.id} onClick={() => agir(a)}
                  className="bg-white rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95">
                  <span className="text-3xl">{a.emoji}</span>
                  <span className="text-xs font-black text-gray-800">{a.label}</span>
                </button>
              ))}
            </div>

            <button onClick={passerJournee}
              className="w-full py-3.5 rounded-2xl font-black text-white hover:opacity-90 transition"
              style={{ backgroundColor: '#3A5220' }}>
              Passer à demain ☀️ (Jour {jour}/7)
            </button>

            <p className="text-xs text-gray-400 text-center">
              {MESSAGES[Math.floor(Math.random() * MESSAGES.length)]}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
