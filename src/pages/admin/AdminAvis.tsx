import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'

const MOCK_AVIS = [
  { id: 1, auteur: 'Marc L.',   gardien: 'Jules M.',  note: 1, texte: 'Vraiment nul, mon chien était mal traité !',  date: '10/03/2025', signale: true  },
  { id: 2, auteur: 'Paul G.',   gardien: 'Léa R.',    note: 1, texte: 'Incompétente et irresponsable !!',           date: '08/03/2025', signale: true  },
  { id: 3, auteur: 'Camille R.',gardien: 'Jules M.',  note: 5, texte: 'Excellent gardien, Luna était aux anges !',  date: '05/03/2025', signale: false },
  { id: 4, auteur: 'Sophie T.', gardien: 'Marie T.',  note: 4, texte: 'Très bien, je recommande.',                  date: '03/03/2025', signale: false },
]

export default function AdminAvis() {
  const [avis, setAvis] = useState(MOCK_AVIS)
  const [filtre, setFiltre] = useState<'tous' | 'signales'>('signales')

  const supprimer = (id: number) => setAvis(prev => prev.filter(a => a.id !== id))
  const valider   = (id: number) => setAvis(prev => prev.map(a => a.id === id ? { ...a, signale: false } : a))

  const filtered = filtre === 'signales' ? avis.filter(a => a.signale) : avis

  return (
    <AdminLayout title="Gestion des avis">

      <div className="flex gap-2 mb-5">
        {(['signales', 'tous'] as const).map(f => (
          <button key={f} type="button" onClick={() => setFiltre(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
              filtre === f ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-600'
            }`}
            style={filtre === f ? { backgroundColor: '#3A5220' } : {}}>
            {f === 'signales' ? `⚠️ Signalés (${avis.filter(a => a.signale).length})` : 'Tous les avis'}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map(a => (
          <div key={a.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${a.signale ? 'border-red-100' : 'border-gray-100'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-black text-gray-900">{a.auteur} → {a.gardien}</p>
                  <span className="flex">
                    {[1,2,3,4,5].map(i => <span key={i} className="text-xs" style={{ color: i <= a.note ? '#F59E0B' : '#D1D5DB' }}>★</span>)}
                  </span>
                  {a.signale && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-500">Signalé</span>}
                </div>
                <p className="text-xs text-gray-400 mb-2">{a.date}</p>
                <p className="text-sm text-gray-700 italic">"{a.texte}"</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                {a.signale && (
                  <button type="button" onClick={() => valider(a.id)}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold text-white hover:opacity-90 transition"
                    style={{ backgroundColor: '#3A5220' }}>
                    ✓ Garder l'avis
                  </button>
                )}
                <button type="button" onClick={() => supprimer(a.id)}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-500 border-2 border-red-100 hover:bg-red-100 transition">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <p className="text-2xl mb-2">⭐</p>
            <p className="font-bold text-gray-700">Aucun avis signalé</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
