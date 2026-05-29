import { useState } from 'react'
import { Link } from 'react-router-dom'

type Role = 'proprio' | 'gardien' | 'les-deux' | null

interface Animal {
  nom: string; espece: string; race: string; age: string
  poids: string; sexe: string; caracteres: string[]
  besoins: string; photo: File | null
}

const EMPTY_ANIMAL: Animal = {
  nom: '', espece: '', race: '', age: '', poids: '', sexe: '',
  caracteres: [], besoins: '', photo: null,
}

const CARACTERES = ['Joueur', 'Calme', 'Câlin', 'Sociable', 'Timide', 'Énergique', 'Craintif']

type StepKey = 'infos' | 'animal' | 'experience' | 'dispos' | 'verif'

const STEP_LABELS: Record<StepKey, string> = {
  infos:      'Infos',
  animal:     'Mon animal',
  experience: 'Expérience',
  dispos:     'Disponibilités',
  verif:      'Vérification',
}

const STEPS_PROPRIO:  StepKey[] = ['infos', 'animal', 'verif']
const STEPS_GARDIEN:  StepKey[] = ['infos', 'experience', 'dispos', 'verif']
const STEPS_LES_DEUX: StepKey[] = ['infos', 'animal', 'experience', 'dispos', 'verif']

function getSteps(role: Role): StepKey[] {
  if (role === 'gardien') return STEPS_GARDIEN
  if (role === 'les-deux') return STEPS_LES_DEUX
  return STEPS_PROPRIO
}

// ─── Indicateur d'étapes ────────────────────────────────────────────────────
function StepIndicator({ steps, current }: { steps: StepKey[]; current: number }) {
  return (
    <div className="flex items-start justify-center flex-wrap gap-0 mb-8">
      {steps.map((key, i) => {
        const label = STEP_LABELS[key]
        const n = i + 1
        const done = n < current
        const active = n === current
        return (
          <div key={n} className="flex items-start">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                done ? 'bg-[#5A7A1A] border-[#5A7A1A] text-white'
                  : active ? 'bg-[#3A5220] border-[#3A5220] text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {done ? '✓' : n}
              </div>
              <span className={`mt-1 text-xs font-semibold ${active ? 'text-gray-800' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 h-[2px] mt-[18px] ${done ? 'bg-[#5A7A1A]' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Toggle switch ───────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-[#3A5220]' : 'bg-gray-300'}`}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  )
}

// ─── Calendrier de disponibilités ────────────────────────────────────────────
// dayOfWeek : 0=Lundi … 6=Dimanche
const DAY_LABELS  = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const DAY_NAMES   = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MONTH_NAMES = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

interface CalendarProps {
  selected: Set<string>
  onChange: (s: Set<string>) => void
  recurring: number[]           // indices jours 0=Lun … 6=Dim
  onRecurringChange: (r: number[]) => void
}

function CalendarPicker({ selected, onChange, recurring, onRecurringChange }: CalendarProps) {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear]   = useState(today.getFullYear())

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const firstDay   = new Date(year, month, 1).getDay()
  const offset     = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // dayOfWeek d'une date (lundi=0)
  const getDow = (d: number) => {
    const raw = new Date(year, month, d).getDay()
    return raw === 0 ? 6 : raw - 1
  }

  const toggleDate = (key: string) => {
    const next = new Set(selected)
    next.has(key) ? next.delete(key) : next.add(key)
    onChange(next)
  }

  const toggleRecurring = (dow: number) => {
    onRecurringChange(
      recurring.includes(dow)
        ? recurring.filter(d => d !== dow)
        : [...recurring, dow]
    )
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 flex flex-col gap-4">

      {/* Récurrence rapide */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Répéter chaque semaine</p>
        <div className="flex gap-1.5 flex-wrap">
          {DAY_NAMES.map((name, dow) => (
            <button key={dow} type="button" onClick={() => toggleRecurring(dow)}
              className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${
                recurring.includes(dow)
                  ? 'bg-[#3A5220] border-[#3A5220] text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}>
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Navigation mois */}
      <div className="flex justify-between items-center">
        <button type="button" onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">‹</button>
        <span className="font-bold text-gray-800">{MONTH_NAMES[month]} {year}</span>
        <button type="button" onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">›</button>
      </div>

      {/* En-têtes jours */}
      <div className="grid grid-cols-7">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Grille */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day   = i + 1
          const key   = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dow   = getDow(day)
          const isRecurring = recurring.includes(dow)
          const isSpecific  = selected.has(key)
          return (
            <button key={key} type="button" onClick={() => toggleDate(key)}
              title={isRecurring ? 'Jour récurrent (clic pour exception)' : ''}
              className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                isSpecific  ? 'bg-[#3A5220] text-white' :
                isRecurring ? 'bg-[#7AAD4A] text-white' :
                'hover:bg-[#E8F0DC] text-gray-700'
              }`}>
              {day}
            </button>
          )
        })}
      </div>

      {/* Légende */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-sm bg-[#3A5220]" />
          <span className="text-xs text-gray-600">Date précise</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-sm bg-[#7AAD4A]" />
          <span className="text-xs text-gray-600">Récurrent</span>
        </div>
      </div>
    </div>
  )
}

// ─── Composant principal ─────────────────────────────────────────────────────
export default function RegisterPage() {
  const [step, setStep]   = useState(1)
  const [role, setRole]   = useState<Role>(null)

  const [infos, setInfos] = useState({ firstName: '', lastName: '', email: '', password: '', cgu: false })
  const [animaux, setAnimaux] = useState<Animal[]>([{ ...EMPTY_ANIMAL }])
  const [dispos, setDispos]       = useState<Set<string>>(new Set())
  const [recurring, setRecurring] = useState<number[]>([])
  const [gardeTypes, setGardeTypes] = useState({ domicile: false, visite: false, nuit: false, promenade: false })
  const [experience, setExperience] = useState({
    niveau: '' as '' | 'debutant' | 'intermediaire' | 'experimente',
    annees: '',
    bio: '',
    animauxGardes: [] as string[],
  })

  const steps = getSteps(role)
  const totalSteps = steps.length
  const stepKey: StepKey = steps[step - 1] ?? 'infos'

  const goNext = () => setStep(s => s + 1)
  const goBack = () => setStep(s => s - 1)

  const updateAnimal = (index: number, field: keyof Animal, value: string | File | null) =>
    setAnimaux(prev => prev.map((a, i) => i === index ? { ...a, [field]: value } : a))

  const toggleCaractere = (index: number, c: string) =>
    setAnimaux(prev => prev.map((a, i) =>
      i === index ? { ...a, caracteres: a.caracteres.includes(c) ? a.caracteres.filter(x => x !== c) : [...a.caracteres, c] } : a
    ))

  const addAnimal    = () => setAnimaux(prev => [...prev, { ...EMPTY_ANIMAL }])
  const removeAnimal = (i: number) => setAnimaux(prev => prev.filter((_, idx) => idx !== i))

  const handleFinalSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // TODO: appel API
  }

  // Formulaire commun label + input
  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1">{children && <label className="text-sm font-bold text-gray-800">{label}</label>}{children}</div>
  )
  const inputCls = "border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent"

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <header className="w-full h-16 bg-[#0D0D0D]" />
      <div className="w-full h-[3px] bg-[#4A90D9]" />

      <main className="flex-1 flex flex-col items-center px-4 py-10" style={{ backgroundColor: '#F0EBE1' }}>

        {/* ── Étape 1 : Infos ──────────────────────────────────── */}
        {step === 1 && (
          <>
            <img src="/logo1.png" alt="L'Arche" className="h-16 w-auto mb-8" />
            <div className="bg-white rounded-2xl shadow-sm w-full max-w-[520px] overflow-hidden">
              <div className="px-10 py-8">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Créer mon compte</h1>
                  <p className="text-sm text-gray-500">Rejoignez la communauté de L'Arche en 2 minutes</p>
                </div>
                <form onSubmit={e => { e.preventDefault(); goNext() }} className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Prénom"><input type="text" placeholder="Camille" required value={infos.firstName} onChange={e => setInfos({ ...infos, firstName: e.target.value })} className={inputCls} /></Field>
                    <Field label="Nom"><input type="text" placeholder="Dupont" required value={infos.lastName} onChange={e => setInfos({ ...infos, lastName: e.target.value })} className={inputCls} /></Field>
                  </div>
                  <Field label="Email"><input type="email" placeholder="camille@email.com" required value={infos.email} onChange={e => setInfos({ ...infos, email: e.target.value })} className={inputCls} /></Field>
                  <Field label="Mot de passe">
                    <input type="password" placeholder="8 caractères minimum" required minLength={8} value={infos.password} onChange={e => setInfos({ ...infos, password: e.target.value })} className={inputCls} />
                    <span className="text-xs text-gray-400">Entrez un mot de passe sécurisé</span>
                  </Field>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-800">Je suis...</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'proprio',  icon: '🐾', label: 'Propriétaire', desc: 'Je cherche un gardien pour mon animal' },
                        { id: 'gardien',  icon: '🏠', label: 'Gardien',      desc: "J'accueille les animaux chez moi" },
                        { id: 'les-deux', icon: '🤝', label: 'Les deux',     desc: 'Propriétaire ET gardien' },
                      ].map(o => (
                        <button key={o.id} type="button" onClick={() => setRole(o.id as Role)}
                          className={`flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all ${role === o.id ? 'border-[#3A5220] bg-[#3A5220]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                          <span className="text-2xl mb-2">{o.icon}</span>
                          <span className="text-sm font-bold text-gray-800 mb-1">{o.label}</span>
                          <span className="text-xs text-gray-500 leading-tight">{o.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" required checked={infos.cgu} onChange={e => setInfos({ ...infos, cgu: e.target.checked })} className="mt-0.5 w-4 h-4 accent-[#3A5220] shrink-0" />
                    <span className="text-sm text-gray-600">
                      J'accepte les <a href="#" style={{ color: '#D91B5C' }} className="font-semibold hover:underline">CGU</a> et la <a href="#" style={{ color: '#D91B5C' }} className="font-semibold hover:underline">Politique de confidentialité</a>
                    </span>
                  </label>
                  <button type="submit" disabled={!role} className="w-full py-3.5 rounded-xl font-bold text-white hover:opacity-90 transition disabled:opacity-40" style={{ backgroundColor: '#3A5220' }}>
                    Créer mon compte →
                  </button>
                </form>
              </div>
              <div className="border-t border-gray-100 bg-gray-50 px-10 py-4 text-center">
                <p className="text-sm text-gray-500">Déjà un compte ? <Link to="/login" className="font-bold hover:underline" style={{ color: '#D91B5C' }}>Se connecter</Link></p>
              </div>
            </div>
          </>
        )}

        {/* Indicateur visible à partir de l'étape 2 */}
        {step > 1 && <StepIndicator steps={steps} current={step} />}

        {/* ── Étape Mon animal (proprio / les-deux) ────────────── */}
        {step > 1 && stepKey === 'animal' && (
          <div className="bg-white rounded-2xl shadow-sm w-full max-w-[520px] px-8 py-8">
            <p className="text-xs font-black tracking-widest mb-1" style={{ color: '#5A7A1A' }}>ÉTAPE {step} SUR {totalSteps}</p>
            <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Mon animal</h1>
            <p className="text-sm text-gray-500 mb-6">Présentez votre compagnon pour trouver le gardien parfait</p>
            <form onSubmit={e => { e.preventDefault(); goNext() }} className="flex flex-col gap-6">
              {animaux.map((a, idx) => (
                <div key={idx} className={`flex flex-col gap-4 ${idx > 0 ? 'border-t border-gray-100 pt-6' : ''}`}>
                  {animaux.length > 1 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-600">Animal {idx + 1}</span>
                      <button type="button" onClick={() => removeAnimal(idx)} className="text-xs font-semibold hover:underline" style={{ color: '#D91B5C' }}>Supprimer</button>
                    </div>
                  )}
                  <label className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition">
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0">
                      {a.photo ? <img src={URL.createObjectURL(a.photo)} alt="" className="w-full h-full rounded-full object-cover" /> : <span className="text-gray-400 text-xl">+</span>}
                    </div>
                    <div><p className="text-sm font-bold text-gray-800">Photo de votre animal</p><p className="text-xs text-gray-400">JPG, PNG — max 5 Mo</p></div>
                    <input type="file" accept="image/*" className="hidden" onChange={e => updateAnimal(idx, 'photo', e.target.files?.[0] ?? null)} />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Nom"><input type="text" placeholder="Luna" value={a.nom} onChange={e => updateAnimal(idx, 'nom', e.target.value)} className={inputCls} /></Field>
                    <Field label="Espèce"><input type="text" placeholder="Chien" value={a.espece} onChange={e => updateAnimal(idx, 'espece', e.target.value)} className={inputCls} /></Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Race"><input type="text" placeholder="Border Collie" value={a.race} onChange={e => updateAnimal(idx, 'race', e.target.value)} className={inputCls} /></Field>
                    <Field label="Âge">
                      <input list={`ages-${idx}`} placeholder="3 ans" value={a.age} onChange={e => updateAnimal(idx, 'age', e.target.value)} className={inputCls} />
                      <datalist id={`ages-${idx}`}>
                        <option value="Moins d'1 an" />
                        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => <option key={n} value={`${n} an${n > 1 ? 's' : ''}`} />)}
                        <option value="Plus de 15 ans" />
                      </datalist>
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Poids (kg)"><input type="number" placeholder="18" min="0" value={a.poids} onChange={e => updateAnimal(idx, 'poids', e.target.value)} className={inputCls} /></Field>
                    <Field label="Sexe">
                      <select value={a.sexe} onChange={e => updateAnimal(idx, 'sexe', e.target.value)} className={inputCls + ' bg-white'}>
                        <option value="">Choisir...</option>
                        <option value="male">Mâle</option>
                        <option value="femelle">Femelle</option>
                      </select>
                    </Field>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-800">Caractère (sélection multiple)</label>
                    <div className="flex flex-wrap gap-2">
                      {CARACTERES.map(c => (
                        <button key={c} type="button" onClick={() => toggleCaractere(idx, c)}
                          className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${a.caracteres.includes(c) ? 'bg-[#3A5220] border-[#3A5220] text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Field label="Besoins spécifiques">
                    <textarea rows={3} placeholder="Régime alimentaire, médicaments, phobies..." value={a.besoins} onChange={e => updateAnimal(idx, 'besoins', e.target.value)} className={inputCls + ' resize-none'} />
                  </Field>
                </div>
              ))}
              <button type="button" onClick={addAnimal} className="self-start px-4 py-2 rounded-xl border-2 text-sm font-bold hover:bg-pink-50 transition" style={{ borderColor: '#D91B5C', color: '#D91B5C' }}>
                + Ajouter un autre animal
              </button>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={goBack} className="px-6 py-3 rounded-xl border-2 border-gray-800 text-gray-800 font-bold text-sm hover:bg-gray-50 transition">← Retour</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition" style={{ backgroundColor: '#3A5220' }}>Continuer →</button>
              </div>
            </form>
          </div>
        )}

        {/* ── Étape Expérience ──────────────────────────────────── */}
        {step > 1 && stepKey === 'experience' && (
          <div className="bg-white rounded-2xl shadow-sm w-full max-w-[520px] px-8 py-8">
            <p className="text-xs font-black tracking-widest mb-1" style={{ color: '#5A7A1A' }}>ÉTAPE {step} SUR {totalSteps}</p>
            <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Mon expérience</h1>
            <p className="text-sm text-gray-500 mb-6">Parlez-nous de votre expérience avec les animaux</p>

            <form onSubmit={e => { e.preventDefault(); goNext() }} className="flex flex-col gap-5">

              {/* Niveau d'expérience */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-800">Niveau d'expérience</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'debutant',      icon: '🌱', label: 'Débutant',      desc: 'Peu ou pas d\'expérience' },
                    { id: 'intermediaire', icon: '🐕', label: 'Intermédiaire', desc: 'Quelques années de pratique' },
                    { id: 'experimente',   icon: '🏅', label: 'Expérimenté',   desc: 'Longue expérience animale' },
                  ].map(o => (
                    <button key={o.id} type="button"
                      onClick={() => setExperience(ex => ({ ...ex, niveau: o.id as typeof experience.niveau }))}
                      className={`flex flex-col items-center text-center p-3 rounded-xl border-2 transition-all ${
                        experience.niveau === o.id ? 'border-[#3A5220] bg-[#3A5220]/5' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <span className="text-2xl mb-1">{o.icon}</span>
                      <span className="text-xs font-bold text-gray-800 mb-0.5">{o.label}</span>
                      <span className="text-[10px] text-gray-500 leading-tight">{o.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Années d'expérience */}
              <Field label="Années d'expérience avec des animaux">
                <input type="number" min="0" max="50" placeholder="ex : 5"
                  value={experience.annees}
                  onChange={e => setExperience(ex => ({ ...ex, annees: e.target.value }))}
                  className={inputCls} />
              </Field>

              {/* Animaux déjà gardés */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-800">Animaux déjà gardés</label>
                <div className="flex flex-wrap gap-2">
                  {['Chien', 'Chat', 'Lapin', 'Oiseau', 'Rongeur', 'Reptile', 'Poisson', 'Autre'].map(a => {
                    const selected = experience.animauxGardes.includes(a)
                    return (
                      <button key={a} type="button"
                        onClick={() => setExperience(ex => ({
                          ...ex,
                          animauxGardes: selected
                            ? ex.animauxGardes.filter(x => x !== a)
                            : [...ex.animauxGardes, a],
                        }))}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
                          selected ? 'bg-[#3A5220] border-[#3A5220] text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}>
                        {a}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Présentation */}
              <Field label="Présentez-vous en quelques mots">
                <textarea rows={4}
                  placeholder="Décrivez votre expérience, votre environnement, pourquoi vous aimez les animaux..."
                  value={experience.bio}
                  onChange={e => setExperience(ex => ({ ...ex, bio: e.target.value }))}
                  className={inputCls + ' resize-none'} />
              </Field>

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={goBack} className="px-6 py-3 rounded-xl border-2 border-gray-800 text-gray-800 font-bold text-sm hover:bg-gray-50 transition">← Retour</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition" style={{ backgroundColor: '#3A5220' }}>Continuer →</button>
              </div>
            </form>
          </div>
        )}


        {/* ── Étape Disponibilités ──────────────────────────────── */}
        {step > 1 && stepKey === 'dispos' && (
          <div className="bg-white rounded-2xl shadow-sm w-full max-w-[520px] px-8 py-8">
            <p className="text-xs font-black tracking-widest mb-1" style={{ color: '#5A7A1A' }}>ÉTAPE {step} SUR {totalSteps}</p>
            <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Mes disponibilités</h1>
            <p className="text-sm text-gray-500 mb-6">Indiquez quand vous pouvez accueillir des animaux</p>

            <form onSubmit={e => { e.preventDefault(); goNext() }} className="flex flex-col gap-6">
              <CalendarPicker selected={dispos} onChange={setDispos} recurring={recurring} onRecurringChange={setRecurring} />

              {/* Types de garde */}
              <div>
                <p className="text-sm font-bold text-gray-800 mb-3">Types de garde proposés</p>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {[
                    { key: 'domicile',  label: 'Garde à mon domicile',    desc: "L'animal dort et vit chez moi" },
                    { key: 'visite',    label: 'Visite à domicile',        desc: 'Je me déplace chez le propriétaire' },
                    { key: 'nuit',      label: 'Garde de nuit',            desc: 'Je reste chez le propriétaire' },
                    { key: 'promenade', label: 'Promenade uniquement',     desc: 'Sorties quotidiennes' },
                  ].map(t => (
                    <div key={t.key} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{t.label}</p>
                        <p className="text-xs text-gray-500">{t.desc}</p>
                      </div>
                      <Toggle
                        checked={gardeTypes[t.key as keyof typeof gardeTypes]}
                        onChange={() => setGardeTypes(g => ({ ...g, [t.key]: !g[t.key as keyof typeof gardeTypes] }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={goBack} className="px-6 py-3 rounded-xl border-2 border-gray-800 text-gray-800 font-bold text-sm hover:bg-gray-50 transition">← Retour</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition" style={{ backgroundColor: '#3A5220' }}>Continuer →</button>
              </div>
            </form>
          </div>
        )}

        {/* ── Étape Vérification ────────────────────────────────── */}
        {step > 1 && stepKey === 'verif' && (
          <div className="bg-white rounded-2xl shadow-sm w-full max-w-[520px] px-8 py-8">
            <p className="text-xs font-black tracking-widest mb-1" style={{ color: '#5A7A1A' }}>ÉTAPE {step} SUR {totalSteps}</p>
            <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Vérification</h1>
            <p className="text-sm text-gray-500 mb-6">Vérifiez vos informations avant de valider</p>
            <form onSubmit={handleFinalSubmit} className="flex flex-col gap-5">
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-2">
                <p><span className="font-bold">Nom :</span> {infos.firstName} {infos.lastName}</p>
                <p><span className="font-bold">Email :</span> {infos.email}</p>
                {animaux.map((a, i) => a.nom && (
                  <p key={i}><span className="font-bold">Animal {animaux.length > 1 ? i + 1 : ''} :</span> {a.nom} ({a.espece})</p>
                ))}
                {experience.niveau && <p><span className="font-bold">Expérience :</span> {experience.niveau} {experience.annees ? `— ${experience.annees} ans` : ''}</p>}
                {dispos.size > 0 && <p><span className="font-bold">Disponibilités :</span> {dispos.size} jour(s) sélectionné(s)</p>}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={goBack} className="px-6 py-3 rounded-xl border-2 border-gray-800 text-gray-800 font-bold text-sm hover:bg-gray-50 transition">← Retour</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition" style={{ backgroundColor: '#3A5220' }}>
                  Valider mon inscription →
                </button>
              </div>
            </form>
          </div>
        )}


      </main>
    </div>
  )
}
