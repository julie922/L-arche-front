import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { api } from '../../services/api'

interface User {
  id: string
  nom: string
  prenom: string | null
  role: string
  ville: string | null
  est_gardien: boolean | null
  profil_gardien_verifie: boolean | null
  created_at: string
}

const ROLE_LABEL: Record<string, string> = {
  utilisateur: 'Utilisateur',
  admin: 'Admin',
  banni: 'Banni',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR')
}

export default function AdminUtilisateurs() {
  const [users, setUsers]           = useState<User[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [search, setSearch]         = useState('')
  const [filterRole, setFilterRole] = useState('tous')
  const [selected, setSelected]     = useState<string | null>(null)
  const [confirmBan, setConfirmBan] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    api.get<{ data: User[]; total: number }>('/users')
      .then(res => setUsers(res.data || []))
      .catch(err => setError(err instanceof Error ? err.message : 'Erreur'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u => {
    const nom = `${u.prenom ?? ''} ${u.nom}`.toLowerCase()
    const matchSearch = nom.includes(search.toLowerCase())
    const matchRole = filterRole === 'tous'
      || (filterRole === 'gardien' && u.est_gardien)
      || (filterRole === 'banni'   && u.role === 'banni')
      || (filterRole === 'admin'   && u.role === 'admin')
    return matchSearch && matchRole
  })

  const banUser = async (id: string) => {
    setActionLoading(true)
    try {
      await api.patch(`/users/${id}/ban`, {})
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: 'banni' } : u))
      setConfirmBan(null)
      setSelected(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du bannissement')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <AdminLayout title="Gestion des utilisateurs">

      {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      {/* Filtres */}
      <div className="flex items-center gap-3 mb-5">
        <input type="text" placeholder="Rechercher un utilisateur..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 max-w-sm focus:outline-none focus:ring-2 focus:ring-[#3A5220]" />
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3A5220]">
          <option value="tous">Tous</option>
          <option value="gardien">Gardiens</option>
          <option value="admin">Admins</option>
          <option value="banni">Bannis</option>
        </select>
        <span className="text-sm text-gray-400 font-semibold">
          {loading ? '…' : `${filtered.length} résultat${filtered.length > 1 ? 's' : ''}`}
        </span>
      </div>

      <div className="flex gap-5">
        {/* Table */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading
            ? <div className="p-8 text-center text-gray-400 text-sm">Chargement...</div>
            : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Utilisateur', 'Rôle', 'Ville', 'Inscrit le', 'Gardien', 'Statut', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-black tracking-widest text-gray-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(u => (
                  <tr key={u.id}
                    onClick={() => setSelected(s => s === u.id ? null : u.id)}
                    className={`cursor-pointer transition-colors ${selected === u.id ? 'bg-[#E8F0DC]' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-800">{[u.prenom, u.nom].filter(Boolean).join(' ')}</p>
                      <p className="text-xs text-gray-400">{u.id.slice(0, 8)}…</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[#E8F0DC] text-[#3A5220]">
                        {ROLE_LABEL[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{u.ville ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-3">
                      {u.est_gardien
                        ? (u.profil_gardien_verifie
                          ? <span className="text-xs font-bold text-[#3A5220]">✓ Vérifié</span>
                          : <span className="text-xs font-bold text-amber-500">En attente</span>)
                        : <span className="text-xs text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        u.role === 'banni' ? 'bg-red-50 text-red-500' : 'bg-[#E8F0DC] text-[#3A5220]'
                      }`}>
                        {u.role === 'banni' ? 'Banni' : 'Actif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">›</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Panel actions */}
        {selected && (() => {
          const u = users.find(x => x.id === selected)
          if (!u) return null
          return (
            <div className="w-60 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 shrink-0">
              <div>
                <p className="font-black text-gray-900">{[u.prenom, u.nom].filter(Boolean).join(' ')}</p>
                <p className="text-xs text-gray-400 mt-0.5">{ROLE_LABEL[u.role] ?? u.role} · {u.ville ?? 'Ville inconnue'}</p>
              </div>
              <div className="flex flex-col gap-2">
                {u.est_gardien && (
                  <a href={`/gardiens/${u.id}`}
                    className="w-full py-2 rounded-xl text-xs font-bold text-center border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition">
                    Voir le profil gardien
                  </a>
                )}
                {u.role !== 'banni' && (
                  <button type="button" onClick={() => setConfirmBan(u.id)}
                    className="w-full py-2 rounded-xl text-xs font-bold bg-red-50 text-red-500 border-2 border-red-100 hover:bg-red-100 transition">
                    Bannir le compte
                  </button>
                )}
                {u.role === 'banni' && (
                  <span className="text-xs text-center text-gray-400">Compte banni</span>
                )}
              </div>
            </div>
          )
        })()}
      </div>

      {/* Modal confirmation ban */}
      {confirmBan && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl">
            <p className="text-lg font-black text-gray-900 mb-2">Bannir ce compte ?</p>
            <p className="text-sm text-gray-500 mb-6">
              L'utilisateur ne pourra plus se connecter.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setConfirmBan(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">
                Annuler
              </button>
              <button type="button" onClick={() => banUser(confirmBan)} disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50">
                {actionLoading ? '…' : 'Bannir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
