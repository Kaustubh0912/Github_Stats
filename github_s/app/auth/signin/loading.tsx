import { Card, CardContent } from "@/components/ui/card"
import { IconBrandGithubFilled as Github } from "@tabler/icons-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      {/* Background Texture */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:24px_24px]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,rgba(255,255,255,0.1)_50%,transparent_65%)] bg-[length:24px_24px]" />
      </div>

      <Card className="w-full max-w-md bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl">
        <CardContent className="flex flex-col items-center justify-center p-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <Github className="w-8 h-8 text-white" />
          </div>
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600 mb-4" />
          <p className="text-slate-600 dark:text-slate-300">Loading authentication...</p>
        </CardContent>
      </Card>
    </div>
  )
}
