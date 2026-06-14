import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'

type StatutCommande = 'en_attente' | 'preparee' | 'expediee' | 'livree' | 'annulee'

interface Commande {
  id: string; client: string; email: string; date: string
  produits: { nom: string; quantite: number; variant?: string }[]
  total: number; statut: StatutCommande; adresse: string
}

const MOCK_COMMANDES: Commande[] = [
  { id: 'CMD-001', client: 'Camille R.',  email: 'camille@email.com', date: '12/03/2025', produits: [{ nom: 'Tote bag L\'Arche', quantite: 2 }, { nom: 'Mug L\'Arche', quantite: 1 }], total: 42, statut: 'en_attente', adresse: '12 rue des Fleurs, 69003 Lyon' },
  { id: 'CMD-002', client: 'Marc L.',     email: 'marc@email.com',    date: '11/03/2025', produits: [{ nom: 'T-shirt "Pour les animaux"', quantite: 1, variant: 'M' }],                  total: 25, statut: 'preparee',  adresse: '5 avenue Jean Jaurès, 69007 Lyon' },
  { id: 'CMD-003', client: 'Sophie T.',   email: 'sophie@email.com',  date: '10/03/2025', produits: [{ nom: 'Collier brodé', quantite: 1, variant: 'M' }, { nom: 'Gamelle', quantite: 1, variant: 'L' }], total: 36, statut: 'expediee', adresse: '8 rue de la Paix, 69001 Lyon' },
  { id: 'CMD-004', client: 'Jules M.',    email: 'jules@email.com',   date: '08/03/2025', produits: [{ nom: 'Pack stickers', quantite: 3 }],                                             total: 18, statut: 'livree',    adresse: '3 cours Gambetta, 69003 Lyon' },
  { id: 'CMD-005', client: 'Léa R.',      email: 'lea@email.com',     date: '07/03/2025', produits: [{ nom: 'Gourde inox', quantite: 1, variant: 'Vert forêt' }],                        total: 22, statut: 'annulee',   adresse: '15 rue Bellecour, 69002 Lyon' },
]

const STATUT_CONFIG: Record<StatutCommande, { label: string; color: string; bg: string }> = {
  en_attente: { label: 'En attente',  color: '#D97706', bg: '#FEF3C7' },
  preparee:   { label: 'Préparée',    color: '#3A5220', bg: '#D4E6C3' },
  expediee:   { label: 'Expédiée',    color: '#1D4ED8', bg: '#DBEAFE' },
  livree:     { label: 'Livrée',      color: '#166534', bg: '#DCFCE7' },
  annulee:    { label: 'Annulée',     color: '#DC2626', bg: '#FEE2E2' },
}

const STATUTS_ORDRE: StatutCommande[] = ['en_attente', 'preparee', 'expediee', 'livree', 'annulee']

export default function AdminCommandes() {
  const [commandes, setCommandes] = useState<Commande[]>(MOCK_COMMANDES)
  const [selected, setSelected]   = useState<string | null>(null)
  const [filtre, setFiltre]        = useState<StatutCommande | 'toutes'>('toutes')

  const changerStatut = (id: string, statut: StatutCommande) =>
    setCommandes(prev => prev.map(c => c.id === id ? { ...c, statut } : c))

  const filtered = filtre === 'toutes' ? commandes : commandes.filter(c => c.statut === filtre)
  const commandeSelectionnee = commandes.find(c => c.id === selected)

  const revenus = commandes.filter(c => c.statut === 'livree').reduce((s, c) => s + c.total, 0)

  return (
    <AdminLayout title="Gestion des commandes">
      <div className="mb-5 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-sm font-semibold flex items-center gap-2">
        🚧 Données de démonstration — aucune API commandes n'est connectée pour le moment.
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total commandes',   value: commandes.length,                                         color: '#3A5220' },
          { label: 'En attente',        value: commandes.filter(c => c.statut === 'en_attente').length,  color: '#D97706' },
          { label: 'En cours',          value: commandes.filter(c => ['preparee','expediee'].includes(c.statut)).length, color: '#1D4ED8' },
          { label: 'Revenus livrés',    value: `${revenus} €`,                                           color: '#D91B5C' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button type="button" onClick={() => setFiltre('toutes')}
          className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${filtre === 'toutes' ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-600'}`}
          style={filtre === 'toutes' ? { backgroundColor: '#3A5220' } : {}}>
          Toutes ({commandes.length})
        </button>
        {STATUTS_ORDRE.map(s => {
          const cfg   = STATUT_CONFIG[s]
          const count = commandes.filter(c => c.statut === s).length
          return (
            <button key={s} type="button" onClick={() => setFiltre(s)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${filtre === s ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-600'}`}
              style={filtre === s ? { backgroundColor: cfg.color } : {}}>
              {cfg.label} ({count})
            </button>
          )
        })}
      </div>

      <div className="flex gap-5">
        {/* Table */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['N° commande','Client','Produits','Total','Date','Statut'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-black tracking-widest text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => {
                const cfg = STATUT_CONFIG[c.statut]
                return (
                  <tr key={c.id}
                    onClick={() => setSelected(s => s === c.id ? null : c.id)}
                    className={`cursor-pointer transition-colors ${selected === c.id ? 'bg-[#E8F0DC]' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-3 font-black text-gray-800">{c.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{c.client}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {c.produits.map(p => `${p.nom}${p.variant ? ` (${p.variant})` : ''} ×${p.quantite}`).join(', ')}
                    </td>
                    <td className="px-4 py-3 font-black" style={{ color: '#3A5220' }}>{c.total} €</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{c.date}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Détail commande */}
        {commandeSelectionnee && (
          <div className="w-64 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <div>
              <p className="font-black text-gray-900">{commandeSelectionnee.id}</p>
              <p className="text-sm font-semibold text-gray-700">{commandeSelectionnee.client}</p>
              <p className="text-xs text-gray-400">{commandeSelectionnee.email}</p>
              <p className="text-xs text-gray-400 mt-1">📍 {commandeSelectionnee.adresse}</p>
            </div>

            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Articles</p>
              {commandeSelectionnee.produits.map((p, i) => (
                <div key={i} className="flex justify-between text-xs text-gray-700 py-1 border-b border-gray-50">
                  <span>{p.nom}{p.variant ? ` (${p.variant})` : ''}</span>
                  <span className="font-bold">×{p.quantite}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-black mt-2" style={{ color: '#3A5220' }}>
                <span>Total</span>
                <span>{commandeSelectionnee.total} €</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Changer le statut</p>
              <div className="flex flex-col gap-1.5">
                {STATUTS_ORDRE.filter(s => s !== commandeSelectionnee.statut).map(s => {
                  const cfg = STATUT_CONFIG[s]
                  return (
                    <button key={s} type="button"
                      onClick={() => changerStatut(commandeSelectionnee.id, s)}
                      className="py-2 rounded-lg text-xs font-bold border-2 transition-all hover:opacity-90"
                      style={{ borderColor: cfg.color, color: cfg.color, backgroundColor: cfg.bg }}>
                      → {cfg.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
