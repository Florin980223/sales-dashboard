import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

function Header() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  const handleSignOut = async (e) => {
    e.preventDefault()

    const { success, error } = await signOut()

    if (success) {
      navigate("/signin")
    } else {
      setError(error)
    }
  }

  return (
    <header
      className="app-header"
      role="banner"
      aria-label="Dashboard header"
    >
      <div
        className="header-email"
        role="navigation"
        aria-label="User account navigation"
      >
        <h2>
          <span className="sr-only">Logged in as:</span>
          {session?.user?.email}
        </h2>

        {error && (
          <div role="alert" className="error-message" id="signout-error">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleSignOut}
          aria-label="Sign out of your account"
        >
          Sign out
        </button>
      </div>

      <h1>
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginRight: "8px" }}
          aria-hidden="true"
          role="img"
          aria-label="Dashboard icon"
        >
          <path
            d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        Sales Team Dashboard
      </h1>
    </header>
  )
}

export default Header