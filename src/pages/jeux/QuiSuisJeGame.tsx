import { useState } from 'react'
import { Link } from 'react-router-dom'

const ANIMAUX = [
  {
    nom: 'Le Dauphin',
    emoji: '🐬',
    indices: [
      'Je vis dans l\'eau mais je ne suis pas un poisson.',
      'Je suis un mammifère et je dois remonter à la surface pour respirer.',
      'Je communique avec mes congénères par des clics et des sifflements.',
      'Je suis connu pour mon intelligence et ma capacité à apprendre des tricks.',
      'Je nage souvent près des bateaux et j\'adore sauter hors de l\'eau.',
    ],
  },
  {
    nom: 'Le Caméléon',
    emoji: '🦎',
    indices: [
      'Je suis un reptile qui vit dans les arbres.',
      'Mes yeux peuvent bouger indépendamment l\'un de l\'autre.',
      'Ma langue est plus longue que mon corps.',
      'Je peux changer de couleur selon mon humeur et la température.',
      'Je suis souvent gardé comme animal de compagnie exotique.',
    ],
  },
  {
    nom: 'La Pieuvre',
    emoji: '🐙',
    indices: [
      'Je vis dans l\'océan et j\'ai 8 bras.',
      'J\'ai 3 cœurs et mon sang est bleu.',
      'Je peux changer de couleur et de texture instantanément.',
      'Je suis considéré comme l\'un des invertébrés les plus intelligents.',
      'Je peux m\'échapper de presque n\'importe quel aquarium fermé.',
    ],
  },
  {
    nom: 'Le Fennec',
    emoji: '🦊',
    indices: [
      'Je suis le plus petit canidé du monde.',
      'Je vis dans le désert du Sahara.',
      'Mes oreilles sont énormes par rapport à ma tête.',
      'Je suis nocturne et je supporte des températures extrêmes.',
      'Certains me gardent comme animal de compagnie, mais c\'est controversé.',
    ],
  },
  {
    nom: 'Le Koala',
    emoji: '🐨',
    indices: [
      'Je vis exclusivement en Australie.',
      'Je dors jusqu\'à 22 heures par jour.',
      'Je ne bois presque jamais d\'eau.',
      'Je me nourris uniquement de feuilles d\'eucalyptus.',
      'Mes empreintes digitales ressemblent à celles des humains.',
    ],
  },
  {
    nom: 'Le Platypus',
    emoji: '🦆',
    indices: [
      'Je suis un mammifère mais je ponds des œufs.',
      'J\'ai un bec comme un canard mais je ne suis pas un oiseau.',
      'Je vis en Australie, dans les rivières et lacs.',
      'Le mâle possède un éperon venimeux sur les pattes arrière.',
      'Je suis l\'un des rares mammifères capables de détecter les champs électriques.',
    ],
  },
]

export default function QuiSuisJeGame() {
  const [animalIdx, setAnimalIdx] = useState(() => Math.floor(Math.random() * ANIMAUX.length))
  const [indiceVisible, setIndiceVisible] = useState(0)
  const [guess, setGuess]   = useState('')
  const [essais, setEssais] = useState<{ texte: string; correct: boolean }[]>([])
  const [trouve, setTrouve] = useState(false)
  const [abandon, setAbandon] = useState(false)

  const animal = ANIMAUX[animalIdx]
  const score = Math.max(0, 5 - essais.filter(e => !e.correct).length) + Math.max(0, 5 - indiceVisible)

  const deviner = () => {
    const g = guess.trim().toUpperCase()
    if (!g) return
    const correct = animal.nom.toUpperCase().includes(g) || g.includes(animal.nom.split(' ').pop()!.toUpperCase())
    const newEssais = [...essais, { texte: guess, correct }]
    setEssais(newEssais)
    setGuess('')
    if (correct) setTrouve(true)
    else if (indiceVisible < animal.indices.length - 1) setIndiceVisible(i => i + 1)
  }

  const rejouer = () => {
    setAnimalIdx(Math.floor(Math.random() * ANIMAUX.length))
    setIndiceVisible(0)
    setEssais([])
    setGuess('')
    setTrouve(false)
    setAbandon(false)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>
      <div className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between sticky top-0 z-40">
        <Link to="/jeux" className="text-sm font-bold text-gray-500 hover:text-[#3A5220]">← Jeux</Link>
        <span className="font-black text-gray-900">🧩 Qui suis-je ?</span>
        <span className="text-sm font-bold" style={{ color: '#8B5CF6' }}>Indice {indiceVisible + 1}/5</span>
      </div>

      <main className="flex-1 flex flex-col items-center px-4 py-8 gap-5">
        <div className="w-full max-w-md flex flex-col gap-4">

          {/* Indices révélés */}
          <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col gap-3">
            <p className="text-xs font-black tracking-widest text-gray-400 uppercase">Indices</p>
            {animal.indices.slice(0, indiceVisible + 1).map((indice, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ backgroundColor: '#8B5CF6' }}>
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{indice}</p>
              </div>
            ))}
            {!trouve && !abandon && indiceVisible < animal.indices.length - 1 && (
              <button onClick={() => setIndiceVisible(i => i + 1)}
                className="text-xs font-bold text-center pt-1 hover:underline" style={{ color: '#8B5CF6' }}>
                + Voir l'indice suivant (−1 point)
              </button>
            )}
          </div>

          {/* Essais passés */}
          {essais.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {essais.map((e, i) => (
                <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                  e.correct ? 'bg-[#E8F0DC] text-[#3A5220]' : 'bg-red-50 text-red-500'
                }`}>
                  {e.correct ? '✓' : '✗'} {e.texte}
                </div>
              ))}
            </div>
          )}

          {/* Résultat final */}
          {(trouve || abandon) && (
            <div className="bg-white rounded-3xl shadow-sm p-6 text-center">
              <div className="text-6xl mb-3">{animal.emoji}</div>
              <h2 className="text-xl font-black text-gray-900 mb-1">{animal.nom}</h2>
              {trouve ? (
                <>
                  <div className="text-2xl mb-2">{'⭐'.repeat(Math.min(3, Math.ceil(score / 3)))}</div>
                  <p className="text-sm font-bold mb-3" style={{ color: '#8B5CF6' }}>Score : {score} points</p>
                  <p className="text-sm text-gray-500">
                    {score >= 8 ? 'Excellent ! Tu as trouvé rapidement 🎉'
                      : score >= 5 ? 'Bien joué ! Tu y es arrivé 👏'
                      : 'Trouvé ! La prochaine fois tu iras plus vite 😉'}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">C'était l'animal mystère. Rejoue pour te rattraper !</p>
              )}
              <button onClick={rejouer}
                className="mt-4 w-full py-3 rounded-2xl font-black text-white hover:opacity-90"
                style={{ backgroundColor: '#8B5CF6' }}>
                Nouvel animal
              </button>
            </div>
          )}

          {/* Input */}
          {!trouve && !abandon && (
            <div className="bg-white rounded-3xl shadow-sm p-4 flex flex-col gap-3">
              <p className="text-sm font-black text-gray-800">Ta réponse :</p>
              <div className="flex gap-2">
                <input type="text" value={guess} onChange={e => setGuess(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && deviner()}
                  placeholder="Quel animal suis-je ?"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent" />
                <button onClick={deviner}
                  className="px-5 py-3 rounded-xl font-black text-white hover:opacity-90"
                  style={{ backgroundColor: '#8B5CF6' }}>
                  →
                </button>
              </div>
              <button onClick={() => setAbandon(true)} className="text-xs text-gray-400 hover:text-gray-600 text-center">
                Je donne ma langue au chat 😅
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
