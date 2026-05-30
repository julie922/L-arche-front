import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

const QUESTIONS = [
  { q: 'Quel est le seul mammifère capable de voler ?',                        choix: ['L\'écureuil', 'La chauve-souris', 'Le loir', 'Le renard volant'], bonne: 1 },
  { q: 'Combien de cœurs a une pieuvre ?',                                      choix: ['1', '2', '3', '5'],                bonne: 2 },
  { q: 'Quel animal dort debout ?',                                              choix: ['Le chat', 'Le cheval', 'Le chien', 'Le lapin'],                   bonne: 1 },
  { q: 'Quelle est la durée de gestation d\'une éléphante ?',                   choix: ['6 mois', '12 mois', '22 mois', '36 mois'],                        bonne: 2 },
  { q: 'Quel oiseau ne peut pas voler mais court très vite ?',                  choix: ['Le pingouin', 'L\'autruche', 'L\'émeu', 'Les deux derniers'],      bonne: 3 },
  { q: 'Comment s\'appelle le petit du cheval ?',                               choix: ['Veau', 'Poulain', 'Faon', 'Chiot'],                                bonne: 1 },
  { q: 'Quel animal a les empreintes digitales les plus similaires à l\'humain ?', choix: ['Le gorille', 'Le koala', 'Le chimpanzé', 'Le singe araignée'],  bonne: 1 },
  { q: 'Combien de pattes a une araignée ?',                                    choix: ['6', '8', '10', '12'],              bonne: 1 },
  { q: 'Quel est l\'animal terrestre le plus rapide ?',                         choix: ['Le guépard', 'Le lion', 'Le lièvre', 'L\'antilope'],               bonne: 0 },
  { q: 'En quelle saison les hérissons hibernent-ils ?',                        choix: ['Été', 'Printemps', 'Automne', 'Hiver'],                            bonne: 3 },
  { q: 'Quel animal est le symbole de la fidélité ?',                           choix: ['Le chat', 'Le chien', 'Le perroquet', 'Le dauphin'],                bonne: 1 },
  { q: 'Comment s\'appelle le groupe de loups ?',                               choix: ['Une meute', 'Un troupeau', 'Un clan', 'Une horde'],                 bonne: 0 },
]

const TEMPS_PAR_QUESTION = 10

export default function SpeedquizGame() {
  const [index, setIndex]       = useState(0)
  const [score, setScore]       = useState(0)
  const [temps, setTemps]       = useState(TEMPS_PAR_QUESTION)
  const [reponse, setReponse]   = useState<number | null>(null)
  const [fini, setFini]         = useState(false)
  const [started, setStarted]   = useState(false)
  const [bonus, setBonus]       = useState(0)

  const suivant = useCallback(() => {
    if (index + 1 >= QUESTIONS.length) { setFini(true); return }
    setIndex(i => i + 1)
    setReponse(null)
    setTemps(TEMPS_PAR_QUESTION)
  }, [index])

  useEffect(() => {
    if (!started || fini || reponse !== null) return
    if (temps <= 0) { suivant(); return }
    const t = setTimeout(() => setTemps(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [started, fini, reponse, temps, suivant])

  const repondre = (i: number) => {
    if (reponse !== null) return
    setReponse(i)
    if (i === QUESTIONS[index].bonne) {
      const pts = 10 + temps
      setScore(s => s + pts)
      setBonus(pts)
    } else setBonus(0)
    setTimeout(suivant, 1200)
  }

  const q = QUESTIONS[index]
  const pct = (temps / TEMPS_PAR_QUESTION) * 100

  if (!started) return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
      <div className="bg-white rounded-3xl shadow-sm p-8 max-w-sm w-full text-center">
        <div className="text-6xl mb-4">⚡</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Speedquiz</h1>
        <p className="text-sm text-gray-500 mb-2">{QUESTIONS.length} questions · 10 secondes chacune</p>
        <p className="text-xs text-gray-400 mb-8">Réponds vite pour gagner des points bonus !</p>
        <button onClick={() => setStarted(true)}
          className="w-full py-4 rounded-2xl font-black text-white text-lg hover:opacity-90" style={{ backgroundColor: '#1D4ED8' }}>
          C'est parti ! ⚡
        </button>
        <Link to="/jeux" className="block mt-4 text-sm text-gray-400">← Retour aux jeux</Link>
      </div>
    </div>
  )

  if (fini) {
    const max = QUESTIONS.length * (10 + TEMPS_PAR_QUESTION)
    const pctScore = Math.round((score / max) * 100)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
        <div className="bg-white rounded-3xl shadow-sm p-8 max-w-sm w-full text-center">
          <div className="text-6xl mb-3">{pctScore >= 70 ? '🏆' : pctScore >= 40 ? '🥈' : '📚'}</div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Score final</h2>
          <p className="text-4xl font-black mb-1" style={{ color: '#1D4ED8' }}>{score} pts</p>
          <p className="text-sm text-gray-400 mb-3">sur {max} pts possibles</p>
          <div className="text-2xl mb-4">
            {pctScore >= 70 ? '⭐⭐⭐' : pctScore >= 40 ? '⭐⭐☆' : '⭐☆☆'}
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            {pctScore >= 70 ? 'Impressionnant ! Tu connais vraiment bien les animaux 🎉'
              : pctScore >= 40 ? 'Pas mal ! Continue à explorer le monde animal 🐾'
              : 'Les animaux ont encore des secrets pour toi. Rejoue !'}
          </p>
          <button onClick={() => { setIndex(0); setScore(0); setTemps(TEMPS_PAR_QUESTION); setReponse(null); setFini(false); setStarted(false) }}
            className="w-full py-3 rounded-2xl font-black text-white mb-3" style={{ backgroundColor: '#1D4ED8' }}>
            Rejouer !
          </button>
          <Link to="/jeux" className="text-sm text-gray-400">← Retour aux jeux</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
      <div className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between sticky top-0 z-40">
        <Link to="/jeux" className="text-sm font-bold text-gray-500 hover:text-[#3A5220]">← Jeux</Link>
        <span className="font-black text-gray-900">⚡ Speedquiz</span>
        <span className="font-black" style={{ color: '#1D4ED8' }}>{score} pts</span>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-5">

        {/* Timer */}
        <div className="w-full max-w-md">
          <div className="flex justify-between text-xs font-black text-gray-500 mb-1">
            <span>Question {index + 1}/{QUESTIONS.length}</span>
            <span className={`text-lg font-black ${temps <= 3 ? 'text-red-500' : 'text-gray-700'}`}>{temps}s</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-3 rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, backgroundColor: temps > 5 ? '#1D4ED8' : temps > 3 ? '#F59E0B' : '#EF4444' }} />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-3xl shadow-sm p-7 w-full max-w-md">
          <p className="text-base font-black text-gray-900 leading-snug mb-6 text-center">{q.q}</p>
          <div className="grid grid-cols-2 gap-3">
            {q.choix.map((c, i) => {
              let style: React.CSSProperties = { backgroundColor: 'white', borderColor: '#E5E7EB', color: '#1F2937' }
              if (reponse !== null) {
                if (i === q.bonne) style = { backgroundColor: '#3A5220', borderColor: '#3A5220', color: 'white' }
                else if (i === reponse) style = { backgroundColor: '#EF4444', borderColor: '#EF4444', color: 'white' }
                else style = { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', color: '#9CA3AF' }
              }
              return (
                <button key={i} onClick={() => repondre(i)}
                  className="p-3 rounded-2xl border-2 text-sm font-bold text-left transition-all active:scale-95 hover:border-[#1D4ED8] leading-tight"
                  style={style}>
                  {c}
                </button>
              )
            })}
          </div>
          {reponse !== null && bonus > 0 && (
            <p className="text-center text-sm font-black mt-3" style={{ color: '#3A5220' }}>+{bonus} pts !</p>
          )}
        </div>
      </main>
    </div>
  )
}
