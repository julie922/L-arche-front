import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

const MOTS = [
  'CHIEN', 'CHAT', 'LAPIN', 'TIGRE', 'LION', 'LOUP', 'OURS', 'VACHE',
  'CHEVAL', 'MOUTON', 'COCHON', 'POULE', 'CANARD', 'PIGEON', 'AIGLE',
  'DAUPHIN', 'BALEINE', 'REQUIN', 'TORTUE', 'SINGE', 'GIRAFE', 'ZEBRE',
  'AUTRUCHE', 'GORILLE', 'PANTHÈRE',
].filter(m => m.length >= 4 && m.length <= 8)

const LETTRES_CLAVIER = [
  ['A','Z','E','R','T','Y','U','I','O','P'],
  ['Q','S','D','F','G','H','J','K','L','M'],
  ['⌫','W','X','C','V','B','N','ENTRÉE'],
]

const MAX_ESSAIS = 6

type Statut = 'correct' | 'present' | 'absent' | 'vide'

function getStatuts(mot: string, essai: string): Statut[] {
  const result: Statut[] = Array(mot.length).fill('absent')
  const restant = [...mot]
  // D'abord les bons placements
  for (let i = 0; i < mot.length; i++) {
    if (essai[i] === mot[i]) { result[i] = 'correct'; restant[restant.indexOf(essai[i])] = '' }
  }
  // Puis les présents
  for (let i = 0; i < mot.length; i++) {
    if (result[i] !== 'correct' && restant.includes(essai[i])) {
      result[i] = 'present'; restant[restant.indexOf(essai[i])] = ''
    }
  }
  return result
}

const COULEURS: Record<Statut, string> = {
  correct: '#3A5220',
  present: '#B45309',
  absent:  '#6B7280',
  vide:    'transparent',
}

export default function MotCacheGame() {
  const [mot]             = useState(() => MOTS[Math.floor(Math.random() * MOTS.length)])
  const [essais, setEssais]   = useState<string[]>([])
  const [courant, setCourant] = useState('')
  const [statuts, setStatuts] = useState<Statut[][]>([])
  const [lettresUsees, setLettresUsees] = useState<Record<string, Statut>>({})
  const [fini, setFini]       = useState(false)
  const [gagne, setGagne]     = useState(false)
  const [shake, setShake]     = useState(false)

  const valider = useCallback(() => {
    if (courant.length !== mot.length) { setShake(true); setTimeout(() => setShake(false), 500); return }
    const s = getStatuts(mot, courant)
    const newEssais = [...essais, courant]
    const newStatuts = [...statuts, s]
    setEssais(newEssais)
    setStatuts(newStatuts)
    setLettresUsees(prev => {
      const next = { ...prev }
      for (let i = 0; i < courant.length; i++) {
        const l = courant[i]
        if (!next[l] || s[i] === 'correct' || (s[i] === 'present' && next[l] === 'absent'))
          next[l] = s[i]
      }
      return next
    })
    if (courant === mot) { setGagne(true); setFini(true) }
    else if (newEssais.length >= MAX_ESSAIS) { setFini(true) }
    setCourant('')
  }, [courant, essais, mot, statuts])

  const taper = useCallback((lettre: string) => {
    if (fini) return
    if (lettre === '⌫') { setCourant(c => c.slice(0, -1)); return }
    if (lettre === 'ENTRÉE') { valider(); return }
    if (courant.length < mot.length) setCourant(c => c + lettre)
  }, [fini, courant, mot, valider])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase()
      if (k === 'BACKSPACE') taper('⌫')
      else if (k === 'ENTER') taper('ENTRÉE')
      else if (/^[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝ]$/.test(k)) taper(k)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [taper])

  const ligne = (idx: number) => {
    const estCourant = idx === essais.length && !fini
    const lettres = estCourant ? courant : (essais[idx] ?? '')
    const s = statuts[idx] ?? []
    return (
      <div key={idx} className={`flex gap-2 ${estCourant && shake ? 'animate-pulse' : ''}`}>
        {Array.from({ length: mot.length }).map((_, i) => {
          const lettre = lettres[i] ?? ''
          const statut: Statut = s[i] ?? 'vide'
          return (
            <div key={i}
              className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl transition-all border-2"
              style={{
                backgroundColor: statut === 'vide' ? 'white' : COULEURS[statut],
                borderColor: lettre && statut === 'vide' ? '#3A5220' : COULEURS[statut],
                color: statut === 'vide' ? '#1F2937' : 'white',
              }}>
              {lettre}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
      <div className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between sticky top-0 z-40">
        <Link to="/jeux" className="text-sm font-bold text-gray-500 hover:text-[#3A5220]">← Jeux</Link>
        <span className="font-black text-gray-900">🔤 Mot caché</span>
        <span className="text-sm text-gray-500">{essais.length}/{MAX_ESSAIS}</span>
      </div>

      <main className="flex-1 flex flex-col items-center px-4 py-6 gap-5">
        <p className="text-xs text-gray-500 font-semibold">
          Trouve le nom de l'animal en {MAX_ESSAIS} essais — {mot.length} lettres
        </p>

        {/* Grille */}
        <div className="flex flex-col gap-2">
          {Array.from({ length: MAX_ESSAIS }).map((_, i) => ligne(i))}
        </div>

        {/* Fin */}
        {fini && (
          <div className={`px-6 py-4 rounded-2xl text-center font-black text-white ${gagne ? '' : 'bg-gray-600'}`}
            style={gagne ? { backgroundColor: '#3A5220' } : {}}>
            {gagne ? `🎉 Bravo ! C'était ${mot}` : `😢 C'était : ${mot}`}
          </div>
        )}

        {/* Clavier */}
        <div className="flex flex-col gap-1.5 w-full max-w-xs">
          {LETTRES_CLAVIER.map((rangee, ri) => (
            <div key={ri} className="flex gap-1 justify-center">
              {rangee.map(l => {
                const statut = lettresUsees[l]
                return (
                  <button key={l} onClick={() => taper(l)}
                    className={`flex-1 min-w-0 h-10 rounded-lg text-xs font-black transition-all active:scale-95 ${l.length > 1 ? 'px-1 text-[10px]' : ''}`}
                    style={{
                      backgroundColor: statut ? COULEURS[statut] : 'white',
                      color: statut ? 'white' : '#1F2937',
                      maxWidth: l.length > 1 ? '52px' : '36px',
                    }}>
                    {l}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {fini && (
          <button onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-2xl font-black text-white hover:opacity-90" style={{ backgroundColor: '#3A5220' }}>
            Nouveau mot
          </button>
        )}
      </main>
    </div>
  )
}
