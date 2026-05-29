import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import FichesEspecesPage from './pages/FichesEspecesPage'
import FicheDetailPage from './pages/FicheDetailPage'
import SousEspeceDetailPage from './pages/SousEspeceDetailPage'
import ProfilPage from './pages/ProfilPage'
import GardienProfilPage from './pages/GardienProfilPage'
import ReservationPage from './pages/ReservationPage'
import RechercheGardiensPage from './pages/RechercheGardiensPage'
import DashboardGardienPage from './pages/DashboardGardienPage'
import DashboardProprioPage from './pages/DashboardProprioPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/fiches-especes" element={<FichesEspecesPage />} />
        <Route path="/fiches-especes/:id" element={<FicheDetailPage />} />
        <Route path="/fiches-especes/:id/:sousId" element={<SousEspeceDetailPage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/dashboard" element={<DashboardGardienPage />} />
        <Route path="/dashboard-proprio" element={<DashboardProprioPage />} />
        <Route path="/gardiens" element={<RechercheGardiensPage />} />
        <Route path="/gardiens/:id" element={<GardienProfilPage />} />
        <Route path="/gardiens/:id/reserver" element={<ReservationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
