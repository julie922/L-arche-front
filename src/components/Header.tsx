import { Link, useLocation } from 'react-router-dom'

interface HeaderProps {
  isConnected?: boolean
}

export default function Header({ isConnected = false }: HeaderProps) {
  const location = useLocation()

  const linkCls = (path: string) =>
    `text-sm font-semibold transition-colors ${
      location.pathname === path
        ? 'text-[#3A5220]'
        : 'text-gray-600 hover:text-[#3A5220]'
    }`

  return (
    <nav
      className="w-full bg-white border-b border-gray-100 px-8 h-14 flex items-center justify-between shrink-0 sticky top-0 z-40"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src="/logo1.png" alt="L'Arche" className="h-8 w-auto" />
      </Link>

      {/* Liens de navigation */}
      <div className="flex items-center gap-8">
        <Link to="/"               className={linkCls('/')}>Accueil</Link>
        <Link to="/fiches-especes" className={linkCls('/fiches-especes')}>Fiches espèces</Link>
        <Link to="/gardiens"       className={linkCls('/gardiens')}>Trouver un gardien</Link>
        <Link to="/faq"            className={linkCls('/faq')}>Aide</Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {isConnected ? (
          <Link
            to="/profil"
            className="flex items-center gap-2 text-sm font-bold hover:text-[#3A5220] transition-colors text-gray-700"
          >
            <div className="w-8 h-8 rounded-full bg-[#D4E6C3] flex items-center justify-center text-xs font-black text-[#3A5220]">
              P
            </div>
            Mon profil
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-sm font-bold border-2 border-gray-300 text-gray-700 hover:border-[#3A5220] hover:text-[#3A5220] transition-colors"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg text-sm font-bold text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#3A5220' }}
            >
              Inscription
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
