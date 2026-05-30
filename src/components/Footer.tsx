import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#3A5220', fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-5xl mx-auto px-8 py-10 grid grid-cols-4 gap-8">
        <div className="col-span-1">
          <img src="/logo1.png" alt="L'Arche" className="h-8 w-auto mb-3 brightness-0 invert opacity-90" />
          <p className="text-xs text-white/60 leading-relaxed">
            Association loi 1901<br />Lyon, France · 2021
          </p>
        </div>
        {[
          { titre: 'Navigation', liens: [{ label: 'Trouver un gardien', to: '/gardiens' }, { label: 'Fiches espèces', to: '/fiches-especes' }, { label: 'Boutique', to: '/merch' }] },
          { titre: 'Compte',     liens: [{ label: 'Se connecter', to: '/login' }, { label: "S'inscrire", to: '/register' }, { label: 'Mon profil', to: '/profil' }] },
          { titre: 'Aide',       liens: [{ label: 'FAQ', to: '/faq' }, { label: 'Jeux', to: '/jeux' }, { label: 'Contact', to: '/faq' }] },
        ].map(col => (
          <div key={col.titre}>
            <p className="text-xs font-black tracking-widest mb-3" style={{ color: '#A8C539' }}>{col.titre.toUpperCase()}</p>
            <ul className="flex flex-col gap-2">
              {col.liens.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-white/70 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-5xl mx-auto px-8 py-4 border-t border-white/10 flex justify-between items-center">
        <span className="text-xs text-white/50">2025 L'Arche · Association loi 1901</span>
        <span className="text-xs font-semibold" style={{ color: '#A8C539' }}>Pour les animaux 🐾</span>
      </div>
    </footer>
  )
}
