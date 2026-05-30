import { Navigate } from 'react-router-dom'

// TODO: remplacer par vérification JWT quand le back sera prêt
const MOCK_IS_CONNECTED = true

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  if (!MOCK_IS_CONNECTED) return <Navigate to="/login" replace />
  return <>{children}</>
}
