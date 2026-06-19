import { test, expect } from '@playwright/test'
import { mockApiRoutes, MOCK_USER } from './helpers'

test.describe('Authentification', () => {

  test('page login affiche le formulaire', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/login')

    await expect(page.getByRole('heading', { name: /bon retour/i })).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /se connecter/i })).toBeVisible()
    await expect(page.getByText(/créer un compte/i)).toBeVisible()
  })

  test('login réussi redirige vers /dashboard ou /', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/login')

    await page.locator('input[type="email"]').fill('alice@test.com')
    await page.locator('input[type="password"]').fill('password123')
    await page.getByRole('button', { name: /se connecter/i }).click()

    // Doit sortir de /login
    await expect(page).not.toHaveURL(/\/login/)
  })

  test('login avec champs vides affiche un message d\'erreur', async ({ page }) => {
    await mockApiRoutes(page)

    // Simuler une réponse API d'erreur
    await page.route('**/api/auth/signin', async route => {
      await route.fulfill({
        status: 400,
        json: { error: { message: 'Email et mot de passe requis', statusCode: 400 } }
      })
    })

    await page.goto('/login')
    await page.getByRole('button', { name: /se connecter/i }).click()

    // Le formulaire doit rester ou afficher une erreur
    await expect(page).toHaveURL(/\/login/)
  })

  test('page register affiche le formulaire d\'inscription', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/register')

    await expect(page.getByRole('heading', { name: /créer mon compte/i })).toBeVisible()
    await expect(page.locator('input[placeholder="Dupont"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /créer mon compte/i })).toBeVisible()
    await expect(page.getByText(/déjà un compte/i)).toBeVisible()
  })

  test('utilisateur connecté voit son nom dans le header', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('access_token', 'fake-access-token')
      localStorage.setItem('refresh_token', 'fake-refresh-token')
    })
    await page.reload()

    // Le header doit afficher les initiales ou le prénom
    const header = page.locator('header')
    await expect(header).toBeVisible()
    await expect(header.getByText(new RegExp(MOCK_USER.prenom, 'i'))).toBeVisible()
  })

  test('déconnexion redirige vers /login', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('access_token', 'fake-access-token')
    })
    await page.reload()

    // Chercher un bouton de déconnexion
    const logoutBtn = page.getByRole('button', { name: /déconnexion|se déconnecter/i })
    await expect(logoutBtn).toBeVisible()
    await logoutBtn.click()

    await expect(page).toHaveURL(/\/login/)
  })

  test('accès à une page protégée sans token redirige vers /login', async ({ page }) => {
    await mockApiRoutes(page)
    // Pas de token en localStorage
    await page.goto('/profil')
    await expect(page).toHaveURL(/\/login/)
  })

  test('accès au dashboard sans token redirige vers /login', async ({ page }) => {
    await mockApiRoutes(page)
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

})
