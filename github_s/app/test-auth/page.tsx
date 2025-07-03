"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function TestAuth() {
  const { data: session, status } = useSession()

  const envVars = [
    { name: "GITHUB_ID", value: process.env.NEXT_PUBLIC_GITHUB_ID || "Not set" },
    { name: "NEXTAUTH_URL", value: process.env.NEXT_PUBLIC_NEXTAUTH_URL || "Not set" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-2xl mx-auto pt-20">
        <h1 className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white">Authentication Test Page</h1>

        <Alert className="mb-6 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-600 dark:text-blue-400">GitHub OAuth Setup Required</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            To enable GitHub authentication, you need to:
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Create a GitHub OAuth App at <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer" className="underline">GitHub Developer Settings</a></li>
              <li>Set the Authorization callback URL to: <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded">{process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/callback/github</code></li>
              <li>Copy the Client ID and Client Secret to your <code className="bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded">.env</code> file</li>
            </ol>
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {/* Session Status */}
          <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {status === "authenticated" ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : status === "unauthenticated" ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
                Session Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={
                  status === "authenticated" ? "default" : status === "unauthenticated" ? "destructive" : "secondary"
                }
              >
                {status}
              </Badge>
              {session && (
                <div className="mt-4 space-y-2">
                  <p>
                    <strong>Name:</strong> {session.user?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {session.user?.email}
                  </p>
                  <p>
                    <strong>Image:</strong> {session.user?.image}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Environment Variables */}
          <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {envVars.map((env) => (
                  <div key={env.name} className="flex justify-between items-center">
                    <span className="font-medium">{env.name}:</span>
                    <Badge variant={env.value !== "Not set" ? "default" : "destructive"}>{env.value}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
