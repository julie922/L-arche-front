export interface Produit {
  id: string
  nom: string
  description: string
  prix: number
  categorie: 'vetements' | 'maison' | 'animal' | 'accessoires'
  stock: number
  photo: string | null
  variants?: string[]
  ordre: number
}

export const CATEGORIES_MERCH = [
  { id: 'tous',        label: 'Tous' },
  { id: 'vetements',   label: 'Vêtements' },
  { id: 'maison',      label: 'Maison' },
  { id: 'animal',      label: 'Pour ton animal' },
  { id: 'accessoires', label: 'Accessoires' },
] as const
