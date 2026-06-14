import { useState } from 'react'
import { Link } from 'react-router-dom'

const PAIRES = [
  { animal: { emoji: '🐕', nom: 'Chien' },   besoin: { emoji: '🦮', label: '2 promenades par jour' } },
  { animal: { emoji: '🐈', nom: 'Chat' },    besoin: { emoji: '🪣', label: 'Une litière propre' } },
  { animal: { emoji: '🐇', nom: 'Lapin' },   besoin: { emoji: '🌿', label: 'Du foin à volonté' } },
  { animal: { emoji: '🦜', nom: 'Perruche' },besoin: { emoji: '🪺', label: 'Une cage spacieuse' } },
  { animal: { emoji: '🐟', nom: 'Poisson' }, besoin: { emoji: '💧', label: 'De l\'eau propre' } },
  { animal: { emoji: '🐹', nom: 'Hamster' }, besoin: { emoji: '🌙', label: 'Sortir la nuit' } },
]

export default function AssociationsGame() {
  const [selAnimal, setSelAnimal]   = useState<number | null>(null)
  const [trouvees, setTrouvees]     = useState<number[]>([])
  const [erreurs, setErreurs]       = useState<number[]>([])
  const [score, setScore]           = useState(0)
  const [fini, setFini]             = useState(false)

  const [besoinsMelanges] = useState(() =>
    [...PAIRES].map((p, i) => ({ ...p.besoin, idx: i })).sort(() => Math.random() - 0.5)
  )

  const cliquerBesoin = (idx: number) => {
    if (trouvees.includes(idx) || selAnimal === null) return
    if (idx === selAnimal) {
      const nouvTrouvees = [...trouvees, idx]
      setTrouvees(nouvTrouvees)
      setScore(s => s + 1)
      setSelAnimal(null)
      if (nouvTrouvees.length === PAIRES.length) setFini(true)
    } else {
      setErreurs(prev => [...prev, idx, selAnimal])
      setTimeout(() => setErreurs([]), 800)
      setSelAnimal(null)
    }
  }

  if (fini) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
        <div className="bg-white rounded-3xl shadow-sm p-8 max-w-sm w-full text-center">
          <div className="text-6xl mb-3 animate-bounce">🏆</div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Parfait !</h2>
          <p className="text-4xl mb-3">{'⭐'.repeat(score >= PAIRES.length ? 3 : score >= 4 ? 2 : 1)}</p>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Chaque animal a ses propres besoins. C'est pour ça qu'avant d'adopter, il faut bien se renseigner ! 🐾
          </p>
          <button onClick={() => { setTrouvees([]); setSelAnimal(null); setScore(0); setFini(false) }}
            className="w-full py-3 rounded-2xl font-black text-white" style={{ backgroundColor: '#5A7A1A' }}>
            Rejouer !
          </button>
          <Link to="/jeux" className="block mt-3 text-sm text-gray-400">← Retour aux jeux</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
      <div className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between sticky top-0 z-40">
        <Link to="/jeux" className="text-sm font-bold text-gray-500 hover:text-[#3A5220]">← Jeux</Link>
        <span className="font-black text-gray-900">🔗 Qui mange quoi ?</span>
        <span className="text-sm text-gray-500">{trouvees.length}/{PAIRES.length}</span>
      </div>

      <main className="flex-1 flex flex-col items-center px-4 py-8 gap-6">
        <p className="text-sm text-gray-600 font-semibold text-center">
          {selAnimal !== null
            ? `Tu as sélectionné ${PAIRES[selAnimal].animal.nom} — maintenant clique sur son besoin !`
            : 'Clique sur un animal, puis sur son besoin !'}
        </p>

        <div className="w-full max-w-md grid grid-cols-2 gap-6">
          {/* Animaux */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-black text-gray-400 text-center uppercase tracking-widest">Animaux</p>
            {PAIRES.map((p, i) => (
              <button key={i} onClick={() => !trouvees.includes(i) && setSelAnimal(i)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                  trouvees.includes(i) ? 'opacity-40 cursor-default bg-[#E8F0DC] text-[#3A5220]' :
                  selAnimal === i ? 'bg-[#3A5220] text-white scale-105 shadow-md' :
                  erreurs.includes(i) ? 'bg-red-100 text-red-600' :
                  'bg-white text-gray-800 hover:shadow-sm hover:-translate-y-0.5'
                }`}>
                <span className="text-2xl">{p.animal.emoji}</span>
                {p.animal.nom}
              </button>
            ))}
          </div>

          {/* Besoins */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-black text-gray-400 text-center uppercase tracking-widest">Besoins</p>
            {besoinsMelanges.map(b => (
              <button key={b.idx} onClick={() => cliquerBesoin(b.idx)}
                className={`flex items-center gap-2 px-3 py-3 rounded-2xl text-xs font-bold transition-all ${
                  trouvees.includes(b.idx) ? 'opacity-40 cursor-default bg-[#E8F0DC] text-[#3A5220]' :
                  erreurs.includes(b.idx) ? 'bg-red-100 text-red-600' :
                  selAnimal !== null ? 'bg-white text-gray-800 hover:shadow-sm hover:-translate-y-0.5 cursor-pointer' :
                  'bg-white text-gray-400 cursor-default'
                }`}>
                <span className="text-xl shrink-0">{b.emoji}</span>
                <span className="text-left leading-tight">{b.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
