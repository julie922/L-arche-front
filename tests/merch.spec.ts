import { test, expect } from '@playwright/test'

test.describe('Boutique Merch', () => {

  test('la boutique se charge avec des produits', async ({ page }) => {
    await page.goto('/merch')
    await expect(page.getByRole('heading', { name: 'La boutique L\'Arche' })).toBeVisible()
    await expect(page.getByText("Tote bag L'Arche")).toBeVisible()
  })

  test('le filtre "Vêtements" affiche le t-shirt', async ({ page }) => {
    await page.goto('/merch')
    await page.getByRole('button', { name: 'Vêtements' }).click()
    await expect(page.getByText('T-shirt "Pour les animaux"')).toBeVisible()
  })

  test('le panier s\'ouvre après avoir ajouté un produit', async ({ page }) => {
    await page.goto('/merch')
    await page.getByRole('button', { name: 'Ajouter au panier' }).first().click()
    // Ouvrir le panier via le bouton
    await page.getByRole('button', { name: /Panier/ }).click()
    await expect(page.getByText('Mon panier')).toBeVisible()
    await expect(page.getByText('(1)')).toBeVisible()
  })

  test('le panier se ferme avec le bouton ×', async ({ page }) => {
    await page.goto('/merch')
    await page.getByRole('button', { name: 'Ajouter au panier' }).first().click()
    await page.getByRole('button', { name: /Panier/ }).click()
    await expect(page.getByText('Mon panier')).toBeVisible()
    // Le × de fermeture du panier est le premier bouton ×
    await page.getByRole('button', { name: '×' }).first().click()
    await expect(page.getByText('Mon panier')).not.toBeVisible()
  })

  test('le curseur de prix filtre les produits', async ({ page }) => {
    await page.goto('/merch')
    await page.locator('input[type="range"]').fill('10')
    await expect(page.getByText('8 €')).toBeVisible()
    // Le t-shirt à 25€ ne doit plus apparaître
    await expect(page.getByText('25 €')).not.toBeVisible()
  })
})
