export interface Produit {
  id: string
  nom: string
  description: string
  prix: number
  categorie: 'vetements' | 'maison' | 'animal' | 'accessoires'
  stock: number
  photo: string | null
  variants?: string[]
}

export const CATEGORIES_MERCH = [
  { id: 'tous',        label: 'Tous' },
  { id: 'vetements',   label: 'Vêtements' },
  { id: 'maison',      label: 'Maison' },
  { id: 'animal',      label: 'Pour ton animal' },
  { id: 'accessoires', label: 'Accessoires' },
] as const

export const MOCK_PRODUITS: Produit[] = [
  { id: 'tote-bag',    nom: 'Tote bag L\'Arche',          description: 'Tote bag en coton bio sérigraphié avec le logo L\'Arche. Résistant et éco-responsable.',       prix: 15,  categorie: 'maison',       stock: 42, photo: null, variants: ['Naturel', 'Vert forêt'] },
  { id: 'tshirt',      nom: 'T-shirt "Pour les animaux"', description: 'T-shirt unisexe 100% coton bio. Sérigraphie haute qualité. Lavage 30°.',                       prix: 25,  categorie: 'vetements',    stock: 28, photo: null, variants: ['XS','S','M','L','XL'] },
  { id: 'mug',         nom: 'Mug L\'Arche',               description: 'Mug en céramique 33cl avec l\'illustration L\'Arche. Passe au lave-vaisselle.',                prix: 12,  categorie: 'maison',       stock: 56, photo: null },
  { id: 'gourde',      nom: 'Gourde inox L\'Arche',       description: 'Gourde isotherme 500ml en inox. Garde chaud 12h et froid 24h. Sérigraphiée.',                   prix: 22,  categorie: 'maison',       stock: 19, photo: null, variants: ['Vert forêt', 'Blanc'] },
  { id: 'porte-cle',   nom: 'Porte-clé émaillé',          description: 'Porte-clé en métal émaillé avec une illustration d\'animal L\'Arche. Disponible en 5 modèles.', prix: 8,   categorie: 'accessoires',  stock: 84, photo: null, variants: ['Chien','Chat','Lapin','Oiseau','Tortue'] },
  { id: 'gamelle',     nom: 'Gamelle personnalisée',       description: 'Gamelle en inox avec le nom de votre animal gravé. Anti-dérapante. Taille M et L disponibles.',  prix: 22,  categorie: 'animal',       stock: 15, photo: null, variants: ['M (500ml)','L (900ml)'] },
  { id: 'collier',     nom: 'Collier brodé L\'Arche',      description: 'Collier en nylon résistant avec broderie L\'Arche. 3 tailles : S, M, L.',                       prix: 14,  categorie: 'animal',       stock: 31, photo: null, variants: ['S','M','L'] },
  { id: 'sticker-pack',nom: 'Pack stickers',               description: 'Pack de 6 stickers illustrés par notre artiste partenaire. Waterproof.',                        prix: 6,   categorie: 'accessoires',  stock: 120, photo: null },
]
