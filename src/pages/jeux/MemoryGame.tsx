import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const ANIMAUX = ['🐕','🐈','🐇','🦜','🐟','🐹','🦎','🐢','🦔','🐿️','🦦','🐓']

const NIVEAUX = [
  { label: 'Facile',  paires: 4,  cols: 4 },
  { label: 'Moyen',   paires: 8,  cols: 4 },
  { label: 'Difficile', paires: 12, cols: 6 },
]

interface Carte { id: number; emoji: string; retournee: boolean; trouvee: boolean }

function FinEcran({ moves, temps, paires, onRejouer }: { moves: number; temps: number; paires: number; onRejouer: () => void }) {
  const etoiles = moves <= paires * 2 ? 3 : moves <= paires * 3 ? 2 : 1
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="text-6xl animate-bounce">🏆</div>
      <h2 className="text-2xl font-black text-gray-900">Bravo, tu as gagné !</h2>
      <div className="text-4xl">{'⭐'.repeat(etoiles)}{'☆'.repeat(3 - etoiles)}</div>
      <p className="text-gray-600 text-sm">{moves} coups · {temps}s</p>
      <p className="text-sm text-[#3A5220] font-semibold max-w-xs">
        Tout comme dans ce jeu, prendre soin d'un animal demande de la patience et de l'attention tous les jours ! 🐾
      </p>
      <button onClick={onRejouer}
        className="px-6 py-3 rounded-2xl font-black text-white text-sm hover:opacity-90 transition"
        style={{ backgroundColor: '#3A5220' }}>
        Rejouer !
      </button>
    </div>
  )
}

export default function MemoryGame() {
  const [niveau, setNiveau] = useState<number | null>(null)
  const [cartes, setCartes] = useState<Carte[]>([])
  const [retournees, setRetournees] = useState<number[]>([])
  const [trouvees, setTrouvees] = useState<number>(0)
  const [moves, setMoves] = useState(0)
  const [temps, setTemps] = useState(0)
  const [gagne, setGagne] = useState(false)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    if (niveau === null || gagne) return
    const timer = setInterval(() => setTemps(t => t + 1), 1000)
    return () => clearInterval(timer)
  }, [niveau, gagne])

  const demarrer = (idx: number) => {
    const n = NIVEAUX[idx]
    const pool = [...ANIMAUX].slice(0, n.paires)
    const pairs = [...pool, ...pool]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, retournee: false, trouvee: false }))
    setCartes(pairs)
    setRetournees([])
    setTrouvees(0)
    setMoves(0)
    setTemps(0)
    setGagne(false)
    setNiveau(idx)
  }

  const cliquer = (id: number) => {
    if (locked || retournees.includes(id) || cartes[id].trouvee) return
    const newRetournees = [...retournees, id]
    setRetournees(newRetournees)

    if (newRetournees.length === 2) {
      setMoves(m => m + 1)
      setLocked(true)
      const [a, b] = newRetournees
      if (cartes[a].emoji === cartes[b].emoji) {
        setCartes(prev => prev.map(c => newRetournees.includes(c.id) ? { ...c, trouvee: true } : c))
        const newTrouvees = trouvees + 1
        setTrouvees(newTrouvees)
        if (newTrouvees === NIVEAUX[niveau!].paires) setGagne(true)
        setRetournees([])
        setLocked(false)
      } else {
        setTimeout(() => { setRetournees([]); setLocked(false) }, 900)
      }
    }
  }

  const cols = niveau !== null ? NIVEAUX[niveau].cols : 4

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
      <div className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between sticky top-0 z-40">
        <Link to="/jeux" className="text-sm font-bold text-gray-500 hover:text-[#3A5220]">← Retour aux jeux</Link>
        <span className="font-black text-gray-900">🃏 Memory des animaux</span>
        {niveau !== null && <span className="text-sm text-gray-500">{temps}s · {moves} coups</span>}
      </div>

      <main className="flex-1 flex flex-col items-center px-4 py-8">

        {niveau === null ? (
          <div className="text-center max-w-md">
            <div className="text-5xl mb-4">🃏</div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Memory des animaux</h1>
            <p className="text-sm text-gray-500 mb-8">Retourne les cartes et trouve toutes les paires !</p>
            <div className="flex flex-col gap-3">
              {NIVEAUX.map((n, i) => (
                <button key={i} onClick={() => demarrer(i)}
                  className="py-4 rounded-2xl font-black text-white text-base hover:opacity-90 transition"
                  style={{ backgroundColor: i === 0 ? '#5A7A1A' : i === 1 ? '#3A5220' : '#2D4A18' }}>
                  {n.label} — {n.paires} paires
                </button>
              ))}
            </div>
          </div>
        ) : gagne ? (
          <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-6">
            <FinEcran moves={moves} temps={temps} paires={NIVEAUX[niveau].paires} onRejouer={() => setNiveau(null)} />
          </div>
        ) : (
          <>
            <div className={`grid gap-3 w-full max-w-xl`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {cartes.map(c => {
                const visible = retournees.includes(c.id) || c.trouvee
                return (
                  <button key={c.id} onClick={() => cliquer(c.id)}
                    className={`aspect-square rounded-2xl text-3xl flex items-center justify-center font-bold transition-all duration-300 select-none ${
                      c.trouvee ? 'opacity-40 cursor-default' : 'hover:scale-105 active:scale-95'
                    }`}
                    style={{
                      backgroundColor: visible ? '#D4E6C3' : '#3A5220',
                      fontSize: cols > 4 ? '1.5rem' : '2rem',
                    }}>
                    {visible ? c.emoji : '?'}
                  </button>
                )
              })}
            </div>
            <button onClick={() => setNiveau(null)} className="mt-6 text-sm text-gray-400 hover:text-gray-600">
              Changer de niveau
            </button>
          </>
        )}
      </main>
    </div>
  )
}
