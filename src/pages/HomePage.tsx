import { Link } from 'react-router-dom'
import Header from '../components/Header'

const ETAPES = [
  { num: '01', titre: 'Créez votre profil',       desc: 'Inscrivez-vous en 2 minutes, ajoutez vos animaux ou vos disponibilités selon votre rôle.',  icon: '👤' },
  { num: '02', titre: 'Trouvez le bon gardien',   desc: 'Recherchez par ville, dates et espèce. Consultez les profils vérifiés et les avis de la communauté.', icon: '🔍' },
  { num: '03', titre: 'Partez l\'esprit tranquille', desc: 'Suivez le journal de garde quotidien avec photos. Votre compagnon est entre de bonnes mains.', icon: '🐾' },
]

const FEATURES = [
  { icon: '✅', titre: 'Profils vérifiés',      desc: 'Chaque gardien est vérifié manuellement par notre équipe. Badge officiel L\'Arche garantit la confiance.' },
  { icon: '📔', titre: 'Journal de garde',       desc: 'Le gardien envoie une mise à jour quotidienne avec photos. Vous suivez votre animal en temps réel.' },
  { icon: '🌍', titre: 'Communauté locale',      desc: 'Trouvez des gardiens près de chez vous. Construisez des relations de confiance dans votre quartier.' },
  { icon: '🐾', titre: 'Toutes les espèces',     desc: 'Chiens, chats, lapins, oiseaux, reptiles et NAC. Chaque gardien précise les animaux qu\'il accepte.' },
  { icon: '💬', titre: 'Messagerie intégrée',    desc: 'Communiquez directement avec le gardien avant, pendant et après la garde.' },
  { icon: '❤️', titre: 'Gratuit et solidaire',   desc: 'La mise en relation est entièrement gratuite. La rémunération est convenue entre particuliers.' },
]

const TEMOIGNAGES = [
  { nom: 'Camille R.', ville: 'Lyon 3e',    note: 5, texte: 'Jules a pris soin de Luna comme si c\'était son propre chien. Le journal quotidien avec photos nous a permis de partir vraiment sereins. On ne cherche plus d\'autre gardien !',  animal: 'Border Collie' },
  { nom: 'Marc L.',    ville: 'Lyon 7e',    note: 5, texte: 'Grâce à L\'Arche, j\'ai trouvé une gardienne formidable pour Milo en moins de 24h. Le processus est simple, les profils sont fiables. Je recommande à 100%.',               animal: 'Labrador' },
  { nom: 'Sophie T.',  ville: 'Lyon 1er',   note: 5, texte: 'En tant que gardienne, la plateforme m\'a permis de créer des liens incroyables avec des animaux et leurs familles. C\'est bien plus qu\'un service, c\'est une vraie communauté.', animal: 'Gardienne' },
]

function Stars({ n }: { n: number }) {
  return <span className="text-sm" style={{ color: '#F59E0B' }}>{'★'.repeat(n)}</span>
}

function Wave({ color = '#F0EBE1' }: { color?: string }) {
  return (
    <div className="w-full overflow-hidden leading-none">
      <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-14">
        <path fill={color} d="M0,35 C240,70 480,0 720,35 C960,70 1200,0 1440,35 L1440,70 L0,70 Z" />
      </svg>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* ── Navbar ──────────────────────────────────────────── */}
      <Header />

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center px-8 pt-20 pb-0" style={{ backgroundColor: '#3A5220', minHeight: '480px' }}>

        {/* Silhouettes décoratives */}
        <div className="absolute inset-0 flex items-center justify-between px-20 pointer-events-none select-none opacity-20">
          {['🐕','🐈','🐇','🦜'].map((e, i) => (
            <span key={i} className="text-8xl" style={{ filter: 'brightness(0) invert(1)' }}>{e}</span>
          ))}
        </div>

        <div className="relative z-10 max-w-2xl">
          <p className="text-xs font-black tracking-widest mb-4" style={{ color: '#A8C539' }}>ASSOCIATION L'ARCHE</p>
          <h1 className="text-5xl font-black text-white mb-5 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Votre animal entre<br />de bonnes mains
          </h1>
          <p className="text-white/80 text-lg mb-10 leading-relaxed">
            La plateforme communautaire qui connecte propriétaires et gardiens de confiance.<br />
            Parce que partir en vacances ne devrait jamais rimer avec abandon.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/gardiens"
              className="px-8 py-4 rounded-xl font-black text-[#2D4A18] text-base hover:opacity-90 transition"
              style={{ backgroundColor: '#A8C539' }}>
              Trouver un gardien →
            </Link>
            <Link to="/register"
              className="px-8 py-4 rounded-xl font-black text-white text-base border-2 border-white/40 hover:bg-white/10 transition">
              Devenir gardien
            </Link>
          </div>
        </div>

        <div className="w-full mt-16">
          <Wave color="#F0EBE1" />
        </div>
      </section>

      {/* ── Chiffres clés ───────────────────────────────────── */}
      <section className="px-8 py-12" style={{ backgroundColor: '#F0EBE1' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { value: '1 200+', label: 'membres actifs',        icon: '👥' },
            { value: '280+',   label: 'gardes réalisées',      icon: '🐾' },
            { value: '4.8/5',  label: 'satisfaction moyenne',  icon: '⭐' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <span className="text-3xl">{s.icon}</span>
              <p className="text-3xl font-black mt-2 mb-1" style={{ color: '#3A5220' }}>{s.value}</p>
              <p className="text-sm text-gray-500 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comment ça marche ────────────────────────────────── */}
      <section className="px-8 py-16" style={{ backgroundColor: '#F0EBE1' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-black tracking-widest mb-2" style={{ color: '#D91B5C' }}>SIMPLE ET RAPIDE</p>
            <h2 className="text-3xl font-black text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Comment ça marche ?
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-8 relative">
            {/* Ligne de connexion */}
            <div className="absolute top-8 left-[20%] right-[20%] h-0.5 bg-gray-200 hidden md:block" />
            {ETAPES.map((e, i) => (
              <div key={i} className="flex flex-col items-center text-center relative">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm relative z-10"
                  style={{ backgroundColor: '#3A5220' }}>
                  <span>{e.icon}</span>
                </div>
                <span className="text-xs font-black tracking-widest mb-1" style={{ color: '#A8C539' }}>{e.num}</span>
                <h3 className="text-base font-black text-gray-900 mb-2">{e.titre}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/register"
              className="inline-block px-8 py-3.5 rounded-xl font-bold text-white hover:opacity-90 transition"
              style={{ backgroundColor: '#3A5220' }}>
              Commencer gratuitement →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Fonctionnalités ─────────────────────────────────── */}
      <div style={{ backgroundColor: '#F0EBE1' }}>
        <Wave color="#3A5220" />
      </div>

      <section className="px-8 py-16" style={{ backgroundColor: '#3A5220' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-black tracking-widest mb-2" style={{ color: '#A8C539' }}>LA PLATEFORME</p>
            <h2 className="text-3xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Tout pour une garde sereine
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.titre} className="bg-white/10 rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-colors">
                <span className="text-2xl mb-3 block">{f.icon}</span>
                <h3 className="text-sm font-black text-white mb-1">{f.titre}</h3>
                <p className="text-xs text-white/70 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ backgroundColor: '#F0EBE1' }}>
        <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-14" style={{ backgroundColor: '#3A5220' }}>
          <path fill="#F0EBE1" d="M0,35 C240,70 480,0 720,35 C960,70 1200,0 1440,35 L1440,70 L0,70 Z" />
        </svg>
      </div>

      {/* ── L'association ────────────────────────────────────── */}
      <section className="px-8 py-16" style={{ backgroundColor: '#F0EBE1' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-black tracking-widest mb-3" style={{ color: '#D91B5C' }}>NOTRE MISSION</p>
            <h2 className="text-3xl font-black text-gray-900 mb-5 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Contre l'abandon,<br />pour le lien
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              L'Arche est une association loi 1901 fondée à Lyon. Chaque année en France, <strong>100 000 animaux</strong> sont abandonnés pendant les vacances, faute de solution de garde adaptée.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Notre plateforme crée des liens de confiance entre propriétaires et gardiens passionnés. Un animal gardé chez un particulier de confiance, c'est un animal épanoui — et une famille qui part sereine.
            </p>
            <div className="flex gap-4">
              <Link to="/register"
                className="px-6 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition"
                style={{ backgroundColor: '#3A5220' }}>
                Rejoindre l'association
              </Link>
              <Link to="/faq"
                className="px-6 py-3 rounded-xl font-bold text-sm border-2 border-gray-300 text-gray-700 hover:border-[#3A5220] transition">
                En savoir plus
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '2021',   label: 'Année de création',  icon: '🏛️' },
              { value: 'Lyon',   label: 'Basée à',            icon: '📍' },
              { value: '100%',   label: 'Gratuit',            icon: '💚' },
              { value: 'Bénévoles', label: 'Équipe',          icon: '🤝' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center text-center gap-1">
                <span className="text-2xl">{s.icon}</span>
                <p className="font-black text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Témoignages ─────────────────────────────────────── */}
      <section className="px-8 py-16" style={{ backgroundColor: '#F0EBE1' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-black tracking-widest mb-2" style={{ color: '#D91B5C' }}>ILS NOUS FONT CONFIANCE</p>
            <h2 className="text-3xl font-black text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ce qu'ils en disent
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {TEMOIGNAGES.map(t => (
              <div key={t.nom} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
                <Stars n={t.note} />
                <p className="text-sm text-gray-600 leading-relaxed flex-1 italic">"{t.texte}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                  <div className="w-9 h-9 rounded-full bg-[#D4E6C3] flex items-center justify-center text-xs font-black text-[#3A5220] shrink-0">
                    {t.nom[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-800">{t.nom}</p>
                    <p className="text-xs text-gray-400">{t.ville} · {t.animal}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ───────────────────────────────────────── */}
      <section className="px-8 py-16 text-center" style={{ backgroundColor: '#E8F0DC' }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Prêt à rejoindre L'Arche ?
          </h2>
          <p className="text-sm text-gray-600 mb-8">
            Inscription gratuite en 2 minutes. Propriétaire ou gardien, trouvez votre place dans notre communauté.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register?role=proprio"
              className="px-8 py-4 rounded-xl font-black text-white text-sm hover:opacity-90 transition"
              style={{ backgroundColor: '#3A5220' }}>
              🐾 Je cherche un gardien
            </Link>
            <Link to="/register?role=gardien"
              className="px-8 py-4 rounded-xl font-black text-sm border-2 hover:bg-white transition"
              style={{ borderColor: '#3A5220', color: '#3A5220' }}>
              🏠 Je propose mes services
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={{ backgroundColor: '#3A5220' }}>
        <div className="max-w-5xl mx-auto px-8 py-10 grid grid-cols-4 gap-8">
          <div className="col-span-1">
            <img src="/logo1.png" alt="L'Arche" className="h-8 w-auto mb-3 brightness-0 invert opacity-90" />
            <p className="text-xs text-white/60 leading-relaxed">
              Association loi 1901<br />Lyon, France · 2021
            </p>
          </div>
          {[
            { titre: 'Navigation', liens: [{ label: 'Trouver un gardien', to: '/gardiens' }, { label: 'Fiches espèces', to: '/fiches-especes' }, { label: 'Boutique', to: '/merch' }] },
            { titre: 'Compte',     liens: [{ label: 'Se connecter', to: '/login' }, { label: 'S\'inscrire', to: '/register' }, { label: 'Mon profil', to: '/profil' }] },
            { titre: 'Aide',       liens: [{ label: 'FAQ', to: '/faq' }, { label: 'Contact', to: '/faq#contact' }, { label: 'Signaler', to: '/faq' }] },
          ].map(col => (
            <div key={col.titre}>
              <p className="text-xs font-black tracking-widest mb-3" style={{ color: '#A8C539' }}>{col.titre.toUpperCase()}</p>
              <ul className="flex flex-col gap-2">
                {col.liens.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-white/70 hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-5xl mx-auto px-8 py-4 border-t border-white/10 flex justify-between items-center">
          <span className="text-xs text-white/50">2025 L'Arche · Association loi 1901</span>
          <span className="text-xs font-semibold" style={{ color: '#A8C539' }}>Pour les animaux 🐾</span>
        </div>
      </footer>
    </div>
  )
}
