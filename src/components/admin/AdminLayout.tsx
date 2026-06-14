import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const NAV = [
  { path: '/admin',               icon: '📊', label: 'Tableau de bord' },
  { path: '/admin/utilisateurs',  icon: '👥', label: 'Utilisateurs'    },
  { path: '/admin/verifications', icon: '✅', label: 'Vérifications'   },
  { path: '/admin/gardes',        icon: '🐾', label: 'Gardes en cours' },
  { path: '/admin/signalements',  icon: '⚠️', label: 'Signalements'   },
  { path: '/admin/avis',          icon: '⭐', label: 'Avis'            },
  { path: '/admin/especes',        icon: '🦎', label: 'Espèces'         },
  { path: '/admin/merch',          icon: '🛍️', label: 'Produits'        },
  { path: '/admin/commandes',      icon: '📦', label: 'Commandes'       },
]

export default function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const { pathname } = useLocation()
  const { user } = useAuth()

  const initials = user
    ? ((user.prenom?.[0] ?? '') + (user.nom?.[0] ?? '')).toUpperCase() || 'A'
    : 'A'
  const displayName = user ? (user.prenom || user.nom || 'Admin') : 'Admin'

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col" style={{ backgroundColor: '#2D4A18' }}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <Link to="/"><img src="/logo1.png" alt="L'Arche" className="h-7 w-auto brightness-0 invert opacity-90" /></Link>
          <p className="text-xs font-bold text-white/40 mt-1 tracking-widest">ADMIN</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map(item => {
            const active = pathname === item.path
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active ? 'text-[#2D4A18]' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                style={active ? { backgroundColor: '#A8C539' } : {}}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer sidebar */}
        <div className="px-5 py-4 border-t border-white/10">
          <Link to="/" className="text-xs text-white/40 hover:text-white/70 transition-colors">
            ← Retour au site
          </Link>
        </div>
      </aside>

      {/* Contenu */}
      <div className="flex-1 flex flex-col min-h-screen" style={{ backgroundColor: '#F0EBE1' }}>
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-8 h-14 flex items-center justify-between shrink-0">
          <h1 className="text-base font-black text-gray-900">{title}</h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ backgroundColor: '#D91B5C' }}>
              {initials}
            </div>
            <span className="text-sm font-semibold text-gray-700">{displayName}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
