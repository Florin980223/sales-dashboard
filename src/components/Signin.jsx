import { useActionState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

const Signin = () => {
  const { signInUser } = useAuth()
  const navigate = useNavigate()

  const [error, submitAction, isPending] = useActionState(
    async (_previousState, formData) => {
      const email = formData.get("email")
      const password = formData.get("password")

      const {
        success,
        data,
        error: signInError,
      } = await signInUser(email, password)

      if (signInError) {
        return new Error(signInError)
      }

      if (success && data?.session) {
        navigate("/dashboard")
        return null
      }

      return null
    },
    null
  )

  return (
    <>
      <h1 className="landing-header">Paper Like A Boss</h1>

      <div className="sign-form-container">
        <form
          action={submitAction}
          aria-label="Sign in form"
          aria-describedby="signin-form-description"
        >
          <div id="signin-form-description" className="sr-only">
            Use this form to sign in to your account. Enter your email and
            password.
          </div>

          <h2 className="form-title">Sign in</h2>

          <p>
            Don&apos;t have an account yet?{" "}
            <Link to="/signup" className="form-link">
              Sign up
            </Link>
          </p>

          <label htmlFor="signin-email">Email</label>
          <input
            className="form-input"
            id="signin-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "signin-error" : undefined}
            disabled={isPending}
          />

          <label htmlFor="signin-password">Password</label>
          <input
            className="form-input"
            id="signin-password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "signin-error" : undefined}
            disabled={isPending}
          />

          <button
            type="submit"
            className="form-button"
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? "Signing in" : "Sign In"}
          </button>

          {error && (
            <div
              id="signin-error"
              role="alert"
              className="sign-form-error-message"
            >
              {error.message}
            </div>
          )}
        </form>
      </div>
    </>
  )
}

export default Signin