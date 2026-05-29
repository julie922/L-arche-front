import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'

const MOCK_USERS = [
  { id: 1, nom: 'Camille Rousseau', email: 'camille@email.com', role: 'proprio',  ville: 'Lyon 3e', inscrit: '10/03/2025', verifie: true,  statut: 'actif'    },
  { id: 2, nom: 'Jules Martin',     email: 'jules@email.com',   role: 'gardien',  ville: 'Lyon 3e', inscrit: '05/02/2025', verifie: true,  statut: 'actif'    },
  { id: 3, nom: 'Sophie Tremblay',  email: 'sophie@email.com',  role: 'les-deux', ville: 'Lyon 1er',inscrit: '12/03/2025', verifie: false, statut: 'actif'    },
  { id: 4, nom: 'Marc Lefebvre',    email: 'marc@email.com',    role: 'proprio',  ville: 'Lyon 7e', inscrit: '01/03/2025', verifie: true,  statut: 'suspendu' },
  { id: 5, nom: 'Léa Robert',       email: 'lea@email.com',     role: 'gardien',  ville: 'Lyon 2e', inscrit: '20/02/2025', verifie: true,  statut: 'actif'    },
]

const ROLE_LABEL: Record<string, string> = { proprio: 'Propriétaire', gardien: 'Gardien', 'les-deux': 'Les deux' }

export default function AdminUtilisateurs() {
  const [users, setUsers]     = useState(MOCK_USERS)
  const [search, setSearch]   = useState('')
  const [filterRole, setFilterRole] = useState('tous')
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  const filtered = users.filter(u => {
    const matchSearch = u.nom.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole   = filterRole === 'tous' || u.role === filterRole
    return matchSearch && matchRole
  })

  const toggleStatut = (id: number) =>
    setUsers(prev => prev.map(u => u.id === id ? { ...u, statut: u.statut === 'actif' ? 'suspendu' : 'actif' } : u))

  const deleteUser = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id))
    setConfirmDelete(null)
    setSelected(null)
  }

  return (
    <AdminLayout title="Gestion des utilisateurs">

      {/* Filtres */}
      <div className="flex items-center gap-3 mb-5">
        <input type="text" placeholder="Rechercher un utilisateur..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm flex-1 max-w-sm focus:outline-none focus:ring-2 focus:ring-[#3A5220]" />
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3A5220]">
          <option value="tous">Tous les rôles</option>
          <option value="proprio">Propriétaires</option>
          <option value="gardien">Gardiens</option>
          <option value="les-deux">Les deux</option>
        </select>
        <span className="text-sm text-gray-400 font-semibold">{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</span>
      </div>

      <div className="flex gap-5">
        {/* Table */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Utilisateur', 'Rôle', 'Ville', 'Inscrit le', 'Vérifié', 'Statut', ''].map(h => (
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
                    <p className="font-bold text-gray-800">{u.nom}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[#E8F0DC] text-[#3A5220]">
                      {ROLE_LABEL[u.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{u.ville}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{u.inscrit}</td>
                  <td className="px-4 py-3">
                    {u.verifie
                      ? <span className="text-xs font-bold text-[#3A5220]">✓ Vérifié</span>
                      : <span className="text-xs font-bold text-amber-500">En attente</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      u.statut === 'actif' ? 'bg-[#E8F0DC] text-[#3A5220]' : 'bg-red-50 text-red-500'
                    }`}>
                      {u.statut === 'actif' ? 'Actif' : 'Suspendu'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">›</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Panel actions */}
        {selected && (() => {
          const u = users.find(x => x.id === selected)!
          return (
            <div className="w-60 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 shrink-0">
              <div>
                <p className="font-black text-gray-900">{u.nom}</p>
                <p className="text-xs text-gray-400">{u.email}</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[#E8F0DC] text-[#3A5220] mt-1 inline-block">
                  {ROLE_LABEL[u.role]}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <a href={`/gardiens/${u.id}`}
                  className="w-full py-2 rounded-xl text-xs font-bold text-center border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition">
                  Voir le profil
                </a>
                <button type="button" onClick={() => toggleStatut(u.id)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                    u.statut === 'actif'
                      ? 'bg-amber-50 text-amber-600 border-2 border-amber-200 hover:bg-amber-100'
                      : 'bg-[#E8F0DC] text-[#3A5220] border-2 border-[#3A5220]/20 hover:bg-[#D4E6C3]'
                  }`}>
                  {u.statut === 'actif' ? 'Suspendre le compte' : 'Réactiver le compte'}
                </button>
                <button type="button" onClick={() => setConfirmDelete(u.id)}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-red-50 text-red-500 border-2 border-red-100 hover:bg-red-100 transition">
                  Supprimer le compte
                </button>
              </div>
            </div>
          )
        })()}
      </div>

      {/* Modal confirmation suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl">
            <p className="text-lg font-black text-gray-900 mb-2">Supprimer ce compte ?</p>
            <p className="text-sm text-gray-500 mb-6">
              Cette action est irréversible. Toutes les données de l'utilisateur seront supprimées.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">
                Annuler
              </button>
              <button type="button" onClick={() => deleteUser(confirmDelete)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
