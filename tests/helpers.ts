import { Page } from '@playwright/test'

export const MOCK_USER = {
  id: 'aaaaaaaa-0000-0000-0000-000000000001',
  nom: 'Dupont',
  prenom: 'Alice',
  email: 'alice@test.com',
  role: 'utilisateur',
  ville: 'Lyon',
  est_gardien: false,
  profil_gardien_verifie: false,
  identite_verifiee: false,
  note_moyenne: null,
  nb_avis: 0,
}

export const MOCK_SESSION = {
  session: {
    access_token: 'fake-access-token',
    refresh_token: 'fake-refresh-token',
    user: { id: MOCK_USER.id, email: MOCK_USER.email },
  },
}

export const MOCK_GARDIEN = {
  id: 'bbbbbbbb-0000-0000-0000-000000000002',
  nom: 'Martin',
  prenom: 'Jules',
  ville: 'Lyon 3e',
  avatar_url: null,
  description_gardien: 'Passionné par les animaux.',
  experience_animaux: 'experimente',
  type_logement: 'Maison',
  jardin: true,
  animaux_acceptes: ['Chien', 'Chat'],
  note_moyenne: 4.8,
  nb_avis: 12,
  profil_gardien_verifie: true,
}

/** Intercepte toutes les routes API avec des réponses mock */
export async function mockApiRoutes(page: Page) {
  // Auth
  await page.route('**/api/auth/signin', async route => {
    await route.fulfill({ status: 200, json: MOCK_SESSION })
  })
  await page.route('**/api/auth/signout', async route => {
    await route.fulfill({ status: 200, json: { ok: true } })
  })
  await page.route('**/api/auth/signup', async route => {
    await route.fulfill({ status: 201, json: { id: MOCK_USER.id, email: MOCK_USER.email } })
  })

  // Users
  await page.route('**/api/users/me', async route => {
    await route.fulfill({ status: 200, json: MOCK_USER })
  })
  await page.route(/\/api\/users\/gardiens/, async route => {
    const url = route.request().url()
    if (url.includes('/' + MOCK_GARDIEN.id)) {
      await route.fulfill({ status: 200, json: MOCK_GARDIEN })
    } else {
      await route.fulfill({ status: 200, json: { data: [MOCK_GARDIEN], total: 1 } })
    }
  })

  // Animals
  await page.route('**/api/animals*', async route => {
    await route.fulfill({ status: 200, json: { data: [], total: 0 } })
  })

  // Reservations
  await page.route('**/api/reservations*', async route => {
    await route.fulfill({ status: 200, json: { data: [], total: 0 } })
  })

  // Reviews + disponibilites
  await page.route('**/api/reviews/**', async route => {
    await route.fulfill({ status: 200, json: { data: [], total: 0 } })
  })
  await page.route('**/api/disponibilites/**', async route => {
    await route.fulfill({ status: 200, json: { data: [], total: 0 } })
  })
}

/** Simule un utilisateur connecté en injectant des tokens dans localStorage */
export async function loginAs(page: Page) {
  await mockApiRoutes(page)
  await page.goto('/')
  await page.evaluate(({ token }) => {
    localStorage.setItem('access_token', token)
    localStorage.setItem('refresh_token', 'fake-refresh-token')
  }, { token: MOCK_SESSION.session.access_token })
}
