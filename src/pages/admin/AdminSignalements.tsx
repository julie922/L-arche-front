import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { api } from '../../services/api'

interface Signalement {
  id: string
  signaleur_id: string
  signale_id: string
  raison: string
  description: string | null
  statut: 'en_attente' | 'traite' | 'rejete'
  created_at: string
}

const RAISON_LABEL: Record<string, string> = {
  comportement: 'Comportement',
  avis: 'Avis signalé',
  fraude: 'Fraude',
  harcèlement: 'Harcèlement',
  autre: 'Autre',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR')
}

export default function AdminSignalements() {
  const [signalements, setSignalements] = useState<Signalement[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    api.get<{ data: Signalement[]; total: number }>('/signalements')
      .then(res => setSignalements(res.data || []))
      .catch(err => setError(err instanceof Error ? err.message : 'Erreur'))
      .finally(() => setLoading(false))
  }, [])

  const traiter = async (id: string) => {
    setActionLoading(id)
    try {
      await api.patch(`/signalements/${id}`, { statut: 'traite' })
      setSignalements(prev => prev.map(s => s.id === id ? { ...s, statut: 'traite' } : s))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setActionLoading(null)
    }
  }

  const rejeter = async (id: string) => {
    setActionLoading(id)
    try {
      await api.patch(`/signalements/${id}`, { statut: 'rejete' })
      setSignalements(prev => prev.map(s => s.id === id ? { ...s, statut: 'rejete' } : s))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setActionLoading(null)
    }
  }

  const enAttente = signalements.filter(s => s.statut === 'en_attente')
  const traites   = signalements.filter(s => s.statut !== 'en_attente')

  return (
    <AdminLayout title="Signalements">

      {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <p className="text-sm text-gray-500 mb-5">
        {loading
          ? 'Chargement…'
          : <><span className="font-black text-gray-800">{enAttente.length}</span> signalement{enAttente.length > 1 ? 's' : ''} en attente</>}
      </p>

      {/* En attente */}
      <div className="flex flex-col gap-3 mb-8">
        {!loading && enAttente.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <p className="text-2xl mb-2">✅</p>
            <p className="font-bold text-gray-700">Aucun signalement en attente</p>
          </div>
        )}
        {enAttente.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600">
                    {RAISON_LABEL[s.raison] ?? s.raison}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(s.created_at)}</span>
                </div>
                <p className="text-sm font-bold text-gray-800 mb-0.5">
                  {s.signaleur_id.slice(0, 8)}… → signale → {s.signale_id.slice(0, 8)}…
                </p>
                {s.description && (
                  <p className="text-sm text-gray-600 italic">"{s.description}"</p>
                )}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button type="button" onClick={() => traiter(s.id)} disabled={actionLoading === s.id}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white hover:opacity-90 transition disabled:opacity-50"
                  style={{ backgroundColor: '#3A5220' }}>
                  {actionLoading === s.id ? '…' : '✓ Marquer traité'}
                </button>
                <button type="button" onClick={() => rejeter(s.id)} disabled={actionLoading === s.id}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold border-2 border-gray-200 text-gray-500 hover:bg-gray-50 transition disabled:opacity-50">
                  Rejeter
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Traités */}
      {traites.length > 0 && (
        <div>
          <h2 className="text-sm font-black text-gray-700 tracking-widest uppercase mb-3">Traités</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-50">
                {traites.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 opacity-70">
                    <td className="px-5 py-3 font-semibold text-gray-700 text-xs">
                      {s.signaleur_id.slice(0, 8)}… → {s.signale_id.slice(0, 8)}…
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{formatDate(s.created_at)}</td>
                    <td className="px-4 py-3 text-xs italic text-gray-400">{s.description ?? s.raison}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        s.statut === 'traite' ? 'bg-gray-100 text-gray-500' : 'bg-orange-50 text-orange-400'
                      }`}>
                        {s.statut === 'traite' ? 'Traité' : 'Rejeté'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
