import { test, expect } from '@playwright/test'

test.describe('Page des jeux', () => {

  test('la page des jeux affiche toutes les cartes', async ({ page }) => {
    await page.goto('/jeux')
    await expect(page.getByRole('heading', { name: 'Les jeux de L\'Arche' })).toBeVisible()
    await expect(page.getByText('Memory des animaux')).toBeVisible()
    await expect(page.getByText('Prends soin de moi')).toBeVisible()
    await expect(page.getByText('Quiz animaux')).toBeVisible()
    await expect(page.getByText('Speedquiz')).toBeVisible()
    await expect(page.getByText('Mot caché')).toBeVisible()
  })

  test('le Memory se charge et affiche les niveaux', async ({ page }) => {
    await page.goto('/jeux/memory')
    await expect(page.getByRole('button', { name: /Facile/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Moyen/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Difficile/ })).toBeVisible()
  })

  test('le Memory démarre en mode facile', async ({ page }) => {
    await page.goto('/jeux/memory')
    await page.getByRole('button', { name: /Facile/ }).click()
    const cartes = page.locator('button').filter({ hasText: '?' })
    await expect(cartes).toHaveCount(8)
  })

  test('le Quiz animaux se charge', async ({ page }) => {
    await page.goto('/jeux/quiz-animaux')
    // Le compteur d'avancement est dans le header
    await expect(page.getByText('1/12')).toBeVisible()
    // Une question est visible
    await expect(page.locator('p.text-xl.font-black')).toBeVisible()
  })

  test('répondre à une question du quiz avance à la suivante', async ({ page }) => {
    await page.goto('/jeux/quiz-animaux')
    // Cliquer sur la première réponse
    await page.locator('.grid.grid-cols-2 button').first().click()
    await page.waitForTimeout(1200)
    // Le compteur doit passer à 2/12
    await expect(page.getByText('2/12')).toBeVisible()
  })

  test('le Speedquiz démarre après le bouton', async ({ page }) => {
    await page.goto('/jeux/speedquiz')
    await expect(page.getByText('Speedquiz')).toBeVisible()
    await page.getByRole('button', { name: /C'est parti/ }).click()
    await expect(page.getByText('Question 1')).toBeVisible()
    await expect(page.locator('text=/\\d+s/')).toBeVisible()
  })

  test('le Vrai/Faux affiche une affirmation et des boutons', async ({ page }) => {
    await page.goto('/jeux/vrai-faux')
    await expect(page.getByRole('button', { name: /VRAI/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /FAUX/ })).toBeVisible()
  })

  test('le Mot caché affiche un clavier', async ({ page }) => {
    await page.goto('/jeux/mot-cache')
    await expect(page.getByText('Mot caché')).toBeVisible()
    await expect(page.getByRole('button', { name: 'A' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'ENTRÉE' })).toBeVisible()
  })

  test('le Qui suis-je affiche un champ de réponse', async ({ page }) => {
    await page.goto('/jeux/qui-suis-je')
    await expect(page.getByPlaceholder(/Quel animal/)).toBeVisible()
    // L'indice est indiqué dans le header sous forme "Indice X/5"
    await expect(page.locator('span').filter({ hasText: /Indice \d+\/5/ })).toBeVisible()
  })

  test('le Jeu de tri démarre après le bouton', async ({ page }) => {
    await page.goto('/jeux/tri')
    await page.getByRole('button', { name: /C'est parti/ }).click()
    await expect(page.getByRole('button', { name: /Chiens/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Chats/ })).toBeVisible()
  })

  test('la Devinette affiche un champ de réponse', async ({ page }) => {
    await page.goto('/jeux/devinette')
    await expect(page.getByPlaceholder(/Quel animal/)).toBeVisible()
    // Le statut du niveau de révélation est visible dans le header
    await expect(page.locator('span').filter({ hasText: /Silhouette|Très flou|Flou/ })).toBeVisible()
  })
})
