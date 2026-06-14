import { useState, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

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
  id: string
  nom: string; espece: string; race: string; age: string
  poids: string; sexe: string; caracteres: string[]; besoins: string
  infos_veterinaire: string; photo_url: string | null
}

const EMPTY_ANIMAL = (): Animal => ({
  id: `new-${Date.now()}`, nom: '', espece: '', race: '', age: '', poids: '',
  sexe: '', caracteres: [], besoins: '', infos_veterinaire: '', photo_url: null,
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

// ─── Formulaire animal ────────────────────────────────────────────────────────
function AnimalForm({ initial, onSave, onCancel, isSaving }: {
  initial: Animal; onSave: (a: Animal) => void; onCancel: () => void; isSaving: boolean
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
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Nom *</label><input className={inputCls} placeholder="Luna" value={a.nom} onChange={e => setA({ ...a, nom: e.target.value })} /></div>
        <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Espèce *</label>
          <select className={inputCls + ' bg-white'} value={a.espece} onChange={e => setA({ ...a, espece: e.target.value })}>
            <option value="">Choisir...</option>
            {ESPECES_LIST.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Race</label><input className={inputCls} placeholder="Border Collie" value={a.race} onChange={e => setA({ ...a, race: e.target.value })} /></div>
        <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Âge</label>
          <input list={`ages-${a.id}`} className={inputCls} placeholder="3 ans" value={a.age} onChange={e => setA({ ...a, age: e.target.value })} />
          <datalist id={`ages-${a.id}`}>
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
        <textarea rows={2} className={inputCls + ' resize-none'} placeholder="Régime alimentaire, médicaments..." value={a.besoins} onChange={e => setA({ ...a, besoins: e.target.value })} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-bold text-gray-800">Infos vétérinaire</label>
        <input className={inputCls} placeholder="Dr Rousseau — 04 72 00 00 00" value={a.infos_veterinaire} onChange={e => setA({ ...a, infos_veterinaire: e.target.value })} />
      </div>
      <div className="flex gap-3 mt-1">
        <button type="button" onClick={onCancel} disabled={isSaving} className="px-5 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-100 transition disabled:opacity-50">Annuler</button>
        <button type="button" onClick={() => onSave(a)} disabled={isSaving || !a.nom || !a.espece}
          className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm hover:opacity-90 transition disabled:opacity-50" style={{ backgroundColor: '#3A5220' }}>
          {isSaving ? 'Enregistrement...' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function ProfilPage() {
  const { user, reloadUser } = useAuth()
  const [tab, setTab]        = useState<TabKey>('infos')
  const [loadingAnimaux, setLoadingAnimaux] = useState(true)
  const [saveError, setSaveError]           = useState('')
  const [saveSuccess, setSaveSuccess]       = useState('')
  const [isSaving, setIsSaving]             = useState(false)

  // Infos personnelles
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', ville: '', bio: '',
  })
  const [notifs, setNotifs] = useState({ demandes: true, messages: true, journal: true, avis: false })

  // Animaux
  const [animaux, setAnimaux]           = useState<Animal[]>([])
  const [editingAnimal, setEditing]     = useState<Animal | null>(null)
  const [addingAnimal, setAdding]       = useState(false)
  const [animalSaving, setAnimalSaving] = useState(false)

  // Profil gardien
  const [gardienActif, setGardienActif] = useState(false)
  const [gardeTypes, setGardeTypes]     = useState({ domicile: false, visite: false, nuit: false, promenade: false })
  const [tarif, setTarif]               = useState('')
  const [biogardien, setBioGardien]     = useState('')

  // Paramètres
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })

  // ── Pré-remplir les champs depuis le contexte auth ───────────────────────────
  useEffect(() => {
    if (!user) return
    setForm(f => ({
      ...f,
      firstName: user.prenom || '',
      lastName:  user.nom    || '',
      email:     user.email  || '',
      ville:     user.ville  || '',
    }))
    setGardienActif(user.est_gardien)
  }, [user])

  // ── Charger les animaux ──────────────────────────────────────────────────────
  const loadAnimaux = useCallback(async () => {
    setLoadingAnimaux(true)
    try {
      const res = await api.get<{ data: Record<string, unknown>[]; total: number }>('/animals')
      const items: Animal[] = (res.data || []).map((a) => ({
        id:                String(a.id),
        nom:               String(a.nom || ''),
        espece:            String(a.espece || ''),
        race:              String(a.race || ''),
        age:               String(a.age || ''),
        poids:             a.poids ? String(a.poids) : '',
        sexe:              String(a.sexe || ''),
        caracteres:        Array.isArray(a.caractere) ? (a.caractere as string[]) : [],
        besoins:           String(a.besoins_specifiques || ''),
        infos_veterinaire: String(a.infos_veterinaire || ''),
        photo_url:         a.photo_url ? String(a.photo_url) : null,
      }))
      setAnimaux(items)
    } catch {
      // silently ignore — liste vide
    } finally {
      setLoadingAnimaux(false)
    }
  }, [])

  useEffect(() => { loadAnimaux() }, [loadAnimaux])

  // ── Calcul complétion ────────────────────────────────────────────────────────
  const fields = [
    { filled: !!form.firstName,   weight: 20, label: 'prénom' },
    { filled: !!form.lastName,    weight: 20, label: 'nom' },
    { filled: !!form.phone,       weight: 20, label: 'téléphone' },
    { filled: !!form.ville,       weight: 15, label: 'ville' },
    { filled: !!form.bio,         weight: 20, label: 'présentation' },
    { filled: animaux.length > 0, weight: 5,  label: 'animal' },
  ]
  const completion = fields.filter(f => f.filled).reduce((acc, f) => acc + f.weight, 0)
  const missing    = fields.find(f => !f.filled)

  const inputCls = "border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent"

  const flash = (msg: string, isError = false) => {
    if (isError) { setSaveError(msg); setSaveSuccess('') }
    else         { setSaveSuccess(msg); setSaveError('') }
    setTimeout(() => { setSaveError(''); setSaveSuccess('') }, 3000)
  }

  // ── Sauvegarder infos personnelles ───────────────────────────────────────────
  const handleSaveInfos = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await api.patch('/users/me', {
        nom:         form.lastName,
        prenom:      form.firstName,
        telephone:   form.phone   || undefined,
        ville:       form.ville   || undefined,
        description: form.bio     || undefined,
      })
      await reloadUser()
      flash('Modifications enregistrées')
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde', true)
    } finally {
      setIsSaving(false)
    }
  }

  // ── Sauvegarder profil gardien ───────────────────────────────────────────────
  const handleSaveGardien = async () => {
    setIsSaving(true)
    const types = Object.entries(gardeTypes).filter(([, v]) => v).map(([k]) => k)
    try {
      await api.patch('/users/me', {
        est_gardien:         gardienActif,
        type_de_garde:       types,
        tarif:               tarif ? parseFloat(tarif) : null,
        description_gardien: biogardien || undefined,
      })
      await reloadUser()
      flash('Profil gardien enregistré')
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde', true)
    } finally {
      setIsSaving(false)
    }
  }

  // ── CRUD animaux ─────────────────────────────────────────────────────────────
  const handleSaveAnimal = async (a: Animal) => {
    setAnimalSaving(true)
    const payload = {
      nom:                 a.nom,
      espece:              a.espece,
      race:                a.race               || undefined,
      age:                 a.age                || undefined,
      poids:               a.poids              || undefined,
      sexe:                a.sexe               || undefined,
      caractere:           a.caracteres,
      besoins_specifiques: a.besoins            || undefined,
      infos_veterinaire:   a.infos_veterinaire  || undefined,
    }
    try {
      if (a.id.startsWith('new-')) {
        const created = await api.post<{ id: string }>('/animals', payload)
        setAnimaux(prev => [...prev, { ...a, id: created.id }])
      } else {
        await api.patch(`/animals/${a.id}`, payload)
        setAnimaux(prev => prev.map(x => x.id === a.id ? { ...a } : x))
      }
      setAdding(false)
      setEditing(null)
    } catch (err) {
      flash(err instanceof Error ? err.message : "Erreur lors de l'enregistrement", true)
    } finally {
      setAnimalSaving(false)
    }
  }

  const handleDeleteAnimal = async (id: string) => {
    if (!confirm('Supprimer cet animal ?')) return
    try {
      await api.delete(`/animals/${id}`)
      setAnimaux(prev => prev.filter(x => x.id !== id))
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Erreur lors de la suppression', true)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0EBE1', fontFamily: "'Nunito', sans-serif" }}>

      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <h1 className="text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Mon profil</h1>

        {/* Messages flash */}
        {saveError   && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{saveError}</div>}
        {saveSuccess && <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{saveSuccess}</div>}

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
            {completion === 100 ? '🎉 Profil complet !' : missing ? `Ajoutez votre ${missing.label} pour progresser` : ''}
          </p>
        </div>

        {/* Onglets */}
        <div className="flex gap-0 border-b border-gray-200 mb-6">
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
            <form onSubmit={handleSaveInfos} className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Prénom</label><input type="text" className={inputCls} placeholder="Camille" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} /></div>
                <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Nom</label><input type="text" className={inputCls} placeholder="Dupont" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} /></div>
              </div>
              <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Téléphone</label><input type="tel" className={inputCls} placeholder="06 12 34 56 78" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Ville</label><input type="text" className={inputCls} placeholder="Lyon, 69003" value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} /></div>
              <div className="flex flex-col gap-1"><label className="text-sm font-bold text-gray-800">Présentation courte</label><textarea rows={4} className={inputCls + ' resize-none'} placeholder="Décrivez-vous en quelques mots..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>

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
                <button type="submit" disabled={isSaving} className="px-8 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition disabled:opacity-50" style={{ backgroundColor: '#3A5220' }}>
                  {isSaving ? 'Enregistrement...' : 'Sauvegarder les modifications'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Mes animaux ─────────────────────────────────────────── */}
        {tab === 'animaux' && (
          <div className="flex flex-col gap-4">
            {loadingAnimaux && <div className="text-center py-8 text-gray-400 text-sm">Chargement...</div>}

            {!loadingAnimaux && animaux.length === 0 && !addingAnimal && (
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
                ? <AnimalForm key={a.id} initial={a} isSaving={animalSaving}
                    onSave={handleSaveAnimal}
                    onCancel={() => setEditing(null)} />
                : (
                  <div key={a.id} className="bg-white rounded-2xl shadow-sm px-6 py-5 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-[#D4E6C3] flex items-center justify-center shrink-0 text-2xl overflow-hidden">
                      {a.photo_url
                        ? <img src={a.photo_url} alt={a.nom} className="w-full h-full object-cover" />
                        : '🐾'}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-gray-900">{a.nom || '—'}</p>
                      <p className="text-xs text-gray-500">{[a.espece, a.race, a.age].filter(Boolean).join(' · ')}</p>
                      {a.caracteres.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-1.5">
                          {a.caracteres.map(c => <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-[#E8F0DC] text-[#3A5220] font-semibold">{c}</span>)}
                        </div>
                      )}
                      {a.infos_veterinaire && (
                        <p className="text-xs text-gray-400 mt-1.5">🏥 {a.infos_veterinaire}</p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button type="button" onClick={() => setEditing(a)} className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition">Modifier</button>
                      <button type="button" onClick={() => handleDeleteAnimal(a.id)} className="px-4 py-2 rounded-lg border-2 text-xs font-bold hover:bg-red-50 transition" style={{ borderColor: '#D91B5C', color: '#D91B5C' }}>Supprimer</button>
                    </div>
                  </div>
                )
            ))}

            {addingAnimal && (
              <AnimalForm initial={EMPTY_ANIMAL()} isSaving={animalSaving}
                onSave={handleSaveAnimal}
                onCancel={() => setAdding(false)} />
            )}

            {!loadingAnimaux && animaux.length > 0 && !addingAnimal && !editingAnimal && (
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
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <p className="font-black text-gray-900">Activer mon profil gardien</p>
                <p className="text-xs text-gray-400 mt-0.5">Votre profil sera visible par les propriétaires</p>
              </div>
              <Toggle checked={gardienActif} onChange={() => setGardienActif(g => !g)} color="#3A5220" />
            </div>

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

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-800">Tarif journalier (€)</label>
              <input type="number" min="0" className={inputCls} placeholder="ex : 25" value={tarif} onChange={e => setTarif(e.target.value)} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-800">Présentation gardien</label>
              <textarea rows={4} className={inputCls + ' resize-none'} placeholder="Décrivez votre expérience, votre environnement..." value={biogardien} onChange={e => setBioGardien(e.target.value)} />
            </div>

            <div className="flex justify-end">
              <button type="button" disabled={isSaving} onClick={handleSaveGardien}
                className="px-8 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition disabled:opacity-50" style={{ backgroundColor: '#3A5220' }}>
                {isSaving ? 'Enregistrement...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        )}

        {/* ── Vérification ────────────────────────────────────────── */}
        {tab === 'verification' && (
          <div className="bg-white rounded-2xl shadow-sm px-8 py-8 flex flex-col gap-4">
            <p className="text-sm text-gray-500 mb-2">Complétez ces vérifications pour renforcer la confiance avec la communauté.</p>
            {[
              { label: 'Adresse email',       desc: 'Vérifiez votre adresse email',    done: !!user?.email },
              { label: 'Numéro de téléphone', desc: 'Confirmez votre numéro par SMS',  done: !!form.phone },
              { label: 'Identité',            desc: "Envoyez une pièce d'identité",    done: user?.identite_verifiee ?? false },
              { label: 'Profil complété',     desc: 'Atteignez 100% de complétion',    done: completion >= 90 },
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
