"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

interface AuthErrorProps {
  error?: string
  onRetry?: () => void
}

export function AuthError({ error, onRetry }: AuthErrorProps) {
  const errorMessage = error || "An error occurred during authentication"
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      {/* Background Texture */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:24px_24px]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,rgba(255,255,255,0.1)_50%,transparent_65%)] bg-[length:24px_24px]" />
      </div>

      <Card className="w-full max-w-md bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Authentication Error</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-slate-600 dark:text-slate-300">
            {errorMessage}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {onRetry && (
              <Button
                onClick={onRetry}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            If this problem persists, please check your GitHub OAuth configuration or contact support.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}