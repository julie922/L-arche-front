import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [rememberMe, setRememberMe] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const me = await login(form.email, form.password)
      if (me.role === 'admin') navigate('/admin')
      else if (me.est_gardien) navigate('/dashboard')
      else navigate('/dashboard-proprio')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Identifiants incorrects')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>

      <Header />

      {/* Contenu principal */}
      <main
        className="flex-1 flex flex-col items-center px-4 py-12"
        style={{ backgroundColor: '#F0EBE1' }}
      >
        {/* Tiret bleu décoratif */}
        <div className="w-8 h-[3px] bg-[#4A90D9] rounded-full mb-8" />

        <img src="/logo1.png" alt="L'Arche" className="h-16 w-auto mb-8" />

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm w-full max-w-[480px] px-10 py-8 mb-6">

          {/* Icône patte */}
          <div className="flex justify-center mb-5">
            <span className="text-4xl" style={{ filter: 'grayscale(1) brightness(0.3)' }}>🐾</span>
          </div>

          {/* Titre */}
          <div className="text-center mb-7">
            <h1
              className="text-2xl font-bold text-gray-900 mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Bon retour !
            </h1>
            <p className="text-sm text-gray-500">Connectez-vous à votre espace de L'Arche</p>
          </div>

          {error && (
            <div className="mb-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-800">Email</label>
              <input
                type="email"
                placeholder="camille@email.com"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent transition"
              />
            </div>

            {/* Mot de passe */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-800">Mot de passe</label>
              <input
                type="password"
                placeholder="Votre mot de passe"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent transition"
              />
            </div>

            {/* Se souvenir + Mot de passe oublié */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#3A5220]"
                />
                <span className="text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <a
                href="#"
                className="text-sm font-semibold hover:underline"
                style={{ color: '#D91B5C' }}
              >
                Mot de passe oublié ?
              </a>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#3A5220' }}
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        {/* Lien inscription */}
        <p className="text-sm text-gray-500">
          Pas encore de compte ?{' '}
          <Link
            to="/register"
            className="font-bold hover:underline"
            style={{ color: '#D91B5C' }}
          >
            Créer un compte
          </Link>
        </p>

        {/* Tiret bleu décoratif */}
        <div className="w-8 h-[3px] bg-[#4A90D9] rounded-full mt-8" />
      </main>
    </div>
  )
}
