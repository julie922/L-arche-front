import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { CATEGORIES_MERCH, type Produit } from '../../data/merch'
import { api } from '../../services/api'

const CATS = CATEGORIES_MERCH.filter(c => c.id !== 'tous')

type FormState = Partial<Omit<Produit, 'id' | 'ordre'>> & { variantInput?: string }

const EMPTY_FORM: FormState = {
  nom: '', description: '', prix: 0, categorie: 'vetements', stock: 0, photo: null, variants: [],
}

export default function AdminMerch() {
  const [produits,       setProduits]       = useState<Produit[]>([])
  const [loading,        setLoading]        = useState(true)
  const [saving,         setSaving]         = useState(false)
  const [loadError,      setLoadError]      = useState('')
  const [saveError,      setSaveError]      = useState('')
  const [selected,       setSelected]       = useState<string | null>(null)
  const [showForm,       setShowForm]       = useState(false)
  const [confirmDelete,  setConfirmDelete]  = useState<string | null>(null)
  const [form,           setForm]           = useState<FormState>(EMPTY_FORM)
  const [variantInput,   setVariantInput]   = useState('')

  useEffect(() => {
    api.get<Produit[]>('/produits')
      .then(data => setProduits(data))
      .catch(err => setLoadError(err instanceof Error ? err.message : 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [])

  const ouvrirNouveauProduit = () => {
    setForm(EMPTY_FORM)
    setVariantInput('')
    setSelected(null)
    setShowForm(true)
    setSaveError('')
  }

  const ouvrirModification = (p: Produit) => {
    setForm({ nom: p.nom, description: p.description, prix: p.prix, categorie: p.categorie, stock: p.stock, photo: p.photo, variants: p.variants ?? [] })
    setVariantInput('')
    setSelected(p.id)
    setShowForm(true)
    setSaveError('')
  }

  const sauvegarder = async () => {
    if (!form.nom?.trim()) return
    setSaving(true)
    setSaveError('')
    try {
      if (selected) {
        const updated = await api.patch<Produit>(`/produits/${selected}`, {
          nom: form.nom, description: form.description ?? '', prix: form.prix ?? 0,
          categorie: form.categorie, stock: form.stock ?? 0,
          photo: form.photo || null, variants: form.variants ?? [],
        })
        setProduits(prev => prev.map(p => p.id === selected ? updated : p))
      } else {
        const created = await api.post<Produit>('/produits', {
          nom: form.nom, description: form.description ?? '', prix: form.prix ?? 0,
          categorie: form.categorie, stock: form.stock ?? 0,
          photo: form.photo || null, variants: form.variants ?? [],
          ordre: produits.length,
        })
        setProduits(prev => [...prev, created])
      }
      setShowForm(false)
      setSelected(null)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const supprimer = async (id: string) => {
    try {
      await api.delete(`/produits/${id}`)
      setProduits(prev => prev.filter(p => p.id !== id))
      setConfirmDelete(null)
      if (selected === id) { setSelected(null); setShowForm(false) }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
      setConfirmDelete(null)
    }
  }

  const deplacer = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= produits.length) return
    const a = produits[index]
    const b = produits[newIndex]
    // Optimistic update
    setProduits(prev => {
      const arr = [...prev]
      ;[arr[index], arr[newIndex]] = [arr[newIndex], arr[index]]
      return arr
    })
    // Persist swapped ordre values
    await Promise.allSettled([
      api.patch(`/produits/${a.id}`, { ordre: b.ordre }),
      api.patch(`/produits/${b.id}`, { ordre: a.ordre }),
    ])
  }

  const addVariant = () => {
    if (!variantInput.trim()) return
    setForm(f => ({ ...f, variants: [...(f.variants ?? []), variantInput.trim()] }))
    setVariantInput('')
  }

  const inputCls = "border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#3A5220]"

  return (
    <AdminLayout title="Gestion des produits">

      {loadError && (
        <div className="mb-4 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">{loadError}</div>
      )}

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          <span className="font-black text-gray-800">{produits.length}</span> produits
        </p>
        <button type="button" onClick={ouvrirNouveauProduit}
          className="px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition"
          style={{ backgroundColor: '#3A5220' }}>
          + Nouveau produit
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-gray-400 text-sm">Chargement...</div>
      ) : (
        <div className="flex gap-6">

          {/* Table produits */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Ordre','Photo','Produit','Catégorie','Prix','Stock',''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-black tracking-widest text-gray-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {produits.map((p, idx) => (
                  <tr key={p.id}
                    onClick={() => { setSelected(p.id); setShowForm(false) }}
                    className={`cursor-pointer transition-colors ${selected === p.id && !showForm ? 'bg-[#E8F0DC]' : 'hover:bg-gray-50'}`}>
                    <td className="px-3 py-3">
                      <div className="flex flex-col gap-0.5">
                        <button type="button"
                          onClick={e => { e.stopPropagation(); void deplacer(idx, -1) }}
                          disabled={idx === 0}
                          className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-xs">
                          ▲
                        </button>
                        <button type="button"
                          onClick={e => { e.stopPropagation(); void deplacer(idx, 1) }}
                          disabled={idx === produits.length - 1}
                          className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-xs">
                          ▼
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-sm overflow-hidden">
                        {p.photo
                          ? <img src={p.photo} alt="" className="w-full h-full object-cover" />
                          : '📦'
                        }
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-800">{p.nom}</p>
                      <p className="text-xs text-gray-400 truncate max-w-45">{p.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8F0DC] text-[#3A5220]">
                        {CATS.find(c => c.id === p.categorie)?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-black text-[#3A5220]">{p.prix} €</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${p.stock < 20 ? 'text-red-500' : 'text-gray-600'}`}>
                        {p.stock} unités
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button type="button" onClick={e => { e.stopPropagation(); ouvrirModification(p) }}
                          className="px-3 py-1 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50">
                          Modifier
                        </button>
                        <button type="button" onClick={e => { e.stopPropagation(); setConfirmDelete(p.id) }}
                          className="px-3 py-1 rounded-lg text-xs font-bold border border-red-100 text-red-500 hover:bg-red-50">
                          ×
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {produits.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                      Aucun produit — créez-en un avec le bouton ci-dessus.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Formulaire produit */}
          {showForm && (
            <div className="w-72 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
              <h3 className="font-black text-gray-900">
                {selected ? 'Modifier' : 'Nouveau produit'}
              </h3>

              {saveError && (
                <div className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">{saveError}</div>
              )}

              {/* Photo URL */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">URL photo (optionnel)</label>
                <input
                  type="url"
                  value={form.photo ?? ''}
                  onChange={e => setForm(f => ({ ...f, photo: e.target.value || null }))}
                  className={inputCls}
                  placeholder="https://…" />
                {form.photo && (
                  <img src={form.photo} alt="" className="mt-2 w-full h-24 object-cover rounded-xl border border-gray-100" />
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Nom</label>
                <input
                  value={form.nom ?? ''}
                  onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                  className={inputCls} placeholder="Nom du produit" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Description</label>
                <textarea rows={3}
                  value={form.description ?? ''}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className={inputCls + ' resize-none'} placeholder="Description..." />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">Prix (€)</label>
                  <input type="number" min="0" step="0.01"
                    value={form.prix ?? 0}
                    onChange={e => setForm(f => ({ ...f, prix: Number(e.target.value) }))}
                    className={inputCls} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">Stock</label>
                  <input type="number" min="0"
                    value={form.stock ?? 0}
                    onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))}
                    className={inputCls} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Catégorie</label>
                <select
                  value={form.categorie ?? 'accessoires'}
                  onChange={e => setForm(f => ({ ...f, categorie: e.target.value as Produit['categorie'] }))}
                  className={inputCls + ' bg-white'}>
                  {CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>

              {/* Variantes */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Variantes</label>
                <div className="flex gap-1">
                  <input
                    value={variantInput}
                    onChange={e => setVariantInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addVariant()}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#3A5220]"
                    placeholder="ex: S, M, L..." />
                  <button type="button" onClick={addVariant}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: '#3A5220' }}>+</button>
                </div>
                {(form.variants ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(form.variants ?? []).map(v => (
                      <span key={v} className="text-xs px-2 py-0.5 rounded-full bg-[#E8F0DC] text-[#3A5220] font-semibold flex items-center gap-1">
                        {v}
                        <button type="button"
                          onClick={() => setForm(f => ({ ...f, variants: f.variants?.filter(x => x !== v) }))}
                          className="text-[#3A5220] hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-1">
                <button type="button" onClick={() => { setShowForm(false); setSelected(null) }}
                  className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600">
                  Annuler
                </button>
                <button type="button" onClick={() => void sauvegarder()} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 transition"
                  style={{ backgroundColor: '#3A5220' }}>
                  {saving ? '…' : 'Sauvegarder'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl">
            <p className="text-lg font-black text-gray-900 mb-2">Supprimer ce produit ?</p>
            <p className="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600">
                Annuler
              </button>
              <button type="button" onClick={() => void supprimer(confirmDelete)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
