import { useState } from 'react'
import { Link } from 'react-router-dom'

const ANIMAUX = [
  { emoji: '🦒', nom: 'Girafe'    },
  { emoji: '🐘', nom: 'Éléphant' },
  { emoji: '🦁', nom: 'Lion'     },
  { emoji: '🐧', nom: 'Pingouin' },
  { emoji: '🐬', nom: 'Dauphin'  },
  { emoji: '🦊', nom: 'Renard'   },
]

type Mode = 'libre' | 'taquin'

function shuffle(arr: (number | null)[]): (number | null)[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function isSolvable(pieces: (number | null)[], cols: number): boolean {
  const flat = pieces.filter(p => p !== null) as number[]
  let inv = 0
  for (let i = 0; i < flat.length; i++)
    for (let j = i + 1; j < flat.length; j++)
      if (flat[i] > flat[j]) inv++
  const emptyRow = Math.floor(pieces.indexOf(null) / cols)
  if (cols % 2 === 1) return inv % 2 === 0
  return (inv + emptyRow) % 2 === 1
}

function createTaquin(cols: number): (number | null)[] {
  const n = cols * cols
  let pieces: (number | null)[] = [...Array.from({ length: n - 1 }, (_, i) => i), null]
  do { pieces = shuffle(pieces) } while (!isSolvable(pieces, cols) || pieces.every((p, i) => p === i || (p === null && i === n - 1)))
  return pieces
}

// Affiche une portion de l'emoji comme une tuile de puzzle
function EmojiTile({ emoji, piece, cols, tileSize }: { emoji: string; piece: number; cols: number; tileSize: number }) {
  const row = Math.floor(piece / cols)
  const col = piece % cols
  const emojiSize = tileSize * cols
  return (
    <div style={{ width: tileSize, height: tileSize, overflow: 'hidden', position: 'relative', borderRadius: 10, flexShrink: 0 }}>
      <span style={{
        fontSize: emojiSize,
        lineHeight: 1,
        position: 'absolute',
        top: -row * tileSize,
        left: -col * tileSize,
        userSelect: 'none',
        display: 'block',
      }}>
        {emoji}
      </span>
    </div>
  )
}

// ── Puzzle Libre (swap libre) ─────────────────────────────────────────────────
function PuzzleLibre({ emoji, cols, onBack }: { emoji: string; cols: number; onBack: () => void }) {
  const n = cols * cols
  const tileSize = cols === 3 ? 90 : 70

  const [pieces, setPieces] = useState<number[]>(() => {
    let a = Array.from({ length: n }, (_, i) => i)
    do { a = shuffle(a) as number[] } while (a.every((v, i) => v === i))
    return a
  })
  const [selected, setSelected] = useState<number | null>(null)
  const [moves, setMoves]       = useState(0)
  const [gagne, setGagne]       = useState(false)

  const cliquer = (pos: number) => {
    if (gagne) return
    if (selected === null) { setSelected(pos); return }
    if (selected === pos)  { setSelected(null); return }
    setPieces(prev => {
      const next = [...prev]
      ;[next[selected], next[pos]] = [next[pos], next[selected]]
      if (next.every((v, i) => v === i)) setGagne(true)
      return next
    })
    setMoves(m => m + 1)
    setSelected(null)
  }

  if (gagne) return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="text-6xl animate-bounce">🎉</div>
      <h2 className="text-2xl font-black text-gray-900">Bravo !</h2>
      <p className="text-sm text-gray-500">{moves} coups pour un {cols}×{cols}</p>
      <div className="flex gap-3">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl border-2 border-gray-200 font-bold text-sm text-gray-600">Changer</button>
        <button onClick={() => { setPieces((() => { let a = Array.from({ length: n }, (_, i) => i); do { a = shuffle(a) as number[] } while (a.every((v, i) => v === i)); return a })()); setMoves(0); setGagne(false); setSelected(null) }}
          className="px-5 py-2.5 rounded-xl font-black text-white text-sm" style={{ backgroundColor: '#3A5220' }}>Rejouer</button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-gray-500">{selected !== null ? 'Clique sur la pièce de destination' : 'Clique sur deux pièces pour les échanger'} · {moves} coups</p>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, ${tileSize}px)` }}>
        {pieces.map((piece, pos) => {
          const isSelected = selected === pos
          const isCorrect  = piece === pos
          return (
            <button key={pos} onClick={() => cliquer(pos)}
              className="transition-all duration-150 active:scale-95"
              style={{
                outline: isSelected ? '3px solid #D91B5C' : isCorrect ? '2px solid #A8C539' : '2px solid transparent',
                outlineOffset: '2px',
                transform: isSelected ? 'scale(0.93)' : undefined,
                borderRadius: 12,
              }}>
              <EmojiTile emoji={emoji} piece={piece} cols={cols} tileSize={tileSize} />
            </button>
          )
        })}
      </div>
      <p className="text-xs text-gray-400">Bordure verte = bien placée ({pieces.filter((p, i) => p === i).length}/{n})</p>
    </div>
  )
}

// ── Taquin (pièce manquante + glissement) ─────────────────────────────────────
function Taquin({ emoji, cols, onBack }: { emoji: string; cols: number; onBack: () => void }) {
  const n = cols * cols
  const tileSize = cols === 3 ? 90 : 70

  const [pieces, setPieces] = useState<(number | null)[]>(() => createTaquin(cols))
  const [moves, setMoves]   = useState(0)
  const [gagne, setGagne]   = useState(false)

  const emptyIdx = pieces.indexOf(null)

  const isAdjacent = (pos: number) => {
    const pr = Math.floor(pos / cols);      const pc = pos % cols
    const er = Math.floor(emptyIdx / cols); const ec = emptyIdx % cols
    return (Math.abs(pr - er) === 1 && pc === ec) || (Math.abs(pc - ec) === 1 && pr === er)
  }

  const glisser = (pos: number) => {
    if (!isAdjacent(pos) || gagne) return
    setPieces(prev => {
      const next = [...prev]
      ;[next[pos], next[emptyIdx]] = [next[emptyIdx], next[pos]]
      const solved = next.every((p, i) => p === (i === n - 1 ? null : i))
      if (solved) setGagne(true)
      return next
    })
    setMoves(m => m + 1)
  }

  if (gagne) return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="text-6xl animate-bounce">🏆</div>
      <h2 className="text-2xl font-black text-gray-900">Résolu !</h2>
      <p className="text-sm text-gray-500">{moves} coups pour un {cols}×{cols}</p>
      <div className="flex gap-3">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl border-2 border-gray-200 font-bold text-sm text-gray-600">Changer</button>
        <button onClick={() => { setPieces(createTaquin(cols)); setMoves(0); setGagne(false) }}
          className="px-5 py-2.5 rounded-xl font-black text-white text-sm" style={{ backgroundColor: '#3A5220' }}>Rejouer</button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-gray-500">Glisse les pièces vers la case vide · {moves} coups</p>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, ${tileSize}px)` }}>
        {pieces.map((piece, pos) => {
          if (piece === null) return (
            <div key={pos} style={{ width: tileSize, height: tileSize, borderRadius: 12, backgroundColor: '#E5E7EB' }} />
          )
          const canMove = isAdjacent(pos)
          return (
            <button key={pos} onClick={() => glisser(pos)}
              className={`transition-all duration-150 ${canMove ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-default'}`}
              style={{ borderRadius: 12, outline: canMove ? '2px dashed #A8C539' : 'none', outlineOffset: '1px' }}>
              <EmojiTile emoji={emoji} piece={piece} cols={cols} tileSize={tileSize} />
            </button>
          )
        })}
      </div>
      <p className="text-xs text-gray-400">Contour vert = pièces que tu peux bouger</p>
    </div>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function PuzzleGame() {
  const [config, setConfig] = useState<{ animalIdx: number; cols: number; mode: Mode } | null>(null)

  if (!config) return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
      <div className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between sticky top-0 z-40">
        <Link to="/jeux" className="text-sm font-bold text-gray-500 hover:text-[#3A5220]">← Jeux</Link>
        <span className="font-black text-gray-900">🧩 Puzzle</span>
        <span />
      </div>
      <main className="flex-1 flex flex-col items-center px-4 py-8 gap-8">

        {/* Mode */}
        {(['libre', 'taquin'] as Mode[]).map(mode => (
          <div key={mode} className="w-full max-w-sm">
            <div className="text-center mb-3">
              <p className="font-black text-gray-900 text-base">
                {mode === 'libre' ? '🔀 Puzzle libre' : '🎯 Taquin (pièce manquante)'}
              </p>
              <p className="text-xs text-gray-400">
                {mode === 'libre' ? 'Clique sur 2 pièces pour les échanger' : 'Glisse les pièces vers la case vide'}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-2">
              {ANIMAUX.map((a, ai) => (
                <button key={ai}
                  onClick={() => setConfig({ animalIdx: ai, cols: 3, mode })}
                  className="bg-white rounded-2xl py-3 flex flex-col items-center gap-1 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <span className="text-3xl">{a.emoji}</span>
                  <span className="text-xs font-bold text-gray-600">{a.nom}</span>
                  <span className="text-[10px] text-gray-400">3×3</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {ANIMAUX.map((a, ai) => (
                <button key={ai}
                  onClick={() => setConfig({ animalIdx: ai, cols: 4, mode })}
                  className="bg-white rounded-2xl py-2 flex flex-col items-center gap-0.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all opacity-80">
                  <span className="text-2xl">{a.emoji}</span>
                  <span className="text-xs font-bold text-gray-600">{a.nom}</span>
                  <span className="text-[10px] text-gray-400">4×4</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )

  const { animalIdx, cols, mode } = config
  const emoji = ANIMAUX[animalIdx].emoji
  const nom   = ANIMAUX[animalIdx].nom

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
      <div className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between sticky top-0 z-40">
        <button onClick={() => setConfig(null)} className="text-sm font-bold text-gray-500 hover:text-[#3A5220]">← Choisir</button>
        <span className="font-black text-gray-900">🧩 {nom} — {mode === 'libre' ? 'Libre' : 'Taquin'} {cols}×{cols}</span>
        <span />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        {mode === 'libre'
          ? <PuzzleLibre key={`${animalIdx}-${cols}`} emoji={emoji} cols={cols} onBack={() => setConfig(null)} />
          : <Taquin      key={`${animalIdx}-${cols}`} emoji={emoji} cols={cols} onBack={() => setConfig(null)} />
        }
      </main>
    </div>
  )
}
