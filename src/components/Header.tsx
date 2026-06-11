import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const location = useLocation()
  const navigate  = useNavigate()
  const { user, logout } = useAuth()

  const linkCls = (path: string) =>
    `text-sm font-semibold transition-colors ${
      location.pathname === path
        ? 'text-[#3A5220]'
        : 'text-gray-600 hover:text-[#3A5220]'
    }`

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = user
    ? ((user.prenom?.[0] ?? '') + (user.nom?.[0] ?? '')).toUpperCase() || '?'
    : ''

  return (
    <nav
      className="w-full bg-white border-b border-gray-100 px-8 h-14 flex items-center justify-between shrink-0 sticky top-0 z-40"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <Link to="/" className="flex items-center">
        <img src="/logo1.png" alt="L'Arche" className="h-8 w-auto" />
      </Link>

      <div className="flex items-center gap-8">
        <Link to="/"               className={linkCls('/')}>Accueil</Link>
        <Link to="/fiches-especes" className={linkCls('/fiches-especes')}>Fiches espèces</Link>
        <Link to="/gardiens"       className={linkCls('/gardiens')}>Trouver un gardien</Link>
        <Link to="/faq"            className={linkCls('/faq')}>Aide</Link>
        <Link to="/jeux"           className={linkCls('/jeux')}>Jeux</Link>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              to={user.role === 'admin' ? '/admin' : user.est_gardien ? '/dashboard' : '/dashboard-proprio'}
              className="flex items-center gap-2 text-sm font-bold hover:text-[#3A5220] transition-colors text-gray-700"
            >
              <div className="w-8 h-8 rounded-full bg-[#D4E6C3] flex items-center justify-center text-xs font-black text-[#3A5220]">
                {initials}
              </div>
              {user.prenom || user.nom}
            </Link>
            <Link
              to="/profil"
              className="text-sm font-semibold text-gray-500 hover:text-[#3A5220] transition-colors"
            >
              Profil
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-bold border-2 border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500 transition-colors"
            >
              Déconnexion
            </button>
          </>
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
