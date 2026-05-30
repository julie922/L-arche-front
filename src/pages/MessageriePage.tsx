import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: number
  texte: string
  heure: string
  moi: boolean
  lu: boolean
  photo?: string
}

interface Conversation {
  id: string
  nom: string
  avatar: string | null
  enLigne: boolean
  dernierMessage: string
  heure: string
  nonLus: number
  garde?: { animal: string; dates: string; statut: 'confirmee' | 'en_attente'; gardeId: string }
  messages: Message[]
}

// ─── Mock données ─────────────────────────────────────────────────────────────
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'jules-martin',
    nom: 'Jules Martin',
    avatar: null,
    enLigne: true,
    dernierMessage: 'Super ! Luna a bien mangé c...',
    heure: '14:32',
    nonLus: 0,
    garde: { animal: 'Luna', dates: '10–17 mars 2025', statut: 'confirmee', gardeId: '1' },
    messages: [
      { id: 1, texte: 'Bonjour Camille ! Je suis prêt pour accueillir Luna lundi 😊', heure: '10:14', moi: false, lu: true },
      { id: 2, texte: "Super Jules ! Elle adore jouer avec une balle, je vous l'apporte avec son panier", heure: '10:22', moi: true, lu: true },
      { id: 3, texte: 'Parfait ! Et concernant ses médicaments, je lui donne bien le comprimé le matin avec la gamelle ?', heure: '10:25', moi: false, lu: true },
      { id: 4, texte: 'Exactement, à mélanger dans la pâtée humide. Merci beaucoup Jules 🕯️', heure: '10:31', moi: true, lu: true },
      { id: 5, texte: 'Luna a bien mangé ce matin, elle est en pleine forme ! 🐾', heure: '14:32', moi: false, lu: true, photo: 'mock-luna' },
      { id: 6, texte: 'Oh elle est trop mignonne 🥰 merci pour la photo !', heure: '14:45', moi: true, lu: true },
    ],
  },
  {
    id: 'marie-t',
    nom: 'Marie T.',
    avatar: null,
    enLigne: false,
    dernierMessage: 'Bonjour, je serais disponible d...',
    heure: 'Hier',
    nonLus: 2,
    messages: [
      { id: 1, texte: 'Bonjour, je serais disponible du 20 au 25 mars pour Minou si vous êtes intéressée !', heure: '09:30', moi: false, lu: false },
      { id: 2, texte: 'Je peux aussi faire une visite avant si vous le souhaitez 😊', heure: '09:31', moi: false, lu: false },
    ],
  },
  {
    id: 'lea-r',
    nom: 'Léa R.',
    avatar: null,
    enLigne: false,
    dernierMessage: 'Merci pour votre confiance !',
    heure: 'Lun',
    nonLus: 2,
    messages: [
      { id: 1, texte: 'Bonjour ! Bien sûr que je peux m\'occuper de Rex.', heure: 'Lun 10:00', moi: false, lu: false },
      { id: 2, texte: 'Merci pour votre confiance !', heure: 'Lun 10:02', moi: false, lu: false },
    ],
  },
  {
    id: 'thomas-b',
    nom: 'Thomas B.',
    avatar: null,
    enLigne: false,
    dernierMessage: 'D\'accord, on se retrouve à 18...',
    heure: '12/03',
    nonLus: 0,
    messages: [
      { id: 1, texte: 'Bonjour Thomas, est-ce possible de faire une visite demain ?', heure: '12/03', moi: true, lu: true },
      { id: 2, texte: 'D\'accord, on se retrouve à 18h chez moi !', heure: '12/03', moi: false, lu: true },
    ],
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MessageriePage() {
  const [convs, setConvs]         = useState<Conversation[]>(MOCK_CONVERSATIONS)
  const [activeId, setActiveId]   = useState<string>(MOCK_CONVERSATIONS[0].id)
  const [recherche, setRecherche] = useState('')
  const [texte, setTexte]         = useState('')
  const [photoPreview, setPhotoPreview] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef   = useRef<HTMLInputElement>(null)

  const conv = convs.find(c => c.id === activeId)!

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeId, conv.messages.length])

  // Mark as read on open
  const ouvrirConv = (id: string) => {
    setActiveId(id)
    setConvs(prev => prev.map(c => c.id === id ? { ...c, nonLus: 0, messages: c.messages.map(m => ({ ...m, lu: true })) } : c))
  }

  const envoyer = () => {
    const txt = texte.trim()
    if (!txt && !photoPreview) return
    const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    const msg: Message = {
      id: Date.now(), texte: txt || '', heure: now, moi: true, lu: false,
      photo: photoPreview ? URL.createObjectURL(photoPreview) : undefined,
    }
    setConvs(prev => prev.map(c => c.id === activeId
      ? { ...c, messages: [...c.messages, msg], dernierMessage: txt || '📷 Photo', heure: now }
      : c
    ))
    setTexte('')
    setPhotoPreview(null)
    // TODO: WebSocket → send message
  }

  const filteredConvs = convs.filter(c =>
    c.nom.toLowerCase().includes(recherche.toLowerCase())
  )

  const totalNonLus = convs.reduce((s, c) => s + c.nonLus, 0)

  return (
    <div className="h-screen flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* Navbar */}
      <Header isConnected />

      {/* Corps */}
      <div className="flex flex-1 overflow-hidden" style={{ backgroundColor: '#F0EBE1' }}>

        {/* ── Sidebar contacts ───────────────────────────────── */}
        <aside className="w-64 shrink-0 bg-white border-r border-gray-100 flex flex-col">
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h1 className="font-black text-gray-900">Messages</h1>
              {totalNonLus > 0 && (
                <span className="text-xs font-black text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: '#D91B5C' }}>
                  {totalNonLus}
                </span>
              )}
            </div>
            <input type="text" placeholder="Rechercher..." value={recherche}
              onChange={e => setRecherche(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent" />
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConvs.map(c => (
              <button key={c.id} type="button" onClick={() => ouvrirConv(c.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-l-4 ${
                  activeId === c.id
                    ? 'bg-[#F0EBE1] border-[#3A5220]'
                    : 'border-transparent hover:bg-gray-50'
                }`}>
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-black text-gray-500">
                    {c.nom[0]}
                  </div>
                  {c.enLigne && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#3A5220] border-2 border-white" />
                  )}
                  {c.nonLus > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-black text-white flex items-center justify-center" style={{ backgroundColor: '#D91B5C' }}>
                      {c.nonLus}
                    </div>
                  )}
                </div>
                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${c.nonLus > 0 ? 'font-black text-gray-900' : 'font-semibold text-gray-800'}`}>
                      {c.nom}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">{c.heure}</span>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${c.nonLus > 0 ? 'font-semibold text-gray-700' : 'text-gray-400'}`}>
                    {c.dernierMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* ── Zone chat ──────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F0EBE1]">

          {/* Header conversation */}
          <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-black text-gray-500">
                  {conv.nom[0]}
                </div>
                {conv.enLigne && <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#3A5220] border-2 border-white" />}
              </div>
              <div>
                <p className="font-black text-gray-900 text-sm">{conv.nom}</p>
                <p className="text-xs font-bold" style={{ color: conv.enLigne ? '#D91B5C' : '#9CA3AF' }}>
                  {conv.enLigne ? 'En ligne' : 'Hors ligne'}
                </p>
              </div>
            </div>
            <Link to={`/gardiens/${conv.id}`}
              className="text-sm font-bold hover:underline transition-colors"
              style={{ color: '#3A5220' }}>
              Voir le profil →
            </Link>
          </div>

          {/* Contexte garde */}
          {conv.garde && (
            <div className="mx-6 mt-4 px-4 py-3 rounded-xl flex items-center justify-between" style={{ backgroundColor: '#E8F0DC' }}>
              <div className="flex items-center gap-3">
                <span className="text-lg">🐾</span>
                <div>
                  <p className="text-sm font-black text-gray-900">Garde de {conv.garde.animal} · {conv.garde.dates}</p>
                  <p className="text-xs font-semibold" style={{ color: '#3A5220' }}>
                    {conv.garde.statut === 'confirmee' ? 'Confirmée' : 'En attente'}
                    {' · '}
                    <Link to={`/garde/${conv.garde.gardeId}/suivi`} className="hover:underline">
                      Voir le journal →
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
            {conv.messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.moi ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[60%] ${msg.moi ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {/* Photo */}
                  {msg.photo && (
                    <div className="rounded-2xl overflow-hidden w-52 h-36 bg-gray-200 flex items-center justify-center">
                      {msg.photo === 'mock-luna'
                        ? <div className="w-full h-full bg-[#D4E6C3] flex items-center justify-center text-5xl">🐕</div>
                        : <img src={msg.photo} alt="photo" className="w-full h-full object-cover" />
                      }
                    </div>
                  )}
                  {/* Texte */}
                  {msg.texte && (
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.moi
                        ? 'text-white rounded-br-sm'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm shadow-sm'
                    }`}
                    style={msg.moi ? { backgroundColor: '#3A5220' } : {}}>
                      {msg.texte}
                    </div>
                  )}
                  {/* Heure + statut */}
                  <div className={`flex items-center gap-1 ${msg.moi ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs text-gray-400">{msg.heure}</span>
                    {msg.moi && (
                      <span className="text-xs" style={{ color: msg.lu ? '#3A5220' : '#9CA3AF' }}>✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Preview photo */}
          {photoPreview && (
            <div className="mx-6 mb-2 flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200 w-fit">
              <img src={URL.createObjectURL(photoPreview)} alt="" className="w-10 h-10 rounded-lg object-cover" />
              <span className="text-xs text-gray-600 font-semibold">{photoPreview.name}</span>
              <button type="button" onClick={() => setPhotoPreview(null)} className="text-gray-400 hover:text-red-400 ml-1">×</button>
            </div>
          )}

          {/* Input */}
          <div className="px-6 pb-5 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 flex items-center gap-3 px-4 py-3 shadow-sm">
              {/* Attach */}
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-[#3A5220] transition-colors text-lg shrink-0">
                📎
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={e => setPhotoPreview(e.target.files?.[0] ?? null)} />

              {/* Text */}
              <input type="text" placeholder="Écrire un message..." value={texte}
                onChange={e => setTexte(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && envoyer()}
                className="flex-1 text-sm focus:outline-none bg-transparent placeholder-gray-400" />

              {/* Send */}
              <button type="button" onClick={envoyer}
                disabled={!texte.trim() && !photoPreview}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 transition-all disabled:opacity-30 hover:opacity-90"
                style={{ backgroundColor: '#D91B5C' }}>
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
