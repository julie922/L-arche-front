import { useState } from 'react'
import { Link } from 'react-router-dom'

const QUESTIONS = [
  { affirmation: 'Un chien peut rester seul plus de 8h sans problème.', vrai: false, explication: 'Non ! Un chien souffre de la solitude. Il ne doit pas rester seul plus de 4 à 6 heures.' },
  { affirmation: 'Les poissons peuvent vivre dans une eau non filtrée.', vrai: false, explication: 'Faux ! Les poissons ont besoin d\'eau propre et filtrée pour rester en bonne santé.' },
  { affirmation: 'Les lapins ont besoin de courir librement chaque jour.', vrai: true,  explication: 'Vrai ! Un lapin doit sortir de sa cage plusieurs heures par jour pour exercer ses pattes.' },
  { affirmation: 'Un chat peut se débrouiller seul pendant les vacances.', vrai: false, explication: 'Faux ! Un chat a besoin de nourriture, d\'eau fraîche et de présence humaine quotidienne.' },
  { affirmation: 'Abandonner un animal est interdit par la loi en France.', vrai: true,  explication: 'Vrai ! L\'abandon d\'animal est puni par la loi. Un animal, c\'est pour la vie.' },
  { affirmation: 'Les hamsters sont des animaux nocturnes.', vrai: true,  explication: 'Vrai ! Les hamsters dorment la journée et sont actifs la nuit. Ne les réveille pas !' },
  { affirmation: 'Un chien heureux n\'a pas besoin de câlins.', vrai: false, explication: 'Faux ! Les câlins et l\'affection sont essentiels pour le bien-être d\'un chien.' },
  { affirmation: 'Les oiseaux de compagnie peuvent être malades si on fume près d\'eux.', vrai: true, explication: 'Vrai ! Les oiseaux sont très sensibles aux fumées. La cigarette peut les tuer.' },
]

export default function VraiFauxGame() {
  const [index, setIndex]       = useState(0)
  const [score, setScore]       = useState(0)
  const [reponse, setReponse]   = useState<boolean | null>(null)
  const [fini, setFini]         = useState(false)

  const q = QUESTIONS[index]

  const repondre = (rep: boolean) => {
    if (reponse !== null) return
    setReponse(rep)
    if (rep === q.vrai) setScore(s => s + 1)
  }

  const suivant = () => {
    if (index + 1 >= QUESTIONS.length) { setFini(true); return }
    setIndex(i => i + 1)
    setReponse(null)
  }

  if (fini) {
    const pct = Math.round((score / QUESTIONS.length) * 100)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
        <div className="bg-white rounded-3xl shadow-sm p-8 max-w-sm w-full text-center">
          <div className="text-6xl mb-3">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚'}</div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">{score} / {QUESTIONS.length}</h2>
          <div className="text-3xl mb-3">
            {pct >= 80 ? '⭐⭐⭐' : pct >= 50 ? '⭐⭐☆' : '⭐☆☆'}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            {pct >= 80 ? 'Bravo ! Tu es un vrai expert des animaux ! Continue à prendre soin d\'eux 🐾'
              : pct >= 50 ? 'Bien joué ! Tu en sais déjà beaucoup sur les animaux. Continue à apprendre !'
              : 'Les animaux ont besoin de nous ! Rejoue pour mieux les connaître.'}
          </p>
          <button onClick={() => { setIndex(0); setScore(0); setReponse(null); setFini(false) }}
            className="w-full py-3 rounded-2xl font-black text-white mb-3" style={{ backgroundColor: '#B45309' }}>
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
        <span className="font-black text-gray-900">🎯 Vrai ou Faux ?</span>
        <span className="text-sm text-gray-500">{index + 1}/{QUESTIONS.length}</span>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        {/* Progression */}
        <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-2 rounded-full transition-all" style={{ width: `${((index) / QUESTIONS.length) * 100}%`, backgroundColor: '#B45309' }} />
        </div>

        {/* Question */}
        <div className="bg-white rounded-3xl shadow-sm p-8 w-full max-w-md text-center">
          <p className="text-4xl mb-4">🤔</p>
          <p className="text-lg font-black text-gray-900 leading-snug mb-8">
            "{q.affirmation}"
          </p>

          {reponse === null ? (
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => repondre(true)}
                className="py-5 rounded-2xl font-black text-white text-xl hover:opacity-90 transition active:scale-95"
                style={{ backgroundColor: '#3A5220' }}>
                ✓ VRAI
              </button>
              <button onClick={() => repondre(false)}
                className="py-5 rounded-2xl font-black text-white text-xl hover:opacity-90 transition active:scale-95"
                style={{ backgroundColor: '#D91B5C' }}>
                ✗ FAUX
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className={`p-4 rounded-2xl text-sm font-bold ${reponse === q.vrai ? 'bg-[#E8F0DC] text-[#3A5220]' : 'bg-red-50 text-red-600'}`}>
                {reponse === q.vrai ? '✓ Bonne réponse !' : '✗ Mauvaise réponse'}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{q.explication}</p>
              <button onClick={suivant}
                className="py-3 rounded-2xl font-black text-white hover:opacity-90" style={{ backgroundColor: '#B45309' }}>
                {index + 1 < QUESTIONS.length ? 'Question suivante →' : 'Voir mon score →'}
              </button>
            </div>
          )}
        </div>

        <p className="text-sm font-bold" style={{ color: '#3A5220' }}>Score : {score} ⭐</p>
      </main>
    </div>
  )
}
