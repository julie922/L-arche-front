import { test, expect } from '@playwright/test'
import { mockApiRoutes, loginAs } from './helpers'

test.describe('Navigation — pages publiques', () => {

  test('page d\'accueil se charge', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/')
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('banner')).toBeVisible()
  })

  test('lien "Trouver un gardien" depuis la homepage', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/')
    const link = page.getByRole('banner').getByRole('link', { name: /trouver un gardien/i })
    if (await link.isVisible()) {
      await link.click()
      await expect(page).toHaveURL(/\/gardiens/)
    }
  })

  test('page recherche gardiens se charge', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/gardiens')
    await expect(page).toHaveURL('/gardiens')
    await expect(page.getByRole('banner')).toBeVisible()
  })

  test('page fiches espèces se charge', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/fiches-especes')
    await expect(page).toHaveURL('/fiches-especes')
    await expect(page.getByRole('banner')).toBeVisible()
  })

  test('page FAQ se charge', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/faq')
    await expect(page).toHaveURL('/faq')
    await expect(page.getByRole('banner')).toBeVisible()
  })

  test('lien Connexion pointe vers /login', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/')
    const link = page.getByRole('link', { name: /^connexion$/i }).first()
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('lien Inscription pointe vers /register', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/')
    const link = page.getByRole('link', { name: /^inscription$/i }).first()
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/\/register/)
  })

  test('logo / lien L\'Arche redirige vers /', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/faq')
    const logo = page.getByRole('banner').getByRole('link').first()
    await logo.click()
    await expect(page).toHaveURL('/')
  })

})

test.describe('Navigation — utilisateur connecté', () => {

  test('header affiche les initiales et le menu utilisateur', async ({ page }) => {
    await loginAs(page)
    await page.reload()
    const banner = page.getByRole('banner')
    await expect(banner).toBeVisible()
    // Les boutons Connexion/Inscription ne doivent plus être visibles
    await expect(banner.getByRole('link', { name: /^connexion$/i })).not.toBeVisible()
  })

  test('lien "Mon profil" depuis le header', async ({ page }) => {
    await loginAs(page)
    await page.reload()
    const profilLink = page.getByRole('banner').getByRole('link', { name: /^profil$/i })
    if (await profilLink.isVisible()) {
      await profilLink.click()
      await expect(page).toHaveURL(/\/profil/)
    }
  })

  test('page profil se charge pour un utilisateur connecté', async ({ page }) => {
    await loginAs(page)
    await page.goto('/profil')
    await expect(page).toHaveURL('/profil')
    await expect(page.getByRole('banner')).toBeVisible()
  })

  test('dashboard gardien accessible', async ({ page }) => {
    await loginAs(page)
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('banner')).toBeVisible()
  })

  test('dashboard proprio accessible', async ({ page }) => {
    await loginAs(page)
    await page.goto('/dashboard-proprio')
    await expect(page).toHaveURL('/dashboard-proprio')
    await expect(page.getByRole('banner')).toBeVisible()
  })

})
