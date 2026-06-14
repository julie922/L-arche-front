import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { ESPECES as ESPECES_DATA, type Espece, type SousEspece } from '../../data/especes'

const CATEGORIES_LIST = ['chiens', 'chats', 'rongeurs', 'reptiles', 'oiseaux', 'nac'] as const
type Categorie = typeof CATEGORIES_LIST[number]

export default function AdminEspeces() {
  const [especes, setEspeces] = useState<Espece[]>(ESPECES_DATA)
  const [selected, setSelected] = useState<string | null>(null)
  const [editMode, setEditMode] = useState<'espece' | 'sous-espece' | null>(null)

  // Formulaire nouvelle espèce
  const [newEspece, setNewEspece] = useState({ nom: '', categorie: 'chiens' as Categorie, tags: '', description: '' })

  // Formulaire nouvelle sous-espèce
  const [newSous, setNewSous] = useState({ nom: '', tags: '', intro: '' })

  const especeSelectionnee = especes.find(e => e.id === selected)

  const ajouterEspece = () => {
    if (!newEspece.nom.trim()) return
    const id = newEspece.nom.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[̀-ͯ]/g, '')
    const nouvelle: Espece = {
      id, nom: newEspece.nom, nomComplet: `Le ${newEspece.nom}`,
      categorie: newEspece.categorie, tags: newEspece.tags,
      emoji: '🐾', description: newEspece.description, intro: newEspece.description,
      stats: { sociabilite: 5, activite: 5, independance: 5, entretien: 5 },
      gardienInfo: '', sections: [], sousEspeces: [],
    }
    setEspeces(prev => [...prev, nouvelle])
    setNewEspece({ nom: '', categorie: 'chiens', tags: '', description: '' })
    setEditMode(null)
  }

  const supprimerEspece = (id: string) => {
    setEspeces(prev => prev.filter(e => e.id !== id))
    if (selected === id) setSelected(null)
  }

  const ajouterSousEspece = () => {
    if (!newSous.nom.trim() || !selected) return
    const id = newSous.nom.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[̀-ͯ]/g, '')
    const nouvelle: SousEspece = {
      id, nom: newSous.nom, tags: newSous.tags, emoji: '🐾', intro: newSous.intro,
      stats: { sociabilite: 5, activite: 5, independance: 5, entretien: 5 },
      gardienInfo: '', sections: [],
    }
    setEspeces(prev => prev.map(e =>
      e.id === selected ? { ...e, sousEspeces: [...(e.sousEspeces ?? []), nouvelle] } : e
    ))
    setNewSous({ nom: '', tags: '', intro: '' })
    setEditMode(null)
  }

  const supprimerSousEspece = (especeId: string, sousId: string) => {
    setEspeces(prev => prev.map(e =>
      e.id === especeId ? { ...e, sousEspeces: e.sousEspeces?.filter(s => s.id !== sousId) } : e
    ))
  }

  const inputCls = "border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#3A5220] focus:border-transparent"

  return (
    <AdminLayout title="Gestion des espèces">
      <div className="flex gap-6">

        {/* Liste espèces */}
        <div className="w-72 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-gray-700">{especes.length} espèces</h2>
            <button type="button" onClick={() => { setEditMode('espece'); setSelected(null) }}
              className="text-xs font-bold px-3 py-1.5 rounded-lg text-white hover:opacity-90"
              style={{ backgroundColor: '#3A5220' }}>
              + Ajouter
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {CATEGORIES_LIST.map(cat => (
              <div key={cat}>
                <p className="text-xs font-black tracking-widest text-gray-400 uppercase px-2 py-1 mt-2">
                  {cat}
                </p>
                {especes.filter(e => e.categorie === cat).map(e => (
                  <div key={e.id}
                    onClick={() => { setSelected(e.id); setEditMode(null) }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                      selected === e.id ? 'text-[#2D4A18]' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    style={selected === e.id ? { backgroundColor: '#A8C539' } : {}}>
                    <span className="text-sm font-semibold flex items-center gap-2">
                      <span>{e.emoji}</span>{e.nom}
                      <span className="text-xs opacity-60">({e.sousEspeces?.length ?? 0})</span>
                    </span>
                    <button type="button"
                      onClick={ev => { ev.stopPropagation(); supprimerEspece(e.id) }}
                      className="text-xs text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100 ml-2">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Panneau droite */}
        <div className="flex-1">

          {/* Formulaire nouvelle espèce */}
          {editMode === 'espece' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-black text-gray-900 mb-4">Nouvelle espèce</h3>
              <div className="flex flex-col gap-3">
                <input placeholder="Nom (ex: Furet)" value={newEspece.nom} onChange={e => setNewEspece({...newEspece, nom: e.target.value})} className={inputCls} />
                <select value={newEspece.categorie} onChange={e => setNewEspece({...newEspece, categorie: e.target.value as Categorie})} className={inputCls + ' bg-white'}>
                  {CATEGORIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input placeholder="Tags (ex: Joueur, NAC)" value={newEspece.tags} onChange={e => setNewEspece({...newEspece, tags: e.target.value})} className={inputCls} />
                <textarea rows={2} placeholder="Description courte" value={newEspece.description} onChange={e => setNewEspece({...newEspece, description: e.target.value})} className={inputCls + ' resize-none'} />
                <div className="flex gap-2 mt-1">
                  <button type="button" onClick={() => setEditMode(null)} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600">Annuler</button>
                  <button type="button" onClick={ajouterEspece} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: '#3A5220' }}>Créer l'espèce</button>
                </div>
              </div>
            </div>
          )}

          {/* Détail espèce sélectionnée */}
          {especeSelectionnee && editMode !== 'espece' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-xl font-black text-gray-900">{especeSelectionnee.emoji} {especeSelectionnee.nomComplet}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{especeSelectionnee.tags}</p>
                </div>
                <button type="button" onClick={() => { setEditMode('sous-espece') }}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg text-white hover:opacity-90"
                  style={{ backgroundColor: '#D91B5C' }}>
                  + Sous-espèce
                </button>
              </div>

              {/* Liste sous-espèces */}
              <div>
                <p className="text-xs font-black tracking-widest text-gray-400 uppercase mb-3">
                  Sous-espèces ({especeSelectionnee.sousEspeces?.length ?? 0})
                </p>
                {(especeSelectionnee.sousEspeces ?? []).length === 0 ? (
                  <p className="text-sm text-gray-400 italic">Aucune sous-espèce pour l'instant</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {(especeSelectionnee.sousEspeces ?? []).map(s => (
                      <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div>
                          <p className="text-sm font-bold text-gray-800">{s.emoji} {s.nom}</p>
                          <p className="text-xs text-gray-400">{s.tags}</p>
                        </div>
                        <button type="button" onClick={() => supprimerSousEspece(especeSelectionnee.id, s.id)}
                          className="text-xs font-bold text-red-400 hover:text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 transition">
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Formulaire sous-espèce */}
              {editMode === 'sous-espece' && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <h4 className="text-sm font-black text-gray-900 mb-3">Nouvelle sous-espèce</h4>
                  <div className="flex flex-col gap-3">
                    <input placeholder="Nom (ex: Berger Allemand)" value={newSous.nom} onChange={e => setNewSous({...newSous, nom: e.target.value})} className={inputCls} />
                    <input placeholder="Tags (ex: Loyal, intelligent)" value={newSous.tags} onChange={e => setNewSous({...newSous, tags: e.target.value})} className={inputCls} />
                    <textarea rows={2} placeholder="Description courte" value={newSous.intro} onChange={e => setNewSous({...newSous, intro: e.target.value})} className={inputCls + ' resize-none'} />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setEditMode(null)} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600">Annuler</button>
                      <button type="button" onClick={ajouterSousEspece} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: '#D91B5C' }}>Ajouter</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!especeSelectionnee && editMode !== 'espece' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-3xl mb-2">🦎</p>
              <p className="font-bold text-gray-700 mb-1">Sélectionnez une espèce</p>
              <p className="text-sm text-gray-400">Ou créez-en une nouvelle avec le bouton "Ajouter"</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
