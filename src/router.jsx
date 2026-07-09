import { createBrowserRouter } from "react-router-dom"
import Signin from "./components/Signin.jsx"
import Signup from "./components/Signup.jsx"
import Header from "./components/Header.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import Dashboard from "./routes/Dashboard.jsx"
import RootRedirect from "./routes/RootRedirect.jsx"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Header />
        <Dashboard />
      </ProtectedRoute>
    ),
  },
])