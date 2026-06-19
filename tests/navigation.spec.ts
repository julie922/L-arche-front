import { test, expect } from '@playwright/test'

test.describe('Header & Navigation', () => {

  test('la page d\'accueil se charge correctement', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/L'Arche/)
    await expect(page.getByRole('heading', { name: /Votre animal entre/ })).toBeVisible()
  })

  test('le header contient tous les liens de navigation', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav').first()
    await expect(nav.getByRole('link', { name: 'Accueil' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Fiches espèces' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Trouver un gardien' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Aide' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Jeux' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Connexion' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Inscription' })).toBeVisible()
  })

  test('le lien "Fiches espèces" navigue correctement', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav').first().getByRole('link', { name: 'Fiches espèces' }).click()
    await expect(page).toHaveURL('/fiches-especes')
    await expect(page.getByRole('heading', { name: 'Fiches espèces' })).toBeVisible()
  })

  test('le lien "Trouver un gardien" navigue correctement', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav').first().getByRole('link', { name: 'Trouver un gardien' }).click()
    await expect(page).toHaveURL('/gardiens')
  })

  test('le lien "Aide" navigue vers la FAQ', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav').first().getByRole('link', { name: 'Aide' }).click()
    await expect(page).toHaveURL('/faq')
    await expect(page.getByRole('heading', { name: /Comment pouvons-nous/ })).toBeVisible()
  })

  test('le lien "Jeux" navigue vers la page jeux', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav').first().getByRole('link', { name: 'Jeux' }).click()
    await expect(page).toHaveURL('/jeux')
    await expect(page.getByRole('heading', { name: 'Les jeux de L\'Arche' })).toBeVisible()
  })

  test('le footer est présent sur la page d\'accueil', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('footer')).toBeVisible()
    await expect(page.locator('footer')).toContainText('Association loi 1901')
  })
})
