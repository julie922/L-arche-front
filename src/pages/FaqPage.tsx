import { useState } from 'react'
import { Link } from 'react-router-dom'

// ─── Données FAQ ──────────────────────────────────────────────────────────────
const CATEGORIES = ['Tous', 'Inscription', 'Gardes', 'Paiement', 'Sécurité', 'Animaux', 'Technique']

const FAQ_ITEMS = [
  {
    categorie: 'Sécurité',
    question: "Comment fonctionne la vérification d'identité ?",
    reponse: "Notre équipe vérifie manuellement chaque pièce d'identité soumise. Une fois validée, votre profil affiche le badge vert \"Profil vérifié\". Ce processus prend généralement 24 à 48h ouvrées. Vous recevrez un email de confirmation dès validation.",
    lien: null,
  },
  {
    categorie: 'Paiement',
    question: 'Comment fonctionne le paiement entre propriétaire et gardien ?',
    reponse: "La rémunération est convenue directement entre le propriétaire et le gardien. L'Arche ne prélève pas de commission. Nous recommandons de formaliser l'accord avant la garde.",
    lien: null,
  },
  {
    categorie: 'Inscription',
    question: 'Puis-je être à la fois propriétaire et gardien ?',
    reponse: "Oui ! Lors de votre inscription, sélectionnez \"Les deux\" pour activer les deux profils simultanément. Vous pourrez basculer entre les deux espaces depuis votre tableau de bord.",
    lien: null,
  },
  {
    categorie: 'Gardes',
    question: "Que faire en cas d'urgence pendant une garde ?",
    reponse: "Contactez immédiatement le propriétaire via la messagerie. En cas d'urgence vétérinaire, rendez-vous chez le vétérinaire indiqué dans la fiche de l'animal. Si vous avez souscrit l'assurance garde, les frais d'urgence sont couverts.",
    lien: null,
  },
  {
    categorie: 'Sécurité',
    question: 'Comment signaler un comportement inapproprié ?',
    reponse: "Rendez-vous sur le profil concerné et cliquez sur \"Signaler\". Notre équipe modération examine chaque signalement sous 24h. Vous pouvez aussi nous contacter directement à contact@larche.fr.",
    lien: null,
  },
  {
    categorie: 'Gardes',
    question: "L'assurance est-elle obligatoire ?",
    reponse: "Non, l'assurance garde est optionnelle. Elle couvre les accidents et soins vétérinaires urgents pendant la garde pour +12€. Vous pouvez l'activer lors de chaque demande de garde.",
    lien: null,
  },
  {
    categorie: 'Animaux',
    question: "Quels animaux sont acceptés sur la plateforme ?",
    reponse: "Chiens, chats, lapins, rongeurs, oiseaux, reptiles, poissons et autres NAC. Chaque gardien précise les espèces qu'il accepte sur son profil.",
    lien: null,
  },
  {
    categorie: 'Technique',
    question: "Comment modifier mes disponibilités ?",
    reponse: "Depuis votre tableau de bord gardien, cliquez sur \"Modifier mes disponibilités\" ou rendez-vous dans Mon profil → Profil gardien → Disponibilités.",
    lien: null,
  },
]

// ─── Accordion item ───────────────────────────────────────────────────────────
function AccordionItem({ question, reponse, defaultOpen = false }: {
  question: string; reponse: string; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`border-b border-gray-100 ${open ? 'border-l-4 pl-4' : ''}`}
      style={open ? { borderLeftColor: '#3A5220' } : {}}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center py-4 text-left">
        <span className={`text-sm font-bold ${open ? 'text-gray-900' : 'text-gray-700'}`}>{question}</span>
        <span className="text-lg font-light text-gray-400 ml-4 shrink-0">{open ? '×' : '+'}</span>
      </button>
      {open && (
        <p className="text-sm text-gray-600 leading-relaxed pb-4 pr-6">{reponse}</p>
      )}
    </div>
  )
}

// ─── Wave ─────────────────────────────────────────────────────────────────────
function WaveDown() {
  return (
    <div className="w-full overflow-hidden leading-none">
      <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
        <path fill="#3A5220" d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" />
      </svg>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FaqPage() {
  const [categorie, setCategorie] = useState('Tous')
  const [recherche, setRecherche] = useState('')
  const [contactForm, setContactForm] = useState({ prenom: '', email: '', sujet: '', message: '' })

  const filtered = FAQ_ITEMS.filter(item => {
    const matchCat = categorie === 'Tous' || item.categorie === categorie
    const matchSearch = recherche === '' ||
      item.question.toLowerCase().includes(recherche.toLowerCase()) ||
      item.reponse.toLowerCase().includes(recherche.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* Navbar */}
      <nav className="w-full bg-white border-b border-gray-100 px-8 h-14 flex items-center justify-between shrink-0">
        <Link to="/"><img src="/logo1.png" alt="L'Arche" className="h-8 w-auto" /></Link>
        <div className="flex items-center gap-8">
          <Link to="/" className="text-sm font-semibold text-gray-500 hover:text-[#3A5220] transition-colors">Accueil</Link>
          <Link to="/faq" className="text-sm font-black text-[#3A5220]">FAQ</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 pt-14 pb-10 flex flex-col items-center text-center" style={{ backgroundColor: '#F0EBE1' }}>
        <p className="text-xs font-black tracking-widest mb-3" style={{ color: '#D91B5C' }}>CENTRE D'AIDE</p>
        <h1 className="text-4xl font-black text-gray-900 mb-8 max-w-lg leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          Comment pouvons-nous<br />vous aider ?
        </h1>

        {/* Barre de recherche */}
        <div className="relative w-full max-w-md mb-8">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Rechercher dans la FAQ"
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
            className="w-full border border-gray-200 rounded-full pl-10 pr-5 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent shadow-sm"
          />
        </div>

        {/* Filtres catégories */}
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map(cat => (
            <button key={cat} type="button" onClick={() => setCategorie(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all"
              style={{
                backgroundColor: categorie === cat ? '#D91B5C' : 'white',
                borderColor:     categorie === cat ? '#D91B5C' : '#E5E7EB',
                color:           categorie === cat ? 'white'   : '#6B7280',
              }}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="px-4 py-8" style={{ backgroundColor: '#F0EBE1' }}>
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm px-8 py-2">
          {filtered.length > 0
            ? filtered.map((item, i) => (
                <AccordionItem key={i} question={item.question} reponse={item.reponse} defaultOpen={i === 0 && recherche === '' && categorie === 'Tous'} />
              ))
            : (
              <div className="py-12 text-center">
                <p className="text-3xl mb-2">🔍</p>
                <p className="font-bold text-gray-700">Aucun résultat pour "{recherche}"</p>
                <p className="text-sm text-gray-400 mt-1">Essayez avec d'autres mots-clés</p>
              </div>
            )
          }
        </div>
      </section>

      {/* Wave + Contact */}
      <div style={{ backgroundColor: '#F0EBE1' }}>
        <WaveDown />
      </div>

      <section className="px-4 py-14" style={{ backgroundColor: '#3A5220' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-12 items-start">

          {/* Infos contact */}
          <div>
            <p className="text-xs font-black tracking-widest mb-2" style={{ color: '#D91B5C' }}>CONTACT</p>
            <h2 className="text-2xl font-black text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Vous n'avez pas trouvé votre réponse ?
            </h2>
            <p className="text-sm text-white/70 leading-relaxed mb-8">
              Notre équipe répond sous 48h ouvrées. Nous sommes toujours là pour vous aider.
            </p>
            <div className="flex flex-col gap-4">
              {[
                { icon: '✉️', label: 'Email',          value: 'contact@larche.fr' },
                { icon: '🌐', label: 'Réseaux sociaux', value: '@larche.fr' },
                { icon: '📍', label: 'Association',     value: 'Association loi 1901 · Lyon, France' },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-3">
                  <span className="text-lg">{c.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-white/60">{c.label}</p>
                    <p className="text-sm font-semibold text-white">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="bg-white rounded-2xl shadow-sm px-6 py-6">
            <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Prénom</label>
                <input type="text" placeholder="Camille" value={contactForm.prenom}
                  onChange={e => setContactForm({ ...contactForm, prenom: e.target.value })}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Email</label>
                <input type="email" placeholder="votre@email.com" value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Sujet</label>
                <input type="text" placeholder="Question générale" value={contactForm.sujet}
                  onChange={e => setContactForm({ ...contactForm, sujet: e.target.value })}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Message</label>
                <textarea rows={4} placeholder="Décrivez votre demande" value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent" />
              </div>
              <button type="submit"
                className="w-full py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition"
                style={{ backgroundColor: '#3A5220' }}>
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#3A5220' }}>
        <div className="max-w-5xl mx-auto px-8 py-6 border-t border-white/20 flex justify-between items-center">
          <span className="text-sm text-white/70">2025 L'Arche · Association loi 1901</span>
          <span className="text-sm font-semibold" style={{ color: '#A8C539' }}>Pour les animaux</span>
        </div>
      </footer>
    </div>
  )
}
