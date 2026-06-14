import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { api } from '../../services/api'

interface Reservation {
  id: string
  proprietaire_id: string
  gardien_id: string
  animal_id: string
  date_debut: string
  date_fin: string
  statut: 'en_attente' | 'confirmee' | 'terminee' | 'annulee'
  assurance: boolean
  instructions: string | null
  created_at: string
}

const STATUT_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  en_attente: { label: 'En attente', color: '#F59E0B', bg: '#FEF3C7' },
  confirmee:  { label: 'En cours',   color: '#3A5220', bg: '#E8F0DC' },
  terminee:   { label: 'Terminée',   color: '#6B7280', bg: '#F3F4F6' },
  annulee:    { label: 'Annulée',    color: '#EF4444', bg: '#FEE2E2' },
}

export default function AdminGardes() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [filtre, setFiltre]             = useState<string>('all')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = filtre !== 'all' ? `?statut=${filtre}` : ''
      const res = await api.get<{ data: Reservation[]; total: number }>(`/reservations/all${params}`)
      setReservations(res.data || [])
    } catch {
      setError('Impossible de charger les réservations.')
    } finally {
      setLoading(false)
    }
  }, [filtre])

  useEffect(() => { load() }, [load])

  const confirmees = reservations.filter(r => r.statut === 'confirmee')
  const enAttente  = reservations.filter(r => r.statut === 'en_attente')

  return (
    <AdminLayout title="Gardes en cours">

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white border border-gray-200">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3A5220] animate-pulse" />
          {confirmees.length} garde{confirmees.length !== 1 ? 's' : ''} active{confirmees.length !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white border border-amber-200 text-amber-600">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          {enAttente.length} en attente
        </div>

        <div className="ml-auto flex gap-2">
          {[
            { v: 'all', label: 'Toutes' },
            { v: 'confirmee', label: 'En cours' },
            { v: 'en_attente', label: 'En attente' },
            { v: 'terminee', label: 'Terminées' },
          ].map(f => (
            <button key={f.v} type="button" onClick={() => setFiltre(f.v)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${
                filtre === f.v ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-600'
              }`}
              style={filtre === f.v ? { backgroundColor: '#3A5220' } : {}}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 text-gray-400 text-sm">Chargement…</div>
      ) : reservations.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
          <p className="text-2xl mb-2">🐾</p>
          <p className="font-bold text-gray-700">Aucune réservation</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Propriétaire', 'Gardien', 'Dates', 'Assurance', 'Statut', 'Créée le'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-black tracking-widest text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reservations.map(r => {
                const s = STATUT_LABEL[r.statut] ?? { label: r.statut, color: '#6B7280', bg: '#F3F4F6' }
                return (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.proprietaire_id.slice(0, 8)}…</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.gardien_id.slice(0, 8)}…</td>
                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                      {new Date(r.date_debut).toLocaleDateString('fr-FR')} → {new Date(r.date_fin).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {r.assurance
                        ? <span className="text-green-600 font-bold">✓ Oui</span>
                        : <span className="text-gray-400">Non</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: s.bg, color: s.color }}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(r.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
