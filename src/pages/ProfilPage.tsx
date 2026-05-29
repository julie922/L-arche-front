import { useState } from 'react'
import Header from '../components/Header'

type TabKey = 'infos' | 'animaux' | 'gardien' | 'verification' | 'parametres'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'infos',        label: 'Infos personnelles' },
  { key: 'animaux',      label: 'Mes animaux' },
  { key: 'gardien',      label: 'Profil gardien' },
  { key: 'verification', label: 'Vérification' },
  { key: 'parametres',   label: 'Paramètres' },
]

const CARACTERES = ['Joueur', 'Calme', 'Câlin', 'Sociable', 'Timide', 'Énergique', 'Craintif']
const ESPECES_LIST = ['Chien', 'Chat', 'Lapin', 'Oiseau', 'Rongeur', 'Reptile', 'Poisson', 'Autre']

interface Animal {
  id: number; nom: string; espece: string; race: string; age: string
  poids: string; sexe: string; caracteres: string[]; besoins: string; photo: File | null
}

const EMPTY_ANIMAL = (): Animal => ({
  id: Date.now(), nom: '', espece: '', race: '', age: '', poids: '',
  sexe: '', caracteres: [], besoins: '', photo: null,
})

// ─── Toggle ──────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, color = '#D91B5C' }: { checked: boolean; onChange: () => void; color?: string }) {
  return (
    <button type="button" onClick={onChange}
      className="relative w-12 h-6 rounded-full transition-colors shrink-0"
      style={{ backgroundColor: checked ? color : '#D1D5DB' }}>
      <span
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
        style={{ left: checked ? 'calc(100% - 20px)' : '4px' }}
      />
    </button>
  )
}

// ─── Formulaire animal (ajout / édition) ─────────────────────────────────────
function AnimalForm({ initial, onSave, onCancel }: {
  initial: Animal; onSave: (a: Animal) => void; onCancel: () => void
}) {
  const [a, setA] = useState<Animal>(initial)
  const inputCls = "border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent"

  const toggle = (c: string) => setA(prev => ({
    ...prev,
    caracteres: prev.caracteres.includes(c)
      ? prev.caracteres.filter(x => x !== c)
      : [...prev.caracteres, c],
  }))

  return (
    <div className="border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 bg-gray-50">
      {/* Photo */}
      <label className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition bg-white">
        <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0">
          {a.photo
            ? <img src={URL.createObjectURL(a.photo)} alt="" className="w-full h-full rounded-full object-cover" />
            : <span className="text-gray-400 text-xl">+</span>}
        </div>
        <div><p className="text-sm font-bold text-gray-800">Photo</p><p className="text-xs text-gray-400">JPG, PNG — max 5 Mo</p></div>
        <input type="file" accept="image/*" className="hidden" onChange={e => setA({ ...a, photo: e.target.files?.[0] ?? null })} />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Nom</label><input className={inputCls} placeholder="Luna" value={a.nom} onChange={e => setA({ ...a, nom: e.target.value })} /></div>
        <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Espèce</label>
          <select className={inputCls + ' bg-white'} value={a.espece} onChange={e => setA({ ...a, espece: e.target.value })}>
            <option value="">Choisir...</option>
            {ESPECES_LIST.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Race</label><input className={inputCls} placeholder="Border Collie" value={a.race} onChange={e => setA({ ...a, race: e.target.value })} /></div>
        <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Âge</label>
          <input list={`ages-edit-${a.id}`} className={inputCls} placeholder="3 ans" value={a.age} onChange={e => setA({ ...a, age: e.target.value })} />
          <datalist id={`ages-edit-${a.id}`}>
            <option value="Moins d'1 an" />
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => <option key={n} value={`${n} an${n > 1 ? 's' : ''}`} />)}
            <option value="Plus de 15 ans" />
          </datalist>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Poids (kg)</label><input type="number" min="0" className={inputCls} placeholder="18" value={a.poids} onChange={e => setA({ ...a, poids: e.target.value })} /></div>
        <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Sexe</label>
          <select className={inputCls + ' bg-white'} value={a.sexe} onChange={e => setA({ ...a, sexe: e.target.value })}>
            <option value="">Choisir...</option>
            <option value="male">Mâle</option>
            <option value="femelle">Femelle</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-800">Caractère</label>
        <div className="flex flex-wrap gap-2">
          {CARACTERES.map(c => (
            <button key={c} type="button" onClick={() => toggle(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${a.caracteres.includes(c) ? 'bg-[#3A5220] border-[#3A5220] text-white' : 'bg-white border-gray-200 text-gray-700'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-bold text-gray-800">Besoins spécifiques</label>
        <textarea rows={2} className={inputCls + ' resize-none'} placeholder="Régime alimentaire, médicaments, phobies..." value={a.besoins} onChange={e => setA({ ...a, besoins: e.target.value })} />
      </div>

      <div className="flex gap-3 mt-1">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-100 transition">Annuler</button>
        <button type="button" onClick={() => onSave(a)} className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm hover:opacity-90 transition" style={{ backgroundColor: '#3A5220' }}>Sauvegarder</button>
      </div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function ProfilPage() {
  const [tab, setTab] = useState<TabKey>('infos')

  // Infos personnelles
  const [photo, setPhoto]   = useState<File | null>(null)
  const [form, setForm]     = useState({ firstName: '', lastName: '', email: '', phone: '', ville: '', bio: '' })
  const [notifs, setNotifs] = useState({ demandes: true, messages: true, journal: true, avis: false })

  // Animaux
  const [animaux, setAnimaux]       = useState<Animal[]>([])
  const [editingAnimal, setEditing] = useState<Animal | null>(null)
  const [addingAnimal, setAdding]   = useState(false)

  // Profil gardien
  const [gardienActif, setGardienActif] = useState(false)
  const [gardeTypes, setGardeTypes]     = useState({ domicile: false, visite: false, nuit: false, promenade: false })
  const [tarif, setTarif]               = useState('')
  const [biogardien, setBioGardien]     = useState('')

  // Paramètres
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })

  // ── Calcul complétion ──────────────────────────────────────────────────────
  const fields = [
    { filled: !!form.firstName,  weight: 15, label: 'prénom' },
    { filled: !!form.lastName,   weight: 15, label: 'nom' },
    { filled: !!form.email,      weight: 15, label: 'email' },
    { filled: !!form.phone,      weight: 15, label: 'téléphone' },
    { filled: !!form.ville,      weight: 10, label: 'ville' },
    { filled: !!form.bio,        weight: 15, label: 'présentation' },
    { filled: !!photo,           weight: 10, label: 'photo de profil' },
    { filled: animaux.length > 0, weight: 5, label: 'animal' },
  ]
  const completion = fields.filter(f => f.filled).reduce((acc, f) => acc + f.weight, 0)
  const missing = fields.find(f => !f.filled)

  const inputCls = "border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent"

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>

      <Header isConnected />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <h1 className="text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Mon profil</h1>

        {/* Barre de complétion */}
        <div className="bg-white rounded-2xl shadow-sm px-6 py-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-800">Complétion du profil</span>
            <span className="text-sm font-black" style={{ color: '#D91B5C' }}>{completion} %</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${completion}%`, backgroundColor: '#D91B5C' }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {completion === 100
              ? '🎉 Profil complet !'
              : missing ? `Ajoutez votre ${missing.label} pour progresser` : ''}
          </p>
        </div>

        {/* Onglets */}
        <div className="flex gap-0 border-b border-gray-200 mb-6 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.key} type="button" onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-px ${tab === t.key ? 'border-[#3A5220] text-[#3A5220]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Infos personnelles ──────────────────────────────────── */}
        {tab === 'infos' && (
          <div className="bg-white rounded-2xl shadow-sm px-8 py-8">
            <form onSubmit={e => { e.preventDefault() }} className="flex flex-col gap-6">
              {/* Photo */}
              <div className="flex items-center gap-4">
                <label className="relative cursor-pointer">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center transition-colors" style={{ borderColor: '#D91B5C' }}>
                    {photo ? <img src={URL.createObjectURL(photo)} alt="" className="w-full h-full rounded-full object-cover" /> : <span className="text-xl font-bold" style={{ color: '#D91B5C' }}>+</span>}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={e => setPhoto(e.target.files?.[0] ?? null)} />
                </label>
                <div>
                  <p className="text-sm font-bold text-gray-800">Changer la photo</p>
                  <p className="text-xs text-gray-400">JPG ou PNG · Max 5 Mo</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Prénom</label><input type="text" className={inputCls} placeholder="Camille" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} /></div>
                <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Nom</label><input type="text" className={inputCls} placeholder="Dupont" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} /></div>
              </div>
              <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Email</label><input type="email" className={inputCls} placeholder="camille@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Téléphone</label><input type="tel" className={inputCls} placeholder="06 12 34 56 78" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Ville</label><input type="text" className={inputCls} placeholder="Lyon, 69003" value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} /></div>
              <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Présentation courte</label><textarea rows={4} className={inputCls + ' resize-none'} placeholder="Décrivez-vous en quelques mots..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>

              {/* Notifications */}
              <div>
                <h2 className="text-base font-black text-gray-900 mb-4">Notifications</h2>
                <div className="flex flex-col divide-y divide-gray-100">
                  {[
                    { key: 'demandes', label: 'Nouvelles demandes',  desc: 'Recevoir un email à chaque demande reçue' },
                    { key: 'messages', label: 'Nouveaux messages',   desc: 'Notification push pour les messages' },
                    { key: 'journal',  label: 'Journal de garde',    desc: 'Notification quand une mise à jour est publiée' },
                    { key: 'avis',     label: 'Nouveaux avis',       desc: "Recevoir un email quand un avis est laissé" },
                  ].map(n => (
                    <div key={n.key} className="flex items-center justify-between py-3.5">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{n.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#D91B5C' }}>{n.desc}</p>
                      </div>
                      <Toggle checked={notifs[n.key as keyof typeof notifs]} onChange={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key as keyof typeof notifs] }))} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" className="px-8 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition" style={{ backgroundColor: '#3A5220' }}>
                  Sauvegarder les modifications
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Mes animaux ─────────────────────────────────────────── */}
        {tab === 'animaux' && (
          <div className="flex flex-col gap-4">
            {animaux.length === 0 && !addingAnimal && (
              <div className="bg-white rounded-2xl shadow-sm px-8 py-12 text-center">
                <p className="text-4xl mb-3">🐾</p>
                <p className="font-bold text-gray-800 mb-1">Aucun animal pour l'instant</p>
                <p className="text-sm text-gray-400 mb-6">Ajoutez vos compagnons pour que les gardiens puissent les découvrir</p>
                <button type="button" onClick={() => setAdding(true)}
                  className="px-6 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition" style={{ backgroundColor: '#3A5220' }}>
                  + Ajouter un animal
                </button>
              </div>
            )}

            {animaux.map(a => (
              editingAnimal?.id === a.id
                ? <AnimalForm key={a.id} initial={a}
                    onSave={updated => { setAnimaux(prev => prev.map(x => x.id === a.id ? updated : x)); setEditing(null) }}
                    onCancel={() => setEditing(null)} />
                : (
                  <div key={a.id} className="bg-white rounded-2xl shadow-sm px-6 py-5 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-[#D4E6C3] flex items-center justify-center shrink-0 text-2xl">
                      {a.photo ? <img src={URL.createObjectURL(a.photo)} alt="" className="w-full h-full rounded-full object-cover" /> : '🐾'}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-gray-900">{a.nom || '—'}</p>
                      <p className="text-xs text-gray-500">{[a.espece, a.race, a.age].filter(Boolean).join(' · ')}</p>
                      {a.caracteres.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-1.5">
                          {a.caracteres.map(c => <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-[#E8F0DC] text-[#3A5220] font-semibold">{c}</span>)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button type="button" onClick={() => setEditing(a)} className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition">Modifier</button>
                      <button type="button" onClick={() => setAnimaux(prev => prev.filter(x => x.id !== a.id))} className="px-4 py-2 rounded-lg border-2 text-xs font-bold hover:bg-red-50 transition" style={{ borderColor: '#D91B5C', color: '#D91B5C' }}>Supprimer</button>
                    </div>
                  </div>
                )
            ))}

            {addingAnimal && (
              <AnimalForm initial={EMPTY_ANIMAL()}
                onSave={a => { setAnimaux(prev => [...prev, a]); setAdding(false) }}
                onCancel={() => setAdding(false)} />
            )}

            {(animaux.length > 0 && !addingAnimal && !editingAnimal) && (
              <button type="button" onClick={() => setAdding(true)}
                className="self-start px-5 py-2.5 rounded-xl border-2 font-bold text-sm hover:bg-pink-50 transition" style={{ borderColor: '#D91B5C', color: '#D91B5C' }}>
                + Ajouter un autre animal
              </button>
            )}
          </div>
        )}

        {/* ── Profil gardien ──────────────────────────────────────── */}
        {tab === 'gardien' && (
          <div className="bg-white rounded-2xl shadow-sm px-8 py-8 flex flex-col gap-6">
            {/* Activation */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <p className="font-black text-gray-900">Activer mon profil gardien</p>
                <p className="text-xs text-gray-400 mt-0.5">Votre profil sera visible par les propriétaires</p>
              </div>
              <Toggle checked={gardienActif} onChange={() => setGardienActif(g => !g)} color="#3A5220" />
            </div>

            {/* Types de garde */}
            <div>
              <p className="text-sm font-bold text-gray-800 mb-3">Types de garde proposés</p>
              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                {[
                  { key: 'domicile',  label: 'Garde à mon domicile',  desc: "L'animal dort et vit chez moi" },
                  { key: 'visite',    label: 'Visite à domicile',      desc: 'Je me déplace chez le propriétaire' },
                  { key: 'nuit',      label: 'Garde de nuit',          desc: 'Je reste chez le propriétaire' },
                  { key: 'promenade', label: 'Promenade uniquement',   desc: 'Sorties quotidiennes' },
                ].map(t => (
                  <div key={t.key} className="flex items-center justify-between px-4 py-3">
                    <div><p className="text-sm font-bold text-gray-800">{t.label}</p><p className="text-xs text-gray-500">{t.desc}</p></div>
                    <Toggle checked={gardeTypes[t.key as keyof typeof gardeTypes]} onChange={() => setGardeTypes(g => ({ ...g, [t.key]: !g[t.key as keyof typeof gardeTypes] }))} color="#3A5220" />
                  </div>
                ))}
              </div>
            </div>

            {/* Tarif */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-800">Tarif journalier (€)</label>
              <input type="number" min="0" className={inputCls} placeholder="ex : 25" value={tarif} onChange={e => setTarif(e.target.value)} />
            </div>

            {/* Présentation gardien */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-800">Présentation gardien</label>
              <textarea rows={4} className={inputCls + ' resize-none'} placeholder="Décrivez votre expérience, votre environnement..." value={biogardien} onChange={e => setBioGardien(e.target.value)} />
            </div>

            <div className="flex justify-end">
              <button type="button" className="px-8 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition" style={{ backgroundColor: '#3A5220' }}>
                Sauvegarder
              </button>
            </div>
          </div>
        )}

        {/* ── Vérification ────────────────────────────────────────── */}
        {tab === 'verification' && (
          <div className="bg-white rounded-2xl shadow-sm px-8 py-8 flex flex-col gap-4">
            <p className="text-sm text-gray-500 mb-2">Complétez ces vérifications pour renforcer la confiance avec la communauté.</p>
            {[
              { label: 'Adresse email',     desc: 'Vérifiez votre adresse email',         done: !!form.email },
              { label: 'Numéro de téléphone', desc: 'Confirmez votre numéro par SMS',      done: !!form.phone },
              { label: 'Identité',          desc: 'Envoyez une pièce d\'identité',         done: false },
              { label: 'Profil complété',   desc: 'Atteignez 100% de complétion',          done: completion === 100 },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between border border-gray-100 rounded-xl px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${item.done ? 'text-white' : 'bg-gray-100 text-gray-400'}`}
                    style={item.done ? { backgroundColor: '#3A5220' } : {}}>
                    {item.done ? '✓' : '–'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                </div>
                {!item.done && (
                  <button type="button" className="px-4 py-1.5 rounded-lg text-xs font-bold border-2 hover:bg-gray-50 transition border-gray-300 text-gray-600">
                    Vérifier
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Paramètres ──────────────────────────────────────────── */}
        {tab === 'parametres' && (
          <div className="flex flex-col gap-6">
            {/* Mot de passe */}
            <div className="bg-white rounded-2xl shadow-sm px-8 py-8 flex flex-col gap-5">
              <h2 className="text-base font-black text-gray-900">Changer le mot de passe</h2>
              <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Mot de passe actuel</label><input type="password" className={inputCls} placeholder="••••••••" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} /></div>
              <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Nouveau mot de passe</label><input type="password" className={inputCls} placeholder="••••••••" value={passwords.next} onChange={e => setPasswords({ ...passwords, next: e.target.value })} /></div>
              <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Confirmer le nouveau mot de passe</label><input type="password" className={inputCls} placeholder="••••••••" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} /></div>
              <div className="flex justify-end">
                <button type="button" className="px-8 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition" style={{ backgroundColor: '#3A5220' }}>
                  Mettre à jour
                </button>
              </div>
            </div>

            {/* Zone danger */}
            <div className="bg-white rounded-2xl shadow-sm px-8 py-8">
              <h2 className="text-base font-black text-red-600 mb-1">Zone dangereuse</h2>
              <p className="text-xs text-gray-400 mb-5">Ces actions sont irréversibles.</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between border border-red-100 rounded-xl px-5 py-4">
                  <div><p className="text-sm font-bold text-gray-800">Désactiver mon compte</p><p className="text-xs text-gray-400">Votre profil ne sera plus visible</p></div>
                  <button type="button" className="px-4 py-2 rounded-lg text-xs font-bold border-2 border-red-200 text-red-500 hover:bg-red-50 transition">Désactiver</button>
                </div>
                <div className="flex items-center justify-between border border-red-100 rounded-xl px-5 py-4">
                  <div><p className="text-sm font-bold text-gray-800">Supprimer mon compte</p><p className="text-xs text-gray-400">Toutes vos données seront supprimées définitivement</p></div>
                  <button type="button" className="px-4 py-2 rounded-lg text-xs font-bold border-2 border-red-400 text-red-600 hover:bg-red-50 transition">Supprimer</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
