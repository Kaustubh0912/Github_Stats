"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Github, LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function AuthButton() {
  const { data: session, status } = useSession()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const router = useRouter()

  const handleSignIn = async () => {
    setIsSigningIn(true)
    try {
      await signIn("github", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Sign in error:", error)
      // Redirect to signin page which will handle the error display
      router.push("/auth/signin")
    } finally {
      setIsSigningIn(false)
    }
  }

  if (status === "loading") {
    return (
      <Button variant="ghost" size="sm" disabled>
        <div className="w-4 h-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
      </Button>
    )
  }

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.user.image || "/placeholder.svg"} alt={session.user.name || "User"} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{session.user.name}</p>
              <p className="w-[200px] truncate text-sm text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button
      onClick={handleSignIn}
      size="sm"
      disabled={isSigningIn}
      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:opacity-50"
    >
      {isSigningIn ? (
        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <Github className="w-4 h-4 mr-2" />
      )}
      {isSigningIn ? "Signing in..." : "Sign in"}
    </Button>
  )
}
