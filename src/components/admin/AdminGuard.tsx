import { Navigate } from 'react-router-dom'

// TODO: remplacer par vérification JWT quand le back sera prêt
const MOCK_IS_ADMIN = true

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  if (!MOCK_IS_ADMIN) return <Navigate to="/login" replace />
  return <>{children}</>
}
