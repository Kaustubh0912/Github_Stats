"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  image: string
  username?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: () => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(status === "loading")
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true)
      return
    }

    setIsLoading(false)

    if (session?.user) {
      setUser({
        id: session.user.id || "unknown",
        name: session.user.name || "Unknown User",
        email: session.user.email || "",
        image: session.user.image || "/placeholder.svg",
        username: session.user.name?.split(" ")[0] || "user",
      })
    } else {
      setUser(null)
    }
  }, [session, status])

  const signIn = async () => {
    setIsLoading(true)
    try {
      await nextAuthSignIn("github", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Sign in error:", error)
      // Redirect to signin page which will handle the error display
      router.push("/auth/signin")
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    nextAuthSignOut()
  }

  return <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
