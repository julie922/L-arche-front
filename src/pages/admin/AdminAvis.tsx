import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { api } from '../../services/api'

interface Avis {
  id: string
  auteur_id: string
  cible_id: string
  note: number
  commentaire: string | null
  recommande: boolean | null
  created_at: string
  reservation_id: string
}

export default function AdminAvis() {
  const [avis, setAvis]     = useState<Avis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')
  const [filtre, setFiltre] = useState<'tous' | 'negatifs'>('negatifs')
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get<{ data: Avis[]; total: number }>('/reviews')
      setAvis(res.data || [])
    } catch {
      setError('Impossible de charger les avis.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const supprimer = async (id: string) => {
    setDeleting(id)
    try {
      await api.delete(`/reviews/${id}`)
      setAvis(prev => prev.filter(a => a.id !== id))
    } catch {
      setError('Erreur lors de la suppression.')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = filtre === 'negatifs' ? avis.filter(a => a.note <= 2) : avis

  return (
    <AdminLayout title="Gestion des avis">

      <div className="flex gap-2 mb-5">
        {(['negatifs', 'tous'] as const).map(f => (
          <button key={f} type="button" onClick={() => setFiltre(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
              filtre === f ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-600'
            }`}
            style={filtre === f ? { backgroundColor: '#3A5220' } : {}}>
            {f === 'negatifs' ? `⚠️ Négatifs ≤ 2★ (${avis.filter(a => a.note <= 2).length})` : `Tous (${avis.length})`}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 text-gray-400 text-sm">Chargement…</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(a => (
            <div key={a.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${a.note <= 2 ? 'border-red-100' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className="text-xs" style={{ color: i <= a.note ? '#F59E0B' : '#D1D5DB' }}>★</span>
                      ))}
                    </span>
                    <span className="text-xs font-bold text-gray-500">{a.note}/5</span>
                    {a.recommande !== null && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.recommande ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        {a.recommande ? '👍 Recommande' : '👎 Ne recommande pas'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    {new Date(a.created_at).toLocaleDateString('fr-FR')}
                    {' · '}auteur : <span className="font-mono text-xs">{a.auteur_id.slice(0, 8)}…</span>
                    {' → '}gardien : <span className="font-mono text-xs">{a.cible_id.slice(0, 8)}…</span>
                  </p>
                  {a.commentaire && (
                    <p className="text-sm text-gray-700 italic">"{a.commentaire}"</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => supprimer(a.id)}
                  disabled={deleting === a.id}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-500 border-2 border-red-100 hover:bg-red-100 transition disabled:opacity-50 shrink-0"
                >
                  {deleting === a.id ? '…' : 'Supprimer'}
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
              <p className="text-2xl mb-2">⭐</p>
              <p className="font-bold text-gray-700">Aucun avis dans cette catégorie</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
