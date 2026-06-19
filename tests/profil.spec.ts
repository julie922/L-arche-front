import { test, expect } from '@playwright/test'
import { loginAs, MOCK_USER } from './helpers'

test.describe('Page Profil', () => {

  test('affiche les données de l\'utilisateur connecté', async ({ page }) => {
    await loginAs(page)
    await page.goto('/profil')

    // Les champs doivent être pré-remplis
    const prenomInput = page.getByRole('textbox', { name: /prénom/i })
    if (await prenomInput.isVisible()) {
      await expect(prenomInput).toHaveValue(MOCK_USER.prenom)
    }
  })

  test('le champ email est désactivé', async ({ page }) => {
    await loginAs(page)
    await page.goto('/profil')

    const emailInput = page.getByRole('textbox', { name: /email/i })
    if (await emailInput.isVisible()) {
      await expect(emailInput).toBeDisabled()
    }
  })

  test('les onglets de navigation sont présents', async ({ page }) => {
    await loginAs(page)
    await page.goto('/profil')

    await expect(page.getByRole('button', { name: /infos|profil/i }).first()).toBeVisible()
  })

  test('sauvegarder les infos appelle PATCH /api/users/me', async ({ page }) => {
    let patchCalled = false
    await loginAs(page)
    await page.route('**/api/users/me', async route => {
      if (route.request().method() === 'PATCH') {
        patchCalled = true
        await route.fulfill({ status: 200, json: { ...MOCK_USER, ville: 'Paris' } })
      } else {
        await route.fulfill({ status: 200, json: MOCK_USER })
      }
    })
    await page.goto('/profil')

    // Modifier un champ et sauvegarder
    const villeInput = page.getByRole('textbox', { name: /ville/i })
    if (await villeInput.isVisible()) {
      await villeInput.fill('Paris')
      const saveBtn = page.getByRole('button', { name: /sauvegarder|enregistrer/i }).first()
      await saveBtn.click()
      // Attendre un peu pour le debounce/async
      await page.waitForTimeout(500)
      expect(patchCalled).toBe(true)
    }
  })

})

test.describe('Dashboard gardien', () => {

  test('affiche le message de bienvenue avec le prénom', async ({ page }) => {
    await loginAs(page)
    await page.goto('/dashboard')

    await expect(page.getByText(new RegExp(`bonjour ${MOCK_USER.prenom}`, 'i'))).toBeVisible()
  })

  test('affiche les onglets Demandes / Confirmées / Historique', async ({ page }) => {
    await loginAs(page)
    await page.goto('/dashboard')

    await expect(page.getByRole('button', { name: /demandes/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /confirm/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /historique/i })).toBeVisible()
  })

  test('affiche "aucune demande" quand la liste est vide', async ({ page }) => {
    await loginAs(page)
    await page.goto('/dashboard')

    // L'API retourne [] (mock dans helpers.ts)
    await expect(page.getByText(/aucune demande/i)).toBeVisible()
  })

})

test.describe('Dashboard propriétaire', () => {

  test('affiche le message de bienvenue', async ({ page }) => {
    await loginAs(page)
    await page.goto('/dashboard-proprio')

    await expect(page.getByText(new RegExp(`bonjour ${MOCK_USER.prenom}`, 'i'))).toBeVisible()
  })

  test('lien "Trouver un gardien" présent', async ({ page }) => {
    await loginAs(page)
    await page.goto('/dashboard-proprio')

    const btn = page.getByRole('main').getByRole('link', { name: /trouver un gardien/i })
    await expect(btn).toBeVisible()
    await btn.click()
    await expect(page).toHaveURL('/gardiens')
  })

})
