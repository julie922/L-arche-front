import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'

const MOCK_VÉRIFS = [
  { id: 1, nom: 'Sophie Tremblay', email: 'sophie@email.com', role: 'Gardien', date: '12/03/2025', doc: 'Carte nationale d\'identité', statut: 'en_attente' as const },
  { id: 2, nom: 'Pierre Durand',   email: 'pierre@email.com', role: 'Gardien', date: '11/03/2025', doc: 'Passeport',                   statut: 'en_attente' as const },
  { id: 3, nom: 'Ana Ferreira',    email: 'ana@email.com',    role: 'Gardien', date: '10/03/2025', doc: 'Carte nationale d\'identité', statut: 'en_attente' as const },
  { id: 4, nom: 'Thomas Blanc',    email: 'thomas@email.com', role: 'Gardien', date: '08/03/2025', doc: 'Passeport',                   statut: 'validée'   as const },
  { id: 5, nom: 'Lucie Martin',    email: 'lucie@email.com',  role: 'Gardien', date: '07/03/2025', doc: 'Carte nationale d\'identité', statut: 'refusée'   as const },
]

export default function AdminVerifications() {
  const [verifs, setVerifs]   = useState(MOCK_VÉRIFS)
  const [selected, setSelected] = useState<number | null>(null)
  const [motifRefus, setMotifRefus] = useState('')
  const [showRefus, setShowRefus]   = useState(false)

  const valider = (id: number) =>
    setVerifs(prev => prev.map(v => v.id === id ? { ...v, statut: 'validée' } : v))

  const refuser = (id: number) => {
    setVerifs(prev => prev.map(v => v.id === id ? { ...v, statut: 'refusée' } : v))
    setShowRefus(false)
    setMotifRefus('')
  }

  const enAttente = verifs.filter(v => v.statut === 'en_attente')
  const traitees  = verifs.filter(v => v.statut !== 'en_attente')

  return (
    <AdminLayout title="Vérifications d'identité">

      <p className="text-sm text-gray-500 mb-5">
        <span className="font-black text-gray-800">{enAttente.length}</span> vérification{enAttente.length > 1 ? 's' : ''} en attente de traitement
      </p>

      <div className="flex flex-col gap-4 mb-8">
        <h2 className="text-sm font-black text-gray-700 tracking-widest uppercase">En attente</h2>
        {enAttente.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <p className="text-2xl mb-2">✅</p>
            <p className="font-bold text-gray-700">Toutes les vérifications sont traitées</p>
          </div>
        )}
        {enAttente.map(v => (
          <div key={v.id} className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5 flex items-start gap-5">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-lg shrink-0">👤</div>
            <div className="flex-1">
              <p className="font-black text-gray-900">{v.nom}</p>
              <p className="text-xs text-gray-400 mb-1">{v.email} · {v.role} · Soumis le {v.date}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">📄 {v.doc}</span>
              </div>
              {/* Simulation doc (placeholder) */}
              <div className="w-full h-24 bg-gray-100 rounded-xl flex items-center justify-center mb-3 border border-gray-200">
                <span className="text-xs text-gray-400">Document d'identité (chargé depuis le serveur)</span>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => valider(v.id)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition"
                  style={{ backgroundColor: '#3A5220' }}>
                  ✓ Valider
                </button>
                <button type="button" onClick={() => { setSelected(v.id); setShowRefus(true) }}
                  className="px-5 py-2 rounded-xl text-xs font-bold border-2 border-red-200 text-red-500 hover:bg-red-50 transition">
                  ✕ Refuser
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Traitées */}
      <div>
        <h2 className="text-sm font-black text-gray-700 tracking-widest uppercase mb-3">Traitées récemment</h2>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-50">
              {traitees.map(v => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold text-gray-800">{v.nom}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{v.date}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{v.doc}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      v.statut === 'validée' ? 'bg-[#E8F0DC] text-[#3A5220]' : 'bg-red-50 text-red-500'
                    }`}>
                      {v.statut === 'validée' ? '✓ Validée' : '✕ Refusée'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal refus */}
      {showRefus && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl">
            <p className="text-lg font-black text-gray-900 mb-1">Motif du refus</p>
            <p className="text-sm text-gray-500 mb-4">Ce message sera envoyé à l'utilisateur.</p>
            <textarea rows={3} value={motifRefus} onChange={e => setMotifRefus(e.target.value)}
              placeholder="Document illisible, pièce expirée..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#3A5220] mb-4" />
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowRefus(false)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600">
                Annuler
              </button>
              <button type="button" onClick={() => refuser(selected)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600">
                Envoyer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
