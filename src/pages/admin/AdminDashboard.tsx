import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { api } from '../../services/api'

interface User {
  id: string
  nom: string
  prenom: string | null
  role: string
  ville: string | null
  est_gardien: boolean
  profil_gardien_verifie: boolean
  created_at: string
}

interface Signalement {
  id: string
  statut: 'en_attente' | 'traite' | 'rejete'
}

export default function AdminDashboard() {
  const [users, setUsers]               = useState<User[]>([])
  const [totalUsers, setTotalUsers]     = useState<number | null>(null)
  const [signalements, setSignalements] = useState<Signalement[]>([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, sigRes] = await Promise.all([
          api.get<{ data: User[]; total: number }>('/users?limit=50'),
          api.get<{ data: Signalement[]; total: number }>('/signalements'),
        ])
        setUsers(usersRes.data || [])
        setTotalUsers(usersRes.total)
        setSignalements(sigRes.data || [])
      } catch {
        // Silencieux — affiche des tirets si erreur
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const enAttenteCount = signalements.filter(s => s.statut === 'en_attente').length
  const verifCount     = users.filter(u => u.est_gardien && !u.profil_gardien_verifie).length
  const recentUsers    = [...users].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)

  const ROLE_LABEL: Record<string, string> = {
    utilisateur: 'Propriétaire',
    gardien:     'Gardien',
    admin:       'Admin',
    banni:       'Banni',
  }

  const fmt = (n: number | null) => n === null ? '—' : n.toLocaleString('fr-FR')

  return (
    <AdminLayout title="Tableau de bord">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">👥</span>
            <span className="text-xs font-semibold text-gray-400">total</span>
          </div>
          <p className="text-2xl font-black text-gray-900 mb-0.5">{loading ? '…' : fmt(totalUsers)}</p>
          <p className="text-xs font-semibold text-gray-500">Utilisateurs inscrits</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">⚠️</span>
            <span className="text-xs font-semibold text-gray-400">en attente</span>
          </div>
          <p className="text-2xl font-black text-gray-900 mb-0.5">{loading ? '…' : enAttenteCount}</p>
          <p className="text-xs font-semibold text-gray-500">Signalements à traiter</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">✅</span>
            <span className="text-xs font-semibold text-gray-400">en attente</span>
          </div>
          <p className="text-2xl font-black text-gray-900 mb-0.5">{loading ? '…' : verifCount}</p>
          <p className="text-xs font-semibold text-gray-500">Gardiens à vérifier</p>
        </div>
      </div>

      {/* Grille infos */}
      <div className="grid grid-cols-2 gap-6">

        {/* Derniers inscrits */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-900">Derniers inscrits</h2>
            <a href="/admin/utilisateurs" className="text-xs font-bold hover:underline" style={{ color: '#3A5220' }}>Voir tout</a>
          </div>
          {loading ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Chargement…</div>
          ) : recentUsers.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Aucun utilisateur</div>
          ) : (
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-50">
                {recentUsers.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-bold text-gray-800">{u.prenom ? `${u.prenom} ${u.nom[0]}.` : u.nom}</p>
                      <p className="text-xs text-gray-400">{u.ville || 'Ville non renseignée'}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[#E8F0DC] text-[#3A5220]">
                        {ROLE_LABEL[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-400">
                      {new Date(u.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-3 py-3">
                      {u.profil_gardien_verifie
                        ? <span className="text-xs font-bold text-[#3A5220]">✓ Vérifié</span>
                        : u.est_gardien
                          ? <span className="text-xs font-bold text-amber-500">En attente</span>
                          : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Raccourcis */}
        <div className="flex flex-col gap-4">
          {[
            { icon: '✅', label: `${verifCount} vérification${verifCount !== 1 ? 's' : ''} en attente`,  link: '/admin/verifications', color: '#F59E0B' },
            { icon: '⚠️', label: `${enAttenteCount} signalement${enAttenteCount !== 1 ? 's' : ''} à traiter`, link: '/admin/signalements', color: '#EF4444' },
            { icon: '👥', label: `${fmt(totalUsers)} utilisateurs inscrits`, link: '/admin/utilisateurs', color: '#3A5220' },
            { icon: '⭐', label: 'Gérer les avis gardiens', link: '/admin/avis', color: '#D91B5C' },
          ].map(a => (
            <a key={a.label} href={a.link}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3 hover:shadow-md transition-shadow">
              <span className="text-xl">{a.icon}</span>
              <span className="flex-1 text-sm font-semibold text-gray-700">{a.label}</span>
              <span className="text-lg text-gray-300">›</span>
            </a>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
