import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useActionState } from "react"

const Signup = () => {
  const { signUpNewUser } = useAuth()
  const navigate = useNavigate()

  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const name = formData.get("name")
      const email = formData.get("email")
      const password = formData.get("password")
      const accountType = formData.get("account-type")

      const {
        success,
        data,
        error: signUpError,
      } = await signUpNewUser(email, password, name, accountType)

      if (signUpError) {
        return new Error(signUpError)
      }

      if (success && data?.session) {
        navigate("/dashboard")
        return null
      }

      if (success && data?.user) {
        navigate("/signin")
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
          aria-label="Sign up form"
          aria-describedby="form-description"
        >
          <div id="form-description" className="sr-only">
            Use this form to create a new account. Enter your name, email,
            password, and select your role.
          </div>

          <h2 className="form-title">Sign up today!</h2>

          <p>
            Already have an account?{" "}
            <Link to="/signin" className="form-link">
              Sign in
            </Link>
          </p>

          <label htmlFor="signup-name">Name</label>
          <input
            className="form-input"
            id="signup-name"
            type="text"
            name="name"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "signup-error" : undefined}
            disabled={isPending}
          />

          <label htmlFor="signup-email">Email</label>
          <input
            className="form-input"
            id="signup-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "signup-error" : undefined}
            disabled={isPending}
          />

          <label htmlFor="signup-password">Password</label>
          <input
            className="form-input"
            id="signup-password"
            type="password"
            name="password"
            autoComplete="new-password"
            required
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "signup-error" : undefined}
            disabled={isPending}
          />

          <fieldset className="role-fieldset">
            <legend>Select your role</legend>

            <label htmlFor="admin-role">
              <input
                id="admin-role"
                type="radio"
                name="account-type"
                value="admin"
                required
                disabled={isPending}
              />
              Admin
            </label>

            <label htmlFor="sales-rep-role">
              <input
                id="sales-rep-role"
                type="radio"
                name="account-type"
                value="sales_rep"
                required
                disabled={isPending}
              />
              Sales Rep
            </label>
          </fieldset>

          <button
            type="submit"
            className="form-button"
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? "Signing up" : "Sign Up"}
          </button>

          {error && (
            <div
              id="signup-error"
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

export default Signup