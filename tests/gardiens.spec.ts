import { test, expect } from '@playwright/test'
import { mockApiRoutes, loginAs, MOCK_GARDIEN } from './helpers'

test.describe('Recherche gardiens', () => {

  test('la page se charge et affiche une liste', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/gardiens')
    await expect(page.getByRole('banner')).toBeVisible()
  })

  test('les filtres sont présents', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/gardiens')
    const filters = page.locator('button, select, input').first()
    await expect(filters).toBeVisible()
  })

  test('la carte gardien s\'affiche avec les bonnes infos', async ({ page }) => {
    await loginAs(page)
    await page.goto('/gardiens')

    // La carte affiche "Prénom N." (nom tronqué), ex: "Jules M."
    const nomCourt = `${MOCK_GARDIEN.prenom} ${MOCK_GARDIEN.nom[0]}.`
    await expect(page.getByText(nomCourt)).toBeVisible()
    await expect(page.getByText(MOCK_GARDIEN.ville!)).toBeVisible()
  })

  test('cliquer sur "Voir le profil" redirige vers /gardiens/:id', async ({ page }) => {
    await loginAs(page)
    await page.goto('/gardiens')

    const profileLink = page.getByRole('link', { name: /voir le profil|profil/i }).first()
    if (await profileLink.isVisible()) {
      await profileLink.click()
      await expect(page).toHaveURL(new RegExp(`/gardiens/${MOCK_GARDIEN.id}`))
    }
  })

  test('page profil gardien se charge', async ({ page }) => {
    await loginAs(page)
    await page.goto(`/gardiens/${MOCK_GARDIEN.id}`)
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByText(`${MOCK_GARDIEN.prenom} ${MOCK_GARDIEN.nom}`)).toBeVisible()
  })

  test('bouton "Demander une garde" redirige vers /reserver (connecté)', async ({ page }) => {
    await loginAs(page)
    await page.goto(`/gardiens/${MOCK_GARDIEN.id}`)

    const btn = page.getByRole('link', { name: /demander une garde/i }).first()
    await expect(btn).toBeVisible()
    await btn.click()
    await expect(page).toHaveURL(new RegExp(`/gardiens/${MOCK_GARDIEN.id}/reserver`))
  })

  test('page réservation se charge avec les bons éléments', async ({ page }) => {
    await loginAs(page)
    await page.goto(`/gardiens/${MOCK_GARDIEN.id}/reserver`)

    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByText(/date de début/i)).toBeVisible()
    await expect(page.getByText(/date de fin/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /envoyer la demande/i })).toBeVisible()
  })

})
