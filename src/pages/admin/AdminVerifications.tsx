import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { api } from '../../services/api'

interface User {
  id: string
  nom: string
  prenom: string | null
  est_gardien: boolean | null
  profil_gardien_verifie: boolean | null
  created_at: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR')
}

export default function AdminVerifications() {
  const [users, setUsers]           = useState<User[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showRefus, setShowRefus]   = useState<string | null>(null)
  const [motifRefus, setMotifRefus] = useState('')

  useEffect(() => {
    api.get<{ data: User[]; total: number }>('/users')
      .then(res => setUsers(res.data || []))
      .catch(err => setError(err instanceof Error ? err.message : 'Erreur'))
      .finally(() => setLoading(false))
  }, [])

  const enAttente = users.filter(u => u.est_gardien && !u.profil_gardien_verifie)
  const valides   = users.filter(u => u.est_gardien && u.profil_gardien_verifie)

  const valider = async (id: string) => {
    setActionLoading(id)
    try {
      await api.patch(`/users/${id}/verify-gardien`, {})
      setUsers(prev => prev.map(u => u.id === id ? { ...u, profil_gardien_verifie: true } : u))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setActionLoading(null)
    }
  }

  const refuser = async (id: string) => {
    setActionLoading(id)
    try {
      await api.patch(`/users/${id}/ban`, {})
      setUsers(prev => prev.map(u => u.id === id ? { ...u, profil_gardien_verifie: false, est_gardien: false } : u))
      setShowRefus(null)
      setMotifRefus('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <AdminLayout title="Vérifications d'identité">

      {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <p className="text-sm text-gray-500 mb-5">
        {loading
          ? 'Chargement…'
          : <><span className="font-black text-gray-800">{enAttente.length}</span> vérification{enAttente.length > 1 ? 's' : ''} en attente de traitement</>}
      </p>

      <div className="flex flex-col gap-4 mb-8">
        <h2 className="text-sm font-black text-gray-700 tracking-widest uppercase">En attente</h2>

        {!loading && enAttente.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <p className="text-2xl mb-2">✅</p>
            <p className="font-bold text-gray-700">Toutes les vérifications sont traitées</p>
          </div>
        )}

        {enAttente.map(u => (
          <div key={u.id} className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5 flex items-start gap-5">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-lg shrink-0">👤</div>
            <div className="flex-1">
              <p className="font-black text-gray-900">{[u.prenom, u.nom].filter(Boolean).join(' ')}</p>
              <p className="text-xs text-gray-400 mb-1">Gardien · Inscrit le {formatDate(u.created_at)}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">📄 Vérification en attente</span>
              </div>
              <div className="w-full h-24 bg-gray-100 rounded-xl flex items-center justify-center mb-3 border border-gray-200">
                <span className="text-xs text-gray-400">Document d'identité (chargé depuis le serveur)</span>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => valider(u.id)} disabled={actionLoading === u.id}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition disabled:opacity-50"
                  style={{ backgroundColor: '#3A5220' }}>
                  {actionLoading === u.id ? '…' : '✓ Valider'}
                </button>
                <button type="button" onClick={() => { setShowRefus(u.id); setMotifRefus('') }}
                  className="px-5 py-2 rounded-xl text-xs font-bold border-2 border-red-200 text-red-500 hover:bg-red-50 transition">
                  ✕ Refuser
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gardiens validés */}
      {valides.length > 0 && (
        <div>
          <h2 className="text-sm font-black text-gray-700 tracking-widest uppercase mb-3">Validés récemment</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-50">
                {valides.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-semibold text-gray-800">{[u.prenom, u.nom].filter(Boolean).join(' ')}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E8F0DC] text-[#3A5220]">
                        ✓ Validé
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal refus */}
      {showRefus && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl">
            <p className="text-lg font-black text-gray-900 mb-1">Motif du refus</p>
            <p className="text-sm text-gray-500 mb-4">Le compte gardien sera désactivé.</p>
            <textarea rows={3} value={motifRefus} onChange={e => setMotifRefus(e.target.value)}
              placeholder="Document illisible, pièce expirée..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#3A5220] mb-4" />
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowRefus(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600">
                Annuler
              </button>
              <button type="button" onClick={() => refuser(showRefus)} disabled={!!actionLoading}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50">
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
