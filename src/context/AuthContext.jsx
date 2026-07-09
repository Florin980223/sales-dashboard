import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../supabaseClient.js"

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined)
  const [users, setUsers] = useState([])

  useEffect(() => {
    async function getInitialSession() {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        setSession(data.session)
      } catch (error) {
        console.error("Error getting session:", error.message)
        setSession(null)
      }
    }

    async function fetchUsers() {
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("id, name, account_type")

        if (error) {
          throw error
        }

        console.log("Fetched users:", data)
        setUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error.message)
      }
    }

    getInitialSession()
    fetchUsers()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      console.log("Session changed:", session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      })

      if (error) {
        console.error("Supabase sign-in error:", error.message)
        return { success: false, error: error.message }
      }

      console.log("Supabase sign-in success:", data)
      return { success: true, data }
    } catch (error) {
      console.error("Unexpected error during sign-in:", error.message)

      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      }
    }
  }

  const signUpNewUser = async (email, password, name, accountType) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: password,
        options: {
          data: {
            name: name,
            account_type: accountType,
          },
        },
      })

      if (error) {
        console.error("Supabase sign-up error:", error.message)
        return { success: false, error: error.message }
      }

      console.log("Supabase sign-up success:", data)
      return { success: true, data }
    } catch (error) {
      console.error("Unexpected error during sign-up:", error.message)

      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Supabase sign-out error:", error.message)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error("Unexpected error during sign-out:", error.message)

      return {
        success: false,
        error: "An unexpected error occurred during sign out.",
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        users,
        signInUser,
        signUpNewUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}