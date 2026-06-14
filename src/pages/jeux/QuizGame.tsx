import { useState } from 'react'
import { Link } from 'react-router-dom'

const QUESTIONS = [
  {
    question: 'Combien de fois par jour doit-on nourrir un chien adulte ?',
    choix: ['1 fois', '2 fois', '4 fois', '6 fois'],
    bonne: 1,
    explication: 'Un chien adulte doit manger 2 fois par jour, matin et soir, à heures fixes.',
  },
  {
    question: 'Qu\'est-ce qu\'un animal de compagnie ressent quand on l\'abandonne ?',
    choix: ['Rien du tout', 'De la joie', 'De la tristesse et du stress', 'De la colère uniquement'],
    bonne: 2,
    explication: 'Un animal abandonné souffre énormément. Il ressent stress, tristesse et incompréhension.',
  },
  {
    question: 'Quelle nourriture est DANGEREUSE pour les chiens ?',
    choix: ['Les croquettes', 'Le chocolat', 'La viande cuite', 'Les carottes'],
    bonne: 1,
    explication: 'Le chocolat est toxique pour les chiens ! Il peut provoquer des convulsions.',
  },
  {
    question: 'Combien d\'animaux sont abandonnés chaque été en France ?',
    choix: ['1 000', '10 000', '50 000', '100 000'],
    bonne: 3,
    explication: '100 000 animaux sont abandonnés chaque été en France. C\'est pourquoi L\'Arche existe !',
  },
  {
    question: 'Un chat a besoin de combien de litres d\'eau par jour ?',
    choix: ['0 (il ne boit pas)', '50 ml', '200 ml', '1 litre'],
    bonne: 2,
    explication: 'Un chat doit boire environ 200 ml d\'eau par jour. L\'eau doit toujours être fraîche !',
  },
  {
    question: 'Quelle est la meilleure façon d\'aider un animal abandonné ?',
    choix: ['L\'ignorer', 'Le prendre sans réfléchir', 'Contacter un refuge ou une association', 'Lui donner à manger et partir'],
    bonne: 2,
    explication: 'Contacte toujours un refuge ou une association comme L\'Arche pour aider un animal trouvé.',
  },
  {
    question: 'Pourquoi ne faut-il pas laisser son animal seul pendant les vacances ?',
    choix: ['Parce que la loi l\'interdit', 'Parce qu\'il peut souffrir et tomber malade', 'Parce qu\'il mange trop', 'Ce n\'est pas grave de le laisser seul'],
    bonne: 1,
    explication: 'Un animal laissé seul peut souffrir, tomber malade ou ne plus avoir à manger. Il compte sur toi !',
  },
  {
    question: 'Que veut dire "adopter un animal pour la vie" ?',
    choix: ['Le garder 1 an', 'S\'en occuper jusqu\'à sa mort', 'Le laisser dehors', 'L\'offrir à quelqu\'un'],
    bonne: 1,
    explication: 'Adopter un animal, c\'est s\'engager à en prendre soin toute sa vie, même pendant les vacances !',
  },
]

export default function QuizGame() {
  const [index, setIndex]     = useState(0)
  const [score, setScore]     = useState(0)
  const [choix, setChoix]     = useState<number | null>(null)
  const [fini, setFini]       = useState(false)

  const q = QUESTIONS[index]

  const repondre = (i: number) => {
    if (choix !== null) return
    setChoix(i)
    if (i === q.bonne) setScore(s => s + 1)
  }

  const suivant = () => {
    if (index + 1 >= QUESTIONS.length) { setFini(true); return }
    setIndex(i => i + 1)
    setChoix(null)
  }

  if (fini) {
    const pct = Math.round((score / QUESTIONS.length) * 100)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
        <div className="bg-white rounded-3xl shadow-sm p-8 max-w-sm w-full text-center">
          <div className="text-7xl mb-3">{pct >= 80 ? '🏆' : pct >= 60 ? '🥈' : '📚'}</div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">
            {pct >= 80 ? 'Champion des animaux !' : pct >= 60 ? 'Très bien !' : 'Continue à apprendre !'}
          </h2>
          <p className="text-3xl mb-2">
            {pct >= 80 ? '⭐⭐⭐' : pct >= 60 ? '⭐⭐☆' : '⭐☆☆'}
          </p>
          <p className="text-lg font-black mb-1" style={{ color: '#1D4ED8' }}>{score} / {QUESTIONS.length} bonnes réponses</p>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            {pct >= 80
              ? 'Félicitations ! Tu es un vrai protecteur des animaux. Parle de L\'Arche autour de toi ! 🐾'
              : 'Chaque bonne réponse, c\'est un animal mieux compris. Continue à apprendre et à protéger !'}
          </p>
          <button onClick={() => { setIndex(0); setScore(0); setChoix(null); setFini(false) }}
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
        <span className="font-black text-gray-900">🧠 Quiz des champions</span>
        <span className="text-sm text-gray-500">{index + 1}/{QUESTIONS.length}</span>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-5">
        {/* Progression */}
        <div className="w-full max-w-lg h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${(index / QUESTIONS.length) * 100}%`, backgroundColor: '#1D4ED8' }} />
        </div>

        {/* Question */}
        <div className="bg-white rounded-3xl shadow-sm p-7 w-full max-w-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-black px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#1D4ED8' }}>
              Question {index + 1}
            </span>
            <span className="text-xs text-gray-400">{score} ⭐ pour l'instant</span>
          </div>

          <p className="text-base font-black text-gray-900 leading-snug mb-5">{q.question}</p>

          <div className="flex flex-col gap-2.5">
            {q.choix.map((c, i) => {
              let bg = 'bg-gray-50 border-gray-200 text-gray-700 hover:border-[#1D4ED8]'
              if (choix !== null) {
                if (i === q.bonne) bg = 'bg-[#E8F0DC] border-[#3A5220] text-[#3A5220]'
                else if (i === choix && choix !== q.bonne) bg = 'bg-red-50 border-red-300 text-red-600'
                else bg = 'bg-gray-50 border-gray-100 text-gray-400'
              }
              return (
                <button key={i} onClick={() => repondre(i)}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl border-2 font-semibold text-sm transition-all ${bg} ${choix === null ? 'hover:-translate-y-0.5 active:scale-95' : 'cursor-default'}`}>
                  <span className="font-black mr-2 text-gray-400">{String.fromCharCode(65 + i)}.</span>
                  {c}
                </button>
              )
            })}
          </div>

          {choix !== null && (
            <div className="mt-4">
              <div className={`p-3 rounded-xl text-xs font-semibold mb-3 ${choix === q.bonne ? 'bg-[#E8F0DC] text-[#3A5220]' : 'bg-red-50 text-red-600'}`}>
                {choix === q.bonne ? '✓ Bonne réponse !' : `✗ La bonne réponse était : "${q.choix[q.bonne]}"`}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{q.explication}</p>
              <button onClick={suivant}
                className="w-full py-3 rounded-2xl font-black text-white hover:opacity-90" style={{ backgroundColor: '#1D4ED8' }}>
                {index + 1 < QUESTIONS.length ? 'Question suivante →' : 'Voir mon score →'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
