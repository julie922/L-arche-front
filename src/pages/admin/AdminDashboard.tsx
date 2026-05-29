import AdminLayout from '../../components/admin/AdminLayout'

const STATS = [
  { label: 'Inscrits',          value: '1 247', delta: '+34 ce mois',  icon: '👥', color: '#3A5220' },
  { label: 'Revenus merch',     value: '3 850 €', delta: '+420 € ce mois', icon: '🛍️', color: '#D91B5C' },
  { label: 'Taux satisfaction', value: '4.7 / 5', delta: '284 avis',    icon: '⭐', color: '#F59E0B' },
  { label: 'Gardes totales',    value: '284',     delta: '12 en cours',  icon: '🐾', color: '#3A5220' },
]

const RECENT_USERS = [
  { id: 1, nom: 'Camille R.', role: 'proprio',  email: 'camille@email.com', date: 'Aujourd\'hui',   verifie: true  },
  { id: 2, nom: 'Jules M.',   role: 'gardien',   email: 'jules@email.com',   date: 'Aujourd\'hui',   verifie: true  },
  { id: 3, nom: 'Sophie T.',  role: 'les-deux',  email: 'sophie@email.com',  date: 'Hier',           verifie: false },
  { id: 4, nom: 'Marc L.',    role: 'proprio',   email: 'marc@email.com',    date: 'Il y a 2 jours', verifie: true  },
]

const ROLE_LABEL: Record<string, string> = {
  proprio:   'Propriétaire',
  gardien:   'Gardien',
  'les-deux': 'Les deux',
}

export default function AdminDashboard() {
  return (
    <AdminLayout title="Tableau de bord">

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-xs font-semibold text-gray-400">{s.delta}</span>
            </div>
            <p className="text-2xl font-black text-gray-900 mb-0.5">{s.value}</p>
            <p className="text-xs font-semibold text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Grille infos */}
      <div className="grid grid-cols-2 gap-6">

        {/* Derniers inscrits */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-900">Derniers inscrits</h2>
            <a href="/admin/utilisateurs" className="text-xs font-bold hover:underline" style={{ color: '#3A5220' }}>Voir tout</a>
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-50">
              {RECENT_USERS.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-bold text-gray-800">{u.nom}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[#E8F0DC] text-[#3A5220]">
                      {ROLE_LABEL[u.role]}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-400">{u.date}</td>
                  <td className="px-3 py-3">
                    {u.verifie
                      ? <span className="text-xs font-bold text-[#3A5220]">✓ Vérifié</span>
                      : <span className="text-xs font-bold text-amber-500">En attente</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alertes */}
        <div className="flex flex-col gap-4">
          {[
            { icon: '✅', label: '3 vérifications d\'identité en attente',      link: '/admin/verifications', color: '#F59E0B' },
            { icon: '⚠️', label: '2 signalements à traiter',                    link: '/admin/signalements',  color: '#EF4444' },
            { icon: '🐾', label: '12 gardes en cours',                           link: '/admin/gardes',        color: '#3A5220' },
            { icon: '⭐', label: '5 avis signalés comme inappropriés',           link: '/admin/avis',          color: '#D91B5C' },
          ].map(a => (
            <a key={a.label} href={a.link}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3 hover:shadow-md transition-shadow">
              <span className="text-xl">{a.icon}</span>
              <span className="flex-1 text-sm font-semibold text-gray-700">{a.label}</span>
              <span className="text-lg text-gray-300">›</span>
            </a>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
