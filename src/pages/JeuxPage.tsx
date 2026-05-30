import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const JEUX = [
  {
    path: '/jeux/memory',
    emoji: '🃏',
    titre: 'Memory des animaux',
    desc: 'Retrouve les paires de cartes cachées !',
    age: '4-12 ans',
    couleur: '#3A5220',
    niveau: 'Tous niveaux',
  },
  {
    path: '/jeux/soin',
    emoji: '❤️',
    titre: 'Prends soin de moi !',
    desc: 'Nourris, promène et câline ton animal virtuel.',
    age: '4-8 ans',
    couleur: '#D91B5C',
    niveau: 'Facile',
  },
  {
    path: '/jeux/associations',
    emoji: '🔗',
    titre: 'Qui mange quoi ?',
    desc: 'Associe chaque animal à ce dont il a besoin.',
    age: '4-8 ans',
    couleur: '#5A7A1A',
    niveau: 'Facile',
  },
  {
    path: '/jeux/vrai-faux',
    emoji: '🎯',
    titre: 'Vrai ou Faux ?',
    desc: 'Teste tes connaissances sur les animaux !',
    age: '7-12 ans',
    couleur: '#B45309',
    niveau: 'Intermédiaire',
  },
  {
    path: '/jeux/quiz',
    emoji: '🧠',
    titre: 'Quiz des champions',
    desc: 'Deviens un expert de la protection animale.',
    age: '8-12 ans',
    couleur: '#1D4ED8',
    niveau: 'Avancé',
  },
  {
    path: '/jeux/quiz-animaux',
    emoji: '🐾',
    titre: 'Quiz animaux',
    desc: 'Questions simples sur les animaux avec images. Parfait pour les petits !',
    age: '4-8 ans',
    couleur: '#3A5220',
    niveau: 'Très facile',
  },
  {
    path: '/jeux/devinette',
    emoji: '🌫️',
    titre: 'Devinette mystère',
    desc: 'Une silhouette floue se révèle progressivement. Devine avant la révélation !',
    age: 'Tous âges',
    couleur: '#6B7280',
    niveau: 'Réflexion',
  },
  {
    path: '/jeux/puzzle',
    emoji: '🧩',
    titre: 'Puzzle d\'animaux',
    desc: 'Reconstitue l\'image en échangeant les pièces. 3×3 ou 4×4.',
    age: '5-12 ans',
    couleur: '#065F46',
    niveau: 'Logique',
  },
  {
    path: '/jeux/tri',
    emoji: '🎯',
    titre: 'Jeu de tri',
    desc: 'Des animaux apparaissent un par un, trie-les vite dans la bonne catégorie !',
    age: '4-10 ans',
    couleur: '#B45309',
    niveau: 'Réflexes',
  },
  {
    path: '/jeux/mot-cache',
    emoji: '🔤',
    titre: 'Mot caché',
    desc: 'Devine le nom de l\'animal en 6 essais. Vert = bonne place, orange = mauvaise place.',
    age: 'Tous âges',
    couleur: '#065F46',
    niveau: 'Tous niveaux',
  },
  {
    path: '/jeux/speedquiz',
    emoji: '⚡',
    titre: 'Speedquiz',
    desc: '12 questions, 10 secondes chacune. Réponds vite pour gagner des points bonus !',
    age: '12+ ans',
    couleur: '#1D4ED8',
    niveau: 'Rapide',
  },
  {
    path: '/jeux/qui-suis-je',
    emoji: '🧩',
    titre: 'Qui suis-je ?',
    desc: 'Découvre des indices progressifs et devine l\'animal mystère.',
    age: 'Tous âges',
    couleur: '#8B5CF6',
    niveau: 'Réflexion',
  },
]

export default function JeuxPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Header />

      {/* Hero */}
      <section className="px-8 pt-14 pb-10 text-center" style={{ backgroundColor: '#3A5220' }}>
        <p className="text-4xl mb-3">🐾🎮🐾</p>
        <h1 className="text-4xl font-black text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Les jeux de L'Arche
        </h1>
        <p className="text-white/80 text-base max-w-lg mx-auto">
          Joue et apprends à prendre soin des animaux.<br />
          Parce que chaque animal mérite d'être heureux ! 🐕🐈🐇
        </p>
      </section>

      {/* Grille jeux */}
      <main className="flex-1 px-6 py-10" style={{ backgroundColor: '#F0EBE1' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {JEUX.map(j => (
            <Link key={j.path} to={j.path}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="h-28 flex items-center justify-center text-6xl"
                style={{ backgroundColor: j.couleur + '20' }}>
                {j.emoji}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: j.couleur }}>
                    {j.age}
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">{j.niveau}</span>
                </div>
                <h2 className="text-base font-black text-gray-900 mt-2 mb-1">{j.titre}</h2>
                <p className="text-sm text-gray-500">{j.desc}</p>
                <div className="mt-4 flex items-center gap-1 font-black text-sm" style={{ color: j.couleur }}>
                  Jouer →
                </div>
              </div>
            </Link>
          ))}
        </div>

      </main>
      <Footer />
    </div>
  )
}
