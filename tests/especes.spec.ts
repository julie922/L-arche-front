import { test, expect } from '@playwright/test'

test.describe('Fiches espèces', () => {

  test('la page liste affiche les 10 espèces', async ({ page }) => {
    await page.goto('/fiches-especes')
    const cartes = page.locator('a[href^="/fiches-especes/"]')
    await expect(cartes).toHaveCount(10)
  })

  test('le filtre "Chiens" ne montre que les chiens', async ({ page }) => {
    await page.goto('/fiches-especes')
    await page.getByRole('button', { name: 'Chiens' }).click()
    const cartes = page.locator('a[href^="/fiches-especes/"]')
    await expect(cartes).toHaveCount(1)
    await expect(cartes.first()).toContainText('Chien')
  })

  test('le filtre "Chats" ne montre que les chats', async ({ page }) => {
    await page.goto('/fiches-especes')
    await page.getByRole('button', { name: 'Chats' }).click()
    await expect(page.locator('a[href^="/fiches-especes/"]').first()).toContainText('Chat')
  })

  test('le filtre "Tous" réaffiche toutes les espèces', async ({ page }) => {
    await page.goto('/fiches-especes')
    await page.getByRole('button', { name: 'Chiens' }).click()
    await page.getByRole('button', { name: 'Tous' }).click()
    await expect(page.locator('a[href^="/fiches-especes/"]')).toHaveCount(10)
  })

  test('cliquer sur une espèce ouvre la fiche détail', async ({ page }) => {
    await page.goto('/fiches-especes')
    await page.locator('a[href="/fiches-especes/chien"]').click()
    await expect(page).toHaveURL('/fiches-especes/chien')
    await expect(page.getByRole('heading', { name: 'Le Chien' })).toBeVisible()
  })

  test('la fiche chien affiche les sous-espèces', async ({ page }) => {
    await page.goto('/fiches-especes/chien')
    await expect(page.getByText('Races & variétés')).toBeVisible()
    await expect(page.getByText('Berger Allemand')).toBeVisible()
    await expect(page.getByText('Golden Retriever')).toBeVisible()
  })

  test('cliquer sur une sous-espèce ouvre sa fiche', async ({ page }) => {
    await page.goto('/fiches-especes/chien')
    await page.getByRole('link', { name: 'Berger Allemand' }).click()
    await expect(page).toHaveURL('/fiches-especes/chien/berger-allemand')
    await expect(page.getByRole('heading', { name: 'Berger Allemand' })).toBeVisible()
  })

  test('l\'accordéon s\'ouvre et se ferme', async ({ page }) => {
    await page.goto('/fiches-especes/chien')
    const accordion = page.getByRole('button', { name: 'Alimentation' })
    await accordion.click()
    await expect(page.getByText(/nourri 1 à 2 fois/)).toBeVisible()
    await accordion.click()
    await expect(page.getByText(/nourri 1 à 2 fois/)).not.toBeVisible()
  })
})
