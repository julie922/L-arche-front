import { test, expect } from '@playwright/test'

test.describe('Panel Admin', () => {

  test('le dashboard admin se charge', async ({ page }) => {
    await page.goto('/admin')
    // Scoper au contenu principal pour éviter l'ambiguïté avec la sidebar
    // La stat "Inscrits" est dans la grille de stats
    await expect(page.getByText('Revenus merch')).toBeVisible()
    await expect(page.getByText('Taux satisfaction')).toBeVisible()
  })

  test('la sidebar admin contient tous les liens', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByRole('link', { name: /Utilisateurs/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Vérifications/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Gardes en cours/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Signalements/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Espèces/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Produits/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Commandes/ })).toBeVisible()
  })

  test('la page utilisateurs affiche la liste', async ({ page }) => {
    await page.goto('/admin/utilisateurs')
    await expect(page.getByText('Camille Rousseau')).toBeVisible()
    await expect(page.getByText('Jules Martin')).toBeVisible()
  })

  test('la recherche utilisateur filtre les résultats', async ({ page }) => {
    await page.goto('/admin/utilisateurs')
    await page.getByPlaceholder('Rechercher un utilisateur...').fill('Jules')
    await expect(page.getByText('Jules Martin')).toBeVisible()
    await expect(page.getByText('Camille Rousseau')).not.toBeVisible()
  })

  test('les vérifications en attente sont listées', async ({ page }) => {
    await page.goto('/admin/verifications')
    await expect(page.getByRole('heading', { name: 'En attente' })).toBeVisible()
    await expect(page.getByRole('button', { name: /Valider/ }).first()).toBeVisible()
  })

  test('valider une vérification la déplace dans "Traitées"', async ({ page }) => {
    await page.goto('/admin/verifications')
    await page.getByRole('button', { name: /Valider/ }).first().click()
    await expect(page.getByText('✓ Validée').first()).toBeVisible()
  })

  test('la gestion des espèces affiche la liste', async ({ page }) => {
    await page.goto('/admin/especes')
    // Le texte "Chien" apparaît dans le bouton de sélection avec l'emoji
    await expect(page.getByText(/🐕.*Chien|Chien.*\(5\)/)).toBeVisible()
  })

  test('la gestion des produits affiche la table', async ({ page }) => {
    await page.goto('/admin/merch')
    await expect(page.getByText("Tote bag L'Arche")).toBeVisible()
    await expect(page.getByRole('button', { name: 'Modifier' }).first()).toBeVisible()
  })

  test('la gestion des commandes affiche les stats', async ({ page }) => {
    await page.goto('/admin/commandes')
    await expect(page.getByText('Total commandes')).toBeVisible()
    await expect(page.getByRole('button', { name: /En attente \(/ })).toBeVisible()
    await expect(page.getByText('CMD-001')).toBeVisible()
  })
})
