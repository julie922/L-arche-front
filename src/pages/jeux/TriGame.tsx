import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

const CATEGORIES = [
  { id: 'chien',   label: 'Chiens',   emoji: '🐕', couleur: '#3A5220' },
  { id: 'chat',    label: 'Chats',    emoji: '🐈', couleur: '#D91B5C' },
  { id: 'oiseau',  label: 'Oiseaux',  emoji: '🦜', couleur: '#1D4ED8' },
  { id: 'rongeur', label: 'Rongeurs', emoji: '🐹', couleur: '#B45309' },
]

const ANIMAUX_LISTE = [
  { emoji: '🐕', nom: 'Chien',      cat: 'chien'   },
  { emoji: '🐩', nom: 'Caniche',    cat: 'chien'   },
  { emoji: '🦮', nom: 'Labrador',   cat: 'chien'   },
  { emoji: '🐈', nom: 'Chat',       cat: 'chat'    },
  { emoji: '🐱', nom: 'Chaton',     cat: 'chat'    },
  { emoji: '😸', nom: 'Siamois',    cat: 'chat'    },
  { emoji: '🦜', nom: 'Perroquet',  cat: 'oiseau'  },
  { emoji: '🐦', nom: 'Canari',     cat: 'oiseau'  },
  { emoji: '🦚', nom: 'Paon',       cat: 'oiseau'  },
  { emoji: '🐹', nom: 'Hamster',    cat: 'rongeur' },
  { emoji: '🐰', nom: 'Lapin',      cat: 'rongeur' },
  { emoji: '🐭', nom: 'Souris',     cat: 'rongeur' },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function TriGame() {
  const [file, setFile]         = useState<typeof ANIMAUX_LISTE>([])
  const [actuel, setActuel]     = useState<typeof ANIMAUX_LISTE[0] | null>(null)
  const [score, setScore]       = useState(0)
  const [erreurs, setErreurs]   = useState(0)
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)
  const [fini, setFini]         = useState(false)
  const [started, setStarted]   = useState(false)
  const [position, setPosition] = useState(50) // position horizontale %

  const demarrer = useCallback(() => {
    const shuffled = shuffle(ANIMAUX_LISTE)
    setFile(shuffled.slice(1))
    setActuel(shuffled[0])
    setScore(0); setErreurs(0); setFeedback(null); setFini(false); setStarted(true); setPosition(50)
  }, [])

  // Animation de descente
  useEffect(() => {
    if (!started || fini || !actuel) return
    const t = setInterval(() => setPosition(p => Math.max(0, Math.min(100, p + (Math.random() - 0.5) * 5))), 800)
    return () => clearInterval(t)
  }, [started, fini, actuel])

  const trier = (cat: string) => {
    if (!actuel) return
    const correct = actuel.cat === cat
    if (correct) {
      setScore(s => s + 1)
      setFeedback({ ok: true, msg: `✓ Oui ! ${actuel.nom} est bien un ${CATEGORIES.find(c => c.id === cat)?.label.slice(0, -1).toLowerCase() ?? cat}` })
    } else {
      setErreurs(e => e + 1)
      setFeedback({ ok: false, msg: `✗ Non ! ${actuel.nom} est un ${CATEGORIES.find(c => c.id === actuel.cat)?.label.slice(0, -1).toLowerCase() ?? actuel.cat}` })
    }
    setTimeout(() => {
      setFeedback(null)
      if (file.length === 0) { setFini(true); return }
      setActuel(file[0])
      setFile(prev => prev.slice(1))
      setPosition(30 + Math.random() * 40)
    }, 900)
  }

  const total = ANIMAUX_LISTE.length
  const pct = Math.round((score / total) * 100)

  if (!started) return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
      <div className="bg-white rounded-3xl shadow-sm p-8 max-w-sm w-full text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Jeu de tri</h1>
        <p className="text-sm text-gray-500 mb-2">Des animaux apparaissent un par un.</p>
        <p className="text-sm text-gray-500 mb-8">Clique vite sur la bonne catégorie !</p>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {CATEGORIES.map(c => (
            <div key={c.id} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold" style={{ backgroundColor: c.couleur + '20', color: c.couleur }}>
              {c.emoji} {c.label}
            </div>
          ))}
        </div>
        <button onClick={demarrer} className="w-full py-4 rounded-2xl font-black text-white text-lg" style={{ backgroundColor: '#3A5220' }}>
          C'est parti ! 🚀
        </button>
        <Link to="/jeux" className="block mt-4 text-sm text-gray-400">← Retour aux jeux</Link>
      </div>
    </div>
  )

  if (fini) return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
      <div className="bg-white rounded-3xl shadow-sm p-8 max-w-sm w-full text-center">
        <div className="text-6xl mb-3">{pct >= 80 ? '🏆' : pct >= 50 ? '🎉' : '💪'}</div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">{score} / {total} corrects</h2>
        <div className="text-3xl mb-2">{pct >= 80 ? '⭐⭐⭐' : pct >= 50 ? '⭐⭐☆' : '⭐☆☆'}</div>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          {pct >= 80 ? 'Excellent ! Tu connais parfaitement les catégories d\'animaux ! 🐾'
            : pct >= 50 ? 'Bien joué ! Encore un peu d\'entraînement et ce sera parfait.'
            : 'Continue à apprendre les différentes familles d\'animaux !'}
        </p>
        <button onClick={demarrer} className="w-full py-3 rounded-2xl font-black text-white mb-3" style={{ backgroundColor: '#3A5220' }}>Rejouer !</button>
        <Link to="/jeux" className="text-sm text-gray-400">← Retour aux jeux</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
      <div className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between sticky top-0 z-40">
        <Link to="/jeux" className="text-sm font-bold text-gray-500 hover:text-[#3A5220]">← Jeux</Link>
        <span className="font-black text-gray-900">🎯 Jeu de tri</span>
        <span className="text-sm font-bold" style={{ color: '#3A5220' }}>✓ {score} · ✗ {erreurs}</span>
      </div>

      <main className="flex-1 flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
        {/* Zone de chute */}
        <div className="flex-1 relative overflow-hidden">
          {/* Animal qui descend */}
          {actuel && (
            <div className="absolute flex flex-col items-center gap-1 transition-all duration-700"
              style={{ left: `${position}%`, top: '30%', transform: 'translateX(-50%)' }}>
              <div className="text-7xl animate-bounce select-none">{actuel.emoji}</div>
              <div className="bg-white rounded-xl px-3 py-1 shadow-sm text-sm font-black text-gray-800">
                {actuel.nom}
              </div>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-2xl text-sm font-black text-white whitespace-nowrap ${feedback.ok ? '' : 'bg-red-500'}`}
              style={feedback.ok ? { backgroundColor: '#3A5220' } : {}}>
              {feedback.msg}
            </div>
          )}

          {/* Progression */}
          <div className="absolute bottom-2 left-4 right-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-2 rounded-full transition-all" style={{ width: `${((score + erreurs) / total) * 100}%`, backgroundColor: '#3A5220' }} />
          </div>
        </div>

        {/* Boutons de tri */}
        <div className="grid grid-cols-2 gap-3 px-4 pb-6 pt-3 shrink-0">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => trier(cat.id)}
              className="py-5 rounded-2xl font-black text-white text-base transition-all active:scale-95 hover:opacity-90 flex items-center justify-center gap-2"
              style={{ backgroundColor: cat.couleur }}>
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
