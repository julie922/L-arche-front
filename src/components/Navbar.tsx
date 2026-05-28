import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="flex h-[72px] w-full shadow-sm">
      <div className="bg-[#2D5A3D] w-[300px] flex items-center px-8 shrink-0">
        <Link to="/" className="text-white text-2xl font-bold tracking-wide">
          L'Arche
        </Link>
      </div>
      <div className="flex-1 bg-white border-b border-gray-200 flex items-center justify-end px-10 gap-8">
        <Link to="/" className="text-gray-600 hover:text-[#2D5A3D] font-medium transition-colors">
          Accueil
        </Link>
        <Link to="/login" className="text-gray-600 hover:text-[#2D5A3D] font-medium transition-colors">
          Connexion
        </Link>
        <Link
          to="/register"
          className="bg-[#2D5A3D] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#245033] transition-colors"
        >
          S'inscrire
        </Link>
      </div>
    </nav>
  )
}
