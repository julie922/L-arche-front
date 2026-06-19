import { test, expect } from '@playwright/test'

test.describe('FAQ', () => {

  test('la FAQ se charge avec des questions', async ({ page }) => {
    await page.goto('/faq')
    await expect(page.getByRole('heading', { name: /Comment pouvons-nous/ })).toBeVisible()
    await expect(page.getByText('Comment fonctionne la vérification')).toBeVisible()
  })

  test('la barre de recherche filtre les questions', async ({ page }) => {
    await page.goto('/faq')
    await page.getByPlaceholder('Rechercher dans la FAQ').fill('paiement')
    // La question sur le paiement doit être visible
    await expect(page.getByText('Comment fonctionne le paiement entre propriétaire')).toBeVisible()
    // La question sur la vérification ne doit plus apparaître
    await expect(page.getByText('Comment fonctionne la vérification')).not.toBeVisible()
  })

  test('vider la recherche réaffiche toutes les questions', async ({ page }) => {
    await page.goto('/faq')
    await page.getByPlaceholder('Rechercher dans la FAQ').fill('paiement')
    await page.getByPlaceholder('Rechercher dans la FAQ').clear()
    await expect(page.getByText('Comment fonctionne la vérification')).toBeVisible()
  })

  test('le filtre par catégorie fonctionne', async ({ page }) => {
    await page.goto('/faq')
    await page.getByRole('button', { name: 'Gardes' }).click()
    await expect(page.getByText(/urgence pendant une garde/i)).toBeVisible()
    await expect(page.getByText(/vérification d'identité/i)).not.toBeVisible()
  })

  test('un accordéon s\'ouvre au clic', async ({ page }) => {
    await page.goto('/faq')
    await page.getByText('Comment fonctionne le paiement entre propriétaire').click()
    await expect(page.getByText(/rémunération est convenue/i)).toBeVisible()
  })

  test('le formulaire de contact est visible', async ({ page }) => {
    await page.goto('/faq')
    await expect(page.getByPlaceholder('Camille').first()).toBeVisible()
    await expect(page.getByPlaceholder('votre@email.com')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Envoyer le message' })).toBeVisible()
  })
})
