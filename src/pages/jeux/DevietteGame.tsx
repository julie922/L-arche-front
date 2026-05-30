import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const ANIMAUX = [
  { emoji: '🐘', nom: 'ÉLÉPHANT', indices: ['Je suis le plus grand animal terrestre', 'J\'ai une très longue mémoire', 'Mon nez s\'appelle une trompe'] },
  { emoji: '🦁', nom: 'LION',     indices: ['Je suis le roi de la savane', 'Je vis en groupe appelé une troupe', 'Le mâle a une grande crinière'] },
  { emoji: '🐧', nom: 'PINGOUIN', indices: ['Je vis dans les régions froides', 'Je ne peux pas voler', 'Je suis un excellent nageur'] },
  { emoji: '🦒', nom: 'GIRAFE',   indices: ['J\'ai le plus long cou du règne animal', 'Je mange les feuilles en hauteur', 'Mes taches sont uniques comme des empreintes'] },
  { emoji: '🐊', nom: 'CROCODILE',indices: ['Je vis près des rivières et marécages', 'Je suis un reptile très ancien', 'Mes dents restent visibles même bouche fermée'] },
  { emoji: '🦜', nom: 'PERROQUET',indices: ['Je peux imiter la voix humaine', 'Je suis un oiseau très coloré', 'Je peux vivre plus de 50 ans'] },
  { emoji: '🦓', nom: 'ZÈBRE',    indices: ['Mes rayures sont uniques comme des empreintes', 'Je vis en Afrique', 'Je ressemble à un cheval rayé'] },
  { emoji: '🐺', nom: 'LOUP',     indices: ['Je vis en meute', 'Je hurle à la lune', 'Je suis l\'ancêtre du chien domestique'] },
]

const NIVEAUX_FLOU = [
  { label: 'Silhouette', filter: 'brightness(0)', size: 'text-9xl' },
  { label: 'Très flou',  filter: 'blur(8px)',     size: 'text-9xl' },
  { label: 'Flou',       filter: 'blur(4px)',     size: 'text-9xl' },
  { label: 'Presque !',  filter: 'blur(1px)',     size: 'text-9xl' },
  { label: 'Révélé',     filter: 'none',          size: 'text-9xl' },
]

export default function DevietteGame() {
  const [idx, setIdx]       = useState(() => Math.floor(Math.random() * ANIMAUX.length))
  const [niveau, setNiveau] = useState(0)
  const [guess, setGuess]   = useState('')
  const [essais, setEssais] = useState<{ texte: string; correct: boolean }[]>([])
  const [trouve, setTrouve] = useState(false)
  const [abandon, setAbandon] = useState(false)
  const [timer, setTimer]   = useState<ReturnType<typeof setInterval> | null>(null)
  const [autoReveal, setAutoReveal] = useState(false)

  const animal = ANIMAUX[idx]
  const score = Math.max(0, (NIVEAUX_FLOU.length - niveau - 1) * 2 + (essais.filter(e => !e.correct).length === 0 ? 5 : 0))

  useEffect(() => {
    if (!autoReveal || trouve || abandon || niveau >= NIVEAUX_FLOU.length - 1) return
    const t = setInterval(() => setNiveau(n => {
      if (n >= NIVEAUX_FLOU.length - 1) { clearInterval(t); return n }
      return n + 1
    }), 3000)
    setTimer(t)
    return () => clearInterval(t)
  }, [autoReveal, trouve, abandon])

  const deviner = () => {
    const g = guess.trim().toUpperCase()
    if (!g) return
    const correct = animal.nom.includes(g) || g.includes(animal.nom)
    setEssais(prev => [...prev, { texte: guess, correct }])
    setGuess('')
    if (correct) { setTrouve(true); if (timer) clearInterval(timer) }
    else if (niveau < NIVEAUX_FLOU.length - 1) setNiveau(n => n + 1)
  }

  const rejouer = () => {
    setIdx(Math.floor(Math.random() * ANIMAUX.length))
    setNiveau(0); setGuess(''); setEssais([]); setTrouve(false); setAbandon(false); setAutoReveal(false)
    if (timer) clearInterval(timer)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
      <div className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between sticky top-0 z-40">
        <Link to="/jeux" className="text-sm font-bold text-gray-500 hover:text-[#3A5220]">← Jeux</Link>
        <span className="font-black text-gray-900">🌫️ Devinette</span>
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: '#E8F0DC', color: '#3A5220' }}>
          {NIVEAUX_FLOU[niveau].label}
        </span>
      </div>

      <main className="flex-1 flex flex-col items-center px-4 py-8 gap-5">
        <p className="text-sm text-gray-600 font-semibold text-center">Quel est cet animal ?</p>

        {/* Indice textuel */}
        {animal.indices.slice(0, Math.min(niveau + 1, animal.indices.length)).map((ind, i) => (
          <div key={i} className="bg-white rounded-2xl px-5 py-2.5 text-sm text-gray-600 font-semibold shadow-sm w-full max-w-sm text-center border border-gray-100">
            💡 {ind}
          </div>
        ))}

        {/* Emoji avec filtre */}
        <div className={`${NIVEAUX_FLOU[niveau].size} select-none transition-all duration-700 cursor-default`}
          style={{ filter: NIVEAUX_FLOU[niveau].filter }}>
          {animal.emoji}
        </div>

        {/* Progression */}
        <div className="flex gap-2">
          {NIVEAUX_FLOU.map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full transition-all"
              style={{ backgroundColor: i <= niveau ? '#3A5220' : '#D1D5DB' }} />
          ))}
        </div>

        {/* Essais */}
        {essais.length > 0 && (
          <div className="flex flex-col gap-1.5 w-full max-w-sm">
            {essais.map((e, i) => (
              <div key={i} className={`px-4 py-2 rounded-xl text-sm font-bold text-center ${e.correct ? 'bg-[#E8F0DC] text-[#3A5220]' : 'bg-red-50 text-red-500'}`}>
                {e.correct ? '✓' : '✗'} {e.texte}
              </div>
            ))}
          </div>
        )}

        {(trouve || abandon) ? (
          <div className="bg-white rounded-3xl shadow-sm p-6 w-full max-w-sm text-center">
            <div className="text-6xl mb-2">{animal.emoji}</div>
            <h2 className="text-xl font-black text-gray-900 mb-1">{animal.nom}</h2>
            {trouve ? (
              <>
                <p className="text-sm font-bold mb-3" style={{ color: '#3A5220' }}>+{score} points ⭐</p>
                <p className="text-sm text-gray-500">
                  {score >= 8 ? 'Incroyable ! Tu l\'as trouvé dès la silhouette ! 🏆'
                    : score >= 4 ? 'Bien joué ! Tu as trouvé rapidement.'
                    : 'Trouvé ! La prochaine fois, essaie plus tôt !'}
                </p>
              </>
            ) : <p className="text-sm text-gray-500">C'était {animal.nom}. Rejoue !</p>}
            <button onClick={rejouer} className="mt-4 w-full py-3 rounded-2xl font-black text-white" style={{ backgroundColor: '#3A5220' }}>
              Nouvel animal !
            </button>
          </div>
        ) : (
          <div className="w-full max-w-sm flex flex-col gap-3">
            {!autoReveal && (
              <button onClick={() => setAutoReveal(true)}
                className="text-xs text-gray-400 hover:text-[#3A5220] font-semibold text-center">
                ▶ Révélation automatique (3s)
              </button>
            )}
            <div className="flex gap-2">
              <input type="text" value={guess} onChange={e => setGuess(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && deviner()}
                placeholder="Quel animal ?" className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A5220]" />
              <button onClick={deviner} className="px-5 py-3 rounded-xl font-black text-white" style={{ backgroundColor: '#3A5220' }}>→</button>
            </div>
            {niveau < NIVEAUX_FLOU.length - 1 && (
              <button onClick={() => setNiveau(n => Math.min(n + 1, NIVEAUX_FLOU.length - 1))}
                className="text-xs text-gray-400 hover:text-gray-600 font-semibold text-center">
                Révéler un peu plus (−points)
              </button>
            )}
            <button onClick={() => setAbandon(true)} className="text-xs text-gray-300 hover:text-gray-500 text-center">
              Je donne ma langue au chat 😅
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
