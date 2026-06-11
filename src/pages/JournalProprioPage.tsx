import { Link } from 'react-router-dom'
import Header from '../components/Header'

const MOCK_JOURNAL = {
  animal:   { nom: 'Luna', race: 'Border Collie', emoji: 'ðŸ•' },
  gardien:  { nom: 'Jules Martin', id: 'jules-martin' },
  dateDebut: '10-17 mars 2025',
  entrees: [
    {
      id: 3,
      date: 'Mercredi 12 mars',
      heure: '19:45',
      debutGarde: false,
      checks: ['Repas matin', 'Repas soir', 'Promenade', 'MÃ©dicaments'],
      humeur: 'Luna est en pleine forme ! Grande balade ce matin au parc, elle a jouÃ© avec un autre chien. A bien mangÃ© ses deux repas.',
      photos: ['/mock-dog-1.jpg', '/mock-dog-2.jpg', '/mock-dog-3.jpg'],
    },
    {
      id: 2,
      date: 'Mardi 11 mars',
      heure: '20:12',
      debutGarde: false,
      checks: ['Repas matin', 'Repas soir', 'Promenade', 'MÃ©dicaments'],
      humeur: 'Bonne ! PremiÃ¨re journÃ©e complÃ¨te, Luna a un peu cherchÃ© ses repÃ¨res mais s\'est vite installÃ©e sur le canapÃ© !',
      photos: ['/mock-dog-4.jpg', '/mock-dog-5.jpg', '/mock-dog-6.jpg'],
    },
    {
      id: 1,
      date: 'Lundi 10 mars',
      heure: '18:30',
      debutGarde: true,
      checks: [],
      humeur: 'Luna est arrivÃ©e, elle va bien ! On a fait un tour du jardin, elle adore.',
      photos: [],
    },
  ],
}

export default function JournalProprioPage() {
  const j = MOCK_JOURNAL

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>

      {/* Navbar */}
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">

        {/* Carte animal */}
        <div className="rounded-2xl px-5 py-4 mb-8 flex items-center justify-between" style={{ backgroundColor: '#3A5220' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#D4E6C3] flex items-center justify-center text-2xl shrink-0">
              {j.animal.emoji}
            </div>
            <div>
              <h1 className="text-lg font-black text-white">{j.animal.nom} est entre de bonnes mains</h1>
              <p className="text-xs text-white/70">GardÃ©e par {j.gardien.nom} Â· {j.dateDebut}</p>
            </div>
          </div>
          <Link to="/messages"
            className="px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition shrink-0"
            style={{ backgroundColor: '#A8C539', color: '#1A2E0A' }}>
            Envoyer un message
          </Link>
        </div>

        {/* Timeline des entrÃ©es */}
        <div className="relative flex flex-col gap-6">
          {/* Ligne verticale */}
          <div className="absolute left-2 top-4 bottom-4 w-0.5 bg-gray-200" />

          {j.entrees.map(e => (
            <div key={e.id} className="relative pl-8">
              {/* Point sur la timeline */}
              <div className="absolute left-0 top-4 w-4 h-4 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: e.debutGarde ? '#D91B5C' : '#E5E7EB' }} />

              <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
                {/* En-tÃªte */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-gray-500">{e.date} Â· {e.heure}</span>
                  {e.debutGarde && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FCE4EC', color: '#D91B5C' }}>
                      DÃ©but de garde
                    </span>
                  )}
                </div>

                {/* Tags checks */}
                {e.checks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {e.checks.map(c => (
                      <span key={c} className="text-xs font-semibold px-3 py-1 rounded-full border border-gray-200 text-gray-600">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {/* Note / humeur */}
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  {!e.debutGarde && <span className="font-bold" style={{ color: '#D91B5C' }}>Humeur : </span>}
                  {e.humeur}
                </p>

                {/* Photos */}
                {e.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {e.photos.map((_, i) => (
                      <div key={i} className="aspect-square rounded-xl bg-[#D4E6C3] flex items-center justify-center text-3xl">
                        {j.animal.emoji}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

