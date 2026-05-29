import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'

const MOCK_GARDES = [
  { id: 1, animal: 'Luna (Border Collie)', proprio: 'Camille R.', gardien: 'Jules M.',  debut: '10/03',  fin: '17/03', type: 'Domicile', jour: 3, litige: false },
  { id: 2, animal: 'Mimi (Ragdoll)',       proprio: 'Marc L.',    gardien: 'Léa R.',    debut: '12/03',  fin: '15/03', type: 'Domicile', jour: 1, litige: false },
  { id: 3, animal: 'Rex (Labrador)',       proprio: 'Sophie T.',  gardien: 'Pierre D.', debut: '11/03',  fin: '16/03', type: 'Visite',   jour: 2, litige: true  },
  { id: 4, animal: 'Noisette (Chat)',      proprio: 'Julie B.',   gardien: 'Marie T.',  debut: '09/03',  fin: '13/03', type: 'Domicile', jour: 4, litige: false },
]

export default function AdminGardes() {
  const [gardes, setGardes] = useState(MOCK_GARDES)
  const [litigeActif, setLitigeActif] = useState<number | null>(null)
  const [noteAdmin, setNoteAdmin]     = useState('')

  return (
    <AdminLayout title="Gardes en cours">

      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white border border-gray-200">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3A5220] animate-pulse" />
          {gardes.length} gardes actives
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white border border-red-200 text-red-500">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          {gardes.filter(g => g.litige).length} litige{gardes.filter(g => g.litige).length > 1 ? 's' : ''}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['Animal / Race', 'Propriétaire', 'Gardien', 'Dates', 'Type', 'Jour', 'Statut', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-black tracking-widest text-gray-400 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {gardes.map(g => (
              <tr key={g.id} className={`hover:bg-gray-50 transition-colors ${g.litige ? 'bg-red-50/50' : ''}`}>
                <td className="px-4 py-3 font-semibold text-gray-800">{g.animal}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{g.proprio}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{g.gardien}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{g.debut} → {g.fin}</td>
                <td className="px-4 py-3 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-[#E8F0DC] text-[#3A5220] font-semibold">{g.type}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">Jour {g.jour}</td>
                <td className="px-4 py-3">
                  {g.litige
                    ? <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600">⚠️ Litige</span>
                    : <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E8F0DC] text-[#3A5220]">En cours</span>}
                </td>
                <td className="px-4 py-3">
                  {g.litige && (
                    <button type="button" onClick={() => setLitigeActif(g.id)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 transition">
                      Intervenir
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal litige */}
      {litigeActif && (() => {
        const g = gardes.find(x => x.id === litigeActif)!
        return (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
              <p className="text-lg font-black text-gray-900 mb-1">Litige — {g.animal}</p>
              <p className="text-sm text-gray-500 mb-5">Entre {g.proprio} et {g.gardien}</p>
              <div className="flex flex-col gap-3 mb-5">
                <button type="button" className="py-2.5 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-700 hover:bg-gray-50">
                  📨 Contacter le propriétaire
                </button>
                <button type="button" className="py-2.5 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-700 hover:bg-gray-50">
                  📨 Contacter le gardien
                </button>
                <button type="button"
                  onClick={() => { setGardes(prev => prev.map(x => x.id === litigeActif ? { ...x, litige: false } : x)); setLitigeActif(null) }}
                  className="py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition"
                  style={{ backgroundColor: '#3A5220' }}>
                  ✓ Marquer comme résolu
                </button>
              </div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Note interne</label>
              <textarea rows={2} value={noteAdmin} onChange={e => setNoteAdmin(e.target.value)}
                placeholder="Résumé de l'intervention..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#3A5220] mb-4" />
              <button type="button" onClick={() => setLitigeActif(null)}
                className="w-full py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600">
                Fermer
              </button>
            </div>
          </div>
        )
      })()}
    </AdminLayout>
  )
}
