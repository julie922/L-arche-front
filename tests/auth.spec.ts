import { test, expect } from '@playwright/test'

test.describe('Authentification', () => {

  test('la page de connexion se charge', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Bon retour' })).toBeVisible()
    await expect(page.getByPlaceholder('camille@email.com')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible()
  })

  test('le lien "S\'inscrire" est présent sur la page de connexion', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('link', { name: /S'inscrire|Créer un compte/ })).toBeVisible()
  })

  test('/profil charge la page profil (mock connecté)', async ({ page }) => {
    await page.goto('/profil')
    await expect(page.getByRole('heading', { name: 'Mon profil' })).toBeVisible()
  })

  test('la page d\'inscription - étape 1 se charge', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: 'Créer mon compte' })).toBeVisible()
    // Sélecteur exact pour éviter l'ambiguïté avec camille@email.com
    await expect(page.getByPlaceholder('Camille', { exact: true })).toBeVisible()
    await expect(page.getByPlaceholder('Dupont')).toBeVisible()
  })

  test('l\'inscription avance à l\'étape 2 après avoir rempli l\'étape 1', async ({ page }) => {
    await page.goto('/register')
    await page.getByPlaceholder('Camille', { exact: true }).fill('Marie')
    await page.getByPlaceholder('Dupont').fill('Dupont')
    await page.getByPlaceholder('camille@email.com').fill('marie@test.com')
    await page.getByPlaceholder(/caractères/i).fill('motdepasse123')
    // Sélectionner Propriétaire (premier rôle dans la grille)
    await page.locator('button').filter({ hasText: 'Je cherche un gardien pour mon animal' }).click()
    await page.getByRole('checkbox').click()
    await page.getByRole('button', { name: /Créer mon compte/ }).click()
    await expect(page.getByRole('heading', { name: 'Mon animal' })).toBeVisible()
  })

  test('choisir Gardien mène directement à l\'étape Expérience', async ({ page }) => {
    await page.goto('/register')
    await page.getByPlaceholder('Camille', { exact: true }).fill('Jules')
    await page.getByPlaceholder('Dupont').fill('Martin')
    await page.getByPlaceholder('camille@email.com').fill('jules@test.com')
    await page.getByPlaceholder(/caractères/i).fill('motdepasse123')
    // Sélectionner Gardien via son texte descriptif unique
    await page.locator('button').filter({ hasText: "J'accueille les animaux chez moi" }).click()
    await page.getByRole('checkbox').click()
    await page.getByRole('button', { name: /Créer mon compte/ }).click()
    await expect(page.getByRole('heading', { name: 'Mon expérience' })).toBeVisible()
  })
})
