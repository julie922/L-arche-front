import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { ESPECES, CATEGORIES } from '../data/especes'

const HERO_EMOJIS = ['🐕', '🐈', '🐇', '🐹']

function Wave() {
  return (
    <div className="w-full overflow-hidden leading-none" style={{ marginBottom: '-2px' }}>
      <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 md:h-20">
        <path fill="#F0EBE1" d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" />
      </svg>
    </div>
  )
}

function Footer() {
  return (
    <footer style={{ backgroundColor: '#3A5220', fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-5xl mx-auto px-8 py-6 border-t border-white/20 flex justify-between items-center">
        <span className="text-sm text-white/70">2025 L'Arche · Association loi 1901</span>
        <span className="text-sm font-semibold" style={{ color: '#A8C539' }}>Pour les animaux</span>
      </div>
    </footer>
  )
}

export default function FichesEspecesPage() {
  const [categorie, setCategorie] = useState<string>('tous')

  const filtered = categorie === 'tous'
    ? ESPECES
    : ESPECES.filter(e => e.categorie === categorie)

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Header />

      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="relative flex flex-col items-center justify-center pt-16 pb-0 px-8 text-center"
        style={{ backgroundColor: '#3A5220', minHeight: '280px' }}>

        {/* Silhouettes décoratives */}
        <div className="absolute inset-0 flex items-center justify-between px-16 pointer-events-none select-none">
          <div className="flex items-center gap-6">
            {HERO_EMOJIS.slice(0, 2).map((e, i) => (
              <span key={i} className="text-7xl opacity-60" style={{ filter: 'brightness(0) saturate(100%) invert(80%) sepia(40%) saturate(400%) hue-rotate(55deg)' }}>
                {e}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-6">
            {HERO_EMOJIS.slice(2).map((e, i) => (
              <span key={i} className="text-7xl opacity-60" style={{ filter: 'brightness(0) saturate(100%) invert(80%) sepia(40%) saturate(400%) hue-rotate(55deg)' }}>
                {e}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs font-black tracking-widest mb-3" style={{ color: '#A8C539' }}>RESSOURCES</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Fiches espèces
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Comportement, alimentation, besoins, tout ce qu'il faut savoir<br />
            pour garder chaque animal dans les meilleures conditions.
          </p>
        </div>

        <Wave />
      </div>

      {/* ── Contenu ───────────────────────────────────────── */}
      <main className="flex-1 px-4 py-10" style={{ backgroundColor: '#F0EBE1' }}>
        <div className="max-w-4xl mx-auto">

          {/* Filtres */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map(cat => (
              <button key={cat.id} type="button"
                onClick={() => setCategorie(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                  categorie === cat.id
                    ? 'text-white border-transparent'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
                style={categorie === cat.id ? { backgroundColor: '#D91B5C', borderColor: '#D91B5C' } : {}}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grille */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map(espece => (
              <Link key={espece.id} to={`/fiches-especes/${espece.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                {/* Zone icône */}
                <div className="flex items-center justify-center h-28 rounded-t-2xl"
                  style={{ backgroundColor: '#D4E6C3' }}>
                  <span className="text-5xl" style={{ filter: 'brightness(0) saturate(100%) invert(23%) sepia(38%) saturate(700%) hue-rotate(77deg) brightness(75%) contrast(90%)' }}>
                    {espece.emoji}
                  </span>
                </div>
                {/* Texte */}
                <div className="px-3 py-3">
                  <p className="font-black text-gray-900 text-sm mb-0.5">{espece.nom}</p>
                  <p className="text-xs text-gray-500 leading-tight">{espece.tags}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
