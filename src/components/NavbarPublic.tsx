import { Link, useLocation } from 'react-router-dom'
import { ESPECES } from '../data/especes'

export default function NavbarPublic() {
  const location = useLocation()
  const especeMatch = ESPECES.find(e => location.pathname.includes(e.id))

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-8 h-14 flex items-center justify-between"
      style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo2.png" alt="L'Arche" className="h-8 w-auto" />
      </Link>
      <div className="flex items-center gap-8">
        <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-[#3A5220] transition-colors">
          Accueil
        </Link>
        <Link to="/fiches-especes" className="text-sm font-semibold text-gray-600 hover:text-[#3A5220] transition-colors">
          Fiches animaux
        </Link>
        {especeMatch && (
          <span className="text-sm font-semibold" style={{ color: '#3A5220' }}>
            {especeMatch.nomComplet}
          </span>
        )}
      </div>
    </nav>
  )
}
