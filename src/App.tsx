import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
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
import FaqPage from './pages/FaqPage'
import JournalGardienPage from './pages/JournalGardienPage'
import JournalProprioPage from './pages/JournalProprioPage'
import FinDeGardePage from './pages/FinDeGardePage'
import AdminGuard from './components/admin/AdminGuard'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUtilisateurs from './pages/admin/AdminUtilisateurs'
import AdminVerifications from './pages/admin/AdminVerifications'
import AdminGardes from './pages/admin/AdminGardes'
import AdminSignalements from './pages/admin/AdminSignalements'
import AdminAvis from './pages/admin/AdminAvis'
import AdminEspeces from './pages/admin/AdminEspeces'
import AdminMerch from './pages/admin/AdminMerch'
import AdminCommandes from './pages/admin/AdminCommandes'
import MerchPage from './pages/MerchPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/fiches-especes" element={<FichesEspecesPage />} />
        <Route path="/fiches-especes/:id" element={<FicheDetailPage />} />
        <Route path="/fiches-especes/:id/:sousId" element={<SousEspeceDetailPage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/dashboard" element={<DashboardGardienPage />} />
        <Route path="/dashboard-proprio" element={<DashboardProprioPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/garde/:gardeId/journal" element={<JournalGardienPage />} />
        <Route path="/garde/:gardeId/suivi"   element={<JournalProprioPage />} />
        <Route path="/garde/:gardeId/fin"     element={<FinDeGardePage />} />
        <Route path="/gardiens" element={<RechercheGardiensPage />} />
        <Route path="/gardiens/:id" element={<GardienProfilPage />} />
        <Route path="/gardiens/:id/reserver" element={<ReservationPage />} />
        <Route path="/admin"                element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/utilisateurs"   element={<AdminGuard><AdminUtilisateurs /></AdminGuard>} />
        <Route path="/admin/verifications"  element={<AdminGuard><AdminVerifications /></AdminGuard>} />
        <Route path="/admin/gardes"         element={<AdminGuard><AdminGardes /></AdminGuard>} />
        <Route path="/admin/signalements"   element={<AdminGuard><AdminSignalements /></AdminGuard>} />
        <Route path="/admin/avis"           element={<AdminGuard><AdminAvis /></AdminGuard>} />
        <Route path="/admin/especes"          element={<AdminGuard><AdminEspeces /></AdminGuard>} />
        <Route path="/admin/merch"           element={<AdminGuard><AdminMerch /></AdminGuard>} />
        <Route path="/admin/commandes"       element={<AdminGuard><AdminCommandes /></AdminGuard>} />
        <Route path="/merch"                 element={<MerchPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
