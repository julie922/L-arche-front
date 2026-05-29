import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'

const MOCK_SIGNALEMENTS = [
  { id: 1, type: 'comportement', signaleur: 'Camille R.', signale: 'Pierre D.', motif: 'Comportement inapproprié lors de la garde', date: '12/03/2025', statut: 'en_attente' as const },
  { id: 2, type: 'avis',         signaleur: 'Jules M.',   signale: 'Marc L.',   motif: 'Avis diffamatoire et faux',                date: '11/03/2025', statut: 'en_attente' as const },
  { id: 3, type: 'comportement', signaleur: 'Léa R.',     signale: 'Paul G.',   motif: 'Harcèlement via messagerie',               date: '09/03/2025', statut: 'traite'     as const },
]

const TYPE_LABEL: Record<string, string> = { comportement: 'Comportement', avis: 'Avis signalé' }

export default function AdminSignalements() {
  const [signalements, setSignalements] = useState(MOCK_SIGNALEMENTS)
  const traiter = (id: number) =>
    setSignalements(prev => prev.map(s => s.id === id ? { ...s, statut: 'traite' } : s))

  const supprimer = (id: number) =>
    setSignalements(prev => prev.filter(s => s.id !== id))

  const enAttente = signalements.filter(s => s.statut === 'en_attente')
  const traites   = signalements.filter(s => s.statut === 'traite')

  return (
    <AdminLayout title="Signalements">

      <p className="text-sm text-gray-500 mb-5">
        <span className="font-black text-gray-800">{enAttente.length}</span> signalement{enAttente.length > 1 ? 's' : ''} en attente
      </p>

      <div className="flex flex-col gap-3 mb-8">
        {enAttente.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    s.type === 'comportement' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {TYPE_LABEL[s.type]}
                  </span>
                  <span className="text-xs text-gray-400">{s.date}</span>
                </div>
                <p className="text-sm font-bold text-gray-800 mb-0.5">
                  {s.signaleur} → signale → {s.signale}
                </p>
                <p className="text-sm text-gray-600 italic">"{s.motif}"</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button type="button"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                  Voir les profils
                </button>
                <button type="button" onClick={() => traiter(s.id)}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white hover:opacity-90 transition"
                  style={{ backgroundColor: '#3A5220' }}>
                  ✓ Marquer traité
                </button>
                <button type="button"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-500 border-2 border-red-100 hover:bg-red-100 transition">
                  Suspendre le compte
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {traites.length > 0 && (
        <div>
          <h2 className="text-sm font-black text-gray-700 tracking-widest uppercase mb-3">Traités</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-50">
                {traites.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 opacity-60">
                    <td className="px-5 py-3 font-semibold text-gray-700">{s.signaleur} → {s.signale}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{s.date}</td>
                    <td className="px-4 py-3 text-xs italic text-gray-400">"{s.motif}"</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">Traité</span>
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => supprimer(s.id)}
                        className="text-xs text-gray-400 hover:text-red-500 transition">Supprimer</button>
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
