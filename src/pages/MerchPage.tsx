import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { CATEGORIES_MERCH, type Produit } from '../data/merch'
import { api } from '../services/api'

interface CartItem { produit: Produit; quantite: number; variant?: string }

// ─── Carte produit ────────────────────────────────────────────────────────────
function CarteProduit({ p, onAjouter }: { p: Produit; onAjouter: (p: Produit, variant?: string) => void }) {
  const [variant, setVariant] = useState(p.variants?.[0] ?? '')
  const [added, setAdded]     = useState(false)

  const handleAdd = () => {
    onAjouter(p, variant || undefined)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col">
      {/* Image */}
      <div className="h-44 bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
        {p.photo
          ? <img src={p.photo} alt={p.nom} className="w-full h-full object-cover" />
          : <span className="text-4xl opacity-20">📦</span>
        }
      </div>

      {/* Infos */}
      <div className="px-4 py-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-black text-gray-900 text-sm leading-tight">{p.nom}</p>
          <p className="font-black text-lg shrink-0" style={{ color: '#3A5220' }}>{p.prix} €</p>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed flex-1">{p.description}</p>

        {/* Variantes */}
        {p.variants && p.variants.length > 0 && (
          <select value={variant} onChange={e => setVariant(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#3A5220]">
            {p.variants.map(v => <option key={v}>{v}</option>)}
          </select>
        )}

        {/* Stock faible */}
        {p.stock < 20 && (
          <p className="text-xs font-bold" style={{ color: '#D91B5C' }}>
            Plus que {p.stock} en stock
          </p>
        )}

        <button type="button" onClick={handleAdd}
          className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
            added ? 'bg-[#A8C539] text-[#2D4A18]' : 'text-white hover:opacity-90'
          }`}
          style={!added ? { backgroundColor: '#3A5220' } : {}}>
          {added ? '✓ Ajouté !' : 'Ajouter au panier'}
        </button>
      </div>
    </div>
  )
}

// ─── Panier ───────────────────────────────────────────────────────────────────
function Panier({ items, onClose, onRemove }: {
  items: CartItem[]; onClose: () => void; onRemove: (id: string) => void
}) {
  const total = items.reduce((s, i) => s + i.produit.prix * i.quantite, 0)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-80 h-full shadow-2xl flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-black text-gray-900">Mon panier ({items.length})</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <p className="text-3xl mb-3">🛒</p>
              <p className="font-bold text-gray-700 mb-1">Panier vide</p>
              <p className="text-xs text-gray-400">Ajoutez des articles pour commencer</p>
            </div>
          ) : items.map(item => (
            <div key={`${item.produit.id}-${item.variant}`} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-xl shrink-0 overflow-hidden">
                {item.produit.photo && <img src={item.produit.photo} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{item.produit.nom}</p>
                {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
                <p className="text-sm font-black" style={{ color: '#3A5220' }}>{item.produit.prix} €</p>
              </div>
              <button type="button" onClick={() => onRemove(item.produit.id)}
                className="text-gray-300 hover:text-red-400 transition-colors text-lg shrink-0">×</button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="text-xl font-black" style={{ color: '#3A5220' }}>{total} €</span>
            </div>
            <button type="button"
              className="w-full py-3.5 rounded-xl font-bold text-white hover:opacity-90 transition"
              style={{ backgroundColor: '#3A5220' }}>
              Commander →
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">Paiement sécurisé — à venir</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function MerchPage() {
  const [produits,  setProduits]  = useState<Produit[]>([])
  const [loading,   setLoading]   = useState(true)
  const [categorie, setCategorie] = useState('tous')
  const [prixMax,   setPrixMax]   = useState(50)
  const [tri,       setTri]       = useState<'pertinence' | 'prix-asc' | 'prix-desc'>('pertinence')
  const [cart,      setCart]      = useState<CartItem[]>([])
  const [cartOpen,  setCartOpen]  = useState(false)

  useEffect(() => {
    api.get<Produit[]>('/produits')
      .then(data => setProduits(data))
      .finally(() => setLoading(false))
  }, [])

  const ajouterAuPanier = (p: Produit, variant?: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.produit.id === p.id && i.variant === variant)
      if (existing) return prev.map(i => i.produit.id === p.id && i.variant === variant ? { ...i, quantite: i.quantite + 1 } : i)
      return [...prev, { produit: p, quantite: 1, variant }]
    })
  }

  const retirerDuPanier = (id: string) =>
    setCart(prev => prev.filter(i => i.produit.id !== id))

  const nbArticles = cart.reduce((s, i) => s + i.quantite, 0)

  let filtered = produits.filter(p => {
    const matchCat  = categorie === 'tous' || p.categorie === categorie
    const matchPrix = p.prix <= prixMax
    return matchCat && matchPrix
  })

  if (tri === 'prix-asc')  filtered = [...filtered].sort((a, b) => a.prix - b.prix)
  if (tri === 'prix-desc') filtered = [...filtered].sort((a, b) => b.prix - a.prix)

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Header />

      {/* Banner */}
      <div className="w-full py-12 px-8 flex flex-col items-center text-center" style={{ backgroundColor: '#3A5220' }}>
        <p className="text-xs font-black tracking-widest mb-2" style={{ color: '#A8C539' }}>BOUTIQUE</p>
        <h1 className="text-3xl font-black text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          La boutique L'Arche
        </h1>
        <p className="text-white/70 text-sm max-w-md">
          Chaque achat soutient notre association et la lutte contre l'abandon animal.
        </p>
      </div>

      <div className="flex flex-1" style={{ backgroundColor: '#F0EBE1' }}>

        {/* Sidebar filtres */}
        <aside className="w-56 shrink-0 bg-white border-r border-gray-100 px-5 py-6 flex flex-col gap-6">
          <h2 className="text-base font-black text-gray-900">Filtres</h2>

          {/* Catégories */}
          <div>
            <p className="text-xs font-black tracking-widest text-gray-400 mb-2">CATÉGORIE</p>
            <div className="flex flex-col gap-1">
              {CATEGORIES_MERCH.map(cat => (
                <button key={cat.id} type="button" onClick={() => setCategorie(cat.id)}
                  className={`text-left px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    categorie === cat.id ? 'text-[#2D4A18] font-black' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={categorie === cat.id ? { backgroundColor: '#A8C539' } : {}}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prix max */}
          <div>
            <p className="text-xs font-black tracking-widest text-gray-400 mb-2">PRIX MAX</p>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>0 €</span>
              <span className="font-black" style={{ color: '#3A5220' }}>{prixMax} €</span>
            </div>
            <input type="range" min={5} max={50} step={1} value={prixMax}
              onChange={e => setPrixMax(Number(e.target.value))}
              className="w-full accent-[#3A5220]" />
          </div>

          {/* Tri */}
          <div>
            <p className="text-xs font-black tracking-widest text-gray-400 mb-2">TRIER PAR</p>
            <select value={tri} onChange={e => setTri(e.target.value as typeof tri)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#3A5220]">
              <option value="pertinence">Pertinence</option>
              <option value="prix-asc">Prix croissant</option>
              <option value="prix-desc">Prix décroissant</option>
            </select>
          </div>
        </aside>

        {/* Produits */}
        <main className="flex-1 px-6 py-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-700">
              <span className="font-black">{filtered.length} produit{filtered.length > 1 ? 's' : ''}</span>
            </p>
            {/* Bouton panier */}
            <button type="button" onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border-2 border-gray-200 bg-white hover:border-[#3A5220] transition-colors relative">
              🛒 Panier
              {nbArticles > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-black text-white flex items-center justify-center"
                  style={{ backgroundColor: '#D91B5C' }}>
                  {nbArticles}
                </span>
              )}
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16 text-gray-400 text-sm">Chargement...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map(p => (
                <CarteProduit key={p.id} p={p} onAjouter={ajouterAuPanier} />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-4 text-center py-16">
                  <p className="text-3xl mb-2">🛍️</p>
                  <p className="font-bold text-gray-700">Aucun produit dans cette gamme</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Panier slide */}
      {cartOpen && (
        <Panier items={cart} onClose={() => setCartOpen(false)} onRemove={retirerDuPanier} />
      )}
    </div>
  )
}
