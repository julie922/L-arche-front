import { test, expect } from '@playwright/test'

test.describe('Recherche gardiens', () => {

  test('la page de recherche affiche des gardiens', async ({ page }) => {
    await page.goto('/gardiens')
    await expect(page.getByText(/gardiens trouvés/i)).toBeVisible()
    await expect(page.getByText('Jules M.')).toBeVisible()
  })

  test('le filtre note minimum fonctionne', async ({ page }) => {
    await page.goto('/gardiens')
    // Cliquer sur 4.5+ pour filtrer les notes très élevées
    await page.getByRole('button', { name: /4\.5\+/ }).click()
    await expect(page.getByText(/gardiens trouvés/i)).toBeVisible()
  })

  test('cliquer sur un gardien ouvre son profil', async ({ page }) => {
    await page.goto('/gardiens')
    await page.getByRole('link', { name: 'Jules M.' }).click()
    await expect(page).toHaveURL('/gardiens/jules-martin')
    await expect(page.getByRole('heading', { name: 'Jules Martin' })).toBeVisible()
  })

  test('le profil gardien affiche les avis et le calendrier', async ({ page }) => {
    await page.goto('/gardiens/jules-martin')
    await expect(page.getByText(/Avis/)).toBeVisible()
    await expect(page.getByText(/Disponibilités/)).toBeVisible()
    await expect(page.getByText('Camille R.')).toBeVisible()
  })

  test('le bouton "Demander une garde" navigue vers la réservation', async ({ page }) => {
    await page.goto('/gardiens/jules-martin')
    await page.getByRole('link', { name: 'Demander une garde' }).first().click()
    await expect(page).toHaveURL('/gardiens/jules-martin/reserver')
    await expect(page.getByText('Réserver Jules Martin')).toBeVisible()
  })

  test('la page de réservation affiche les animaux', async ({ page }) => {
    await page.goto('/gardiens/jules-martin/reserver')
    await expect(page.getByText('Animal concerné')).toBeVisible()
    await expect(page.getByText('Luna')).toBeVisible()
    await expect(page.getByText('Minou')).toBeVisible()
  })

  test('sélectionner un animal affiche la section vétérinaire', async ({ page }) => {
    await page.goto('/gardiens/jules-martin/reserver')
    await page.getByText('Luna').click()
    // La section vétérinaire doit apparaître
    // La section vétérinaire apparaît avec le label
    await expect(page.locator('label', { hasText: /Vétérinaire/ }).first()).toBeVisible()
  })
})
