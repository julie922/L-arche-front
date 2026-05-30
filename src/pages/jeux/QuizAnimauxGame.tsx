import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ESPECES } from '../../data/especes'

const QUESTIONS = [
  { question: 'Quel animal fait "Miaou" ?',           choix: ['🐕 Chien','🐈 Chat','🐇 Lapin','🦜 Perruche'],   bonne: 1 },
  { question: 'Combien de pattes a un chien ?',        choix: ['2 pattes','4 pattes','6 pattes','8 pattes'],      bonne: 1 },
  { question: 'Quel animal pond des œufs ?',           choix: ['Le chat','Le chien','Le perroquet','Le lapin'],    bonne: 2 },
  { question: 'Quel animal est nocturne ?',            choix: ['Le chien','Le lapin','Le hamster','Le chat'],      bonne: 2 },
  { question: 'De quoi se nourrit principalement le lapin ?', choix: ['De viande','De foin et légumes','De poisson','De fruits secs'], bonne: 1 },
  { question: 'Quel animal ronronne quand il est content ?', choix: ['Le chien','Le lapin','Le chat','Le hamster'], bonne: 2 },
  { question: 'Comment s\'appelle le petit du chien ?', choix: ['Chaton','Chiot','Caneton','Poulain'],             bonne: 1 },
  { question: 'Quel animal nage et vit dans un aquarium ?', choix: ['Le hamster','Le lapin','Le poisson','Le gecko'], bonne: 2 },
  { question: 'Quel animal est connu pour son long cou ?', choix: ['L\'éléphant','Le crocodile','La girafe','Le chameau'], bonne: 2 },
  { question: 'Combien de pattes a une araignée ?',    choix: ['4 pattes','6 pattes','8 pattes','10 pattes'],      bonne: 2 },
  { question: 'Quel animal peut changer de couleur ?', choix: ['Le lion','Le caméléon','Le tigre','Le renard'],    bonne: 1 },
  { question: 'Quel son fait le chien ?',              choix: ['Miaou','Cocorico','Ouaf','Meuh'],                  bonne: 2 },
]

// Associer chaque question à un emoji d'espèce quand possible
const EMOJIS = ESPECES.reduce<Record<string, string>>((acc, e) => ({ ...acc, [e.nom]: e.emoji }), {})

export default function QuizAnimauxGame() {
  const [index, setIndex]   = useState(0)
  const [score, setScore]   = useState(0)
  const [reponse, setReponse] = useState<number | null>(null)
  const [fini, setFini]     = useState(false)

  const q = QUESTIONS[index]

  const repondre = (i: number) => {
    if (reponse !== null) return
    setReponse(i)
    if (i === q.bonne) setScore(s => s + 1)
    setTimeout(() => {
      if (index + 1 >= QUESTIONS.length) setFini(true)
      else { setIndex(n => n + 1); setReponse(null) }
    }, 1000)
  }

  if (fini) {
    const pct = Math.round((score / QUESTIONS.length) * 100)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
        <div className="bg-white rounded-3xl shadow-sm p-8 max-w-sm w-full text-center">
          <div className="text-7xl mb-3">{pct >= 80 ? '🏆' : pct >= 50 ? '🎉' : '💪'}</div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">{score} / {QUESTIONS.length}</h2>
          <div className="text-3xl mb-3">{pct >= 80 ? '⭐⭐⭐' : pct >= 50 ? '⭐⭐☆' : '⭐☆☆'}</div>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            {pct >= 80 ? 'Bravo, tu connais super bien les animaux ! 🐾'
              : pct >= 50 ? 'Bien joué ! Continue à découvrir les animaux.'
              : 'Les animaux ont encore des secrets pour toi. Rejoue !'}
          </p>
          <button onClick={() => { setIndex(0); setScore(0); setReponse(null); setFini(false) }}
            className="w-full py-3 rounded-2xl font-black text-white mb-3" style={{ backgroundColor: '#3A5220' }}>
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
        <span className="font-black text-gray-900">🐾 Quiz animaux</span>
        <span className="text-sm text-gray-500">{index + 1}/{QUESTIONS.length}</span>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 gap-5">
        {/* Barre */}
        <div className="w-full max-w-md h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-3 rounded-full transition-all" style={{ width: `${(index / QUESTIONS.length) * 100}%`, backgroundColor: '#3A5220' }} />
        </div>

        {/* Emoji décoratif */}
        <div className="text-7xl select-none">
          {EMOJIS[q.choix[q.bonne].replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim()] ?? '🐾'}
        </div>

        {/* Question */}
        <div className="bg-white rounded-3xl shadow-sm px-7 py-6 w-full max-w-md text-center">
          <p className="text-xl font-black text-gray-900 mb-6 leading-snug">{q.question}</p>
          <div className="grid grid-cols-2 gap-3">
            {q.choix.map((c, i) => {
              let cls = 'bg-gray-50 border-gray-200 text-gray-800 hover:border-[#3A5220] hover:bg-[#E8F0DC]'
              if (reponse !== null) {
                if (i === q.bonne) cls = 'bg-[#3A5220] border-[#3A5220] text-white'
                else if (i === reponse) cls = 'bg-red-100 border-red-300 text-red-700'
                else cls = 'bg-gray-50 border-gray-100 text-gray-300'
              }
              return (
                <button key={i} onClick={() => repondre(i)}
                  className={`py-4 rounded-2xl border-2 font-bold text-sm transition-all active:scale-95 ${cls} ${reponse === null ? 'cursor-pointer' : 'cursor-default'}`}>
                  {c}
                </button>
              )
            })}
          </div>
        </div>
        <p className="text-sm font-bold" style={{ color: '#3A5220' }}>Score : {score} ⭐</p>
      </main>
    </div>
  )
}
