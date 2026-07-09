import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

const RootRedirect = () => {
  const { session } = useAuth()

  if (session === undefined) {
    return <div>Loading...</div>
  }

  return session ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />
}

export default RootRedirect