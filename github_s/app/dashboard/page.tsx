"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Github,
  BarChart3,
  Code2,
  Star,
  Users,
  Calendar,
  TrendingUp,
  Copy,
  Activity,
  Clock,
  GitCommit,
  GitPullRequest,
  AlertCircle,
} from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { AuthButton } from "@/components/auth-button"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-context"

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const statsData = {
    totalCommits: 1247,
    repositories: 42,
    followers: 156,
    following: 89,
    stars: 324,
    prs: 87,
    issues: 23,
    contributions: 1247,
  }

  const languages = [
    { name: "TypeScript", percentage: 45, color: "bg-blue-500", lines: 15420 },
    { name: "JavaScript", percentage: 30, color: "bg-yellow-500", lines: 12340 },
    { name: "Python", percentage: 15, color: "bg-green-500", lines: 8760 },
    { name: "Go", percentage: 7, color: "bg-cyan-500", lines: 4230 },
    { name: "Rust", percentage: 3, color: "bg-orange-500", lines: 1890 },
  ]

  const recentActivity = [
    { type: "commit", repo: "gitframe/dashboard", message: "Add real-time stats visualization", time: "2 hours ago" },
    { type: "pr", repo: "open-source/react-charts", message: "Fix chart rendering performance", time: "5 hours ago" },
    { type: "issue", repo: "gitframe/api", message: "GitHub API rate limiting optimization", time: "1 day ago" },
    { type: "commit", repo: "personal/portfolio", message: "Update project showcase", time: "2 days ago" },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        {/* Background Texture */}
        <div className="fixed inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:24px_24px]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_35%,rgba(255,255,255,0.1)_50%,transparent_65%)] bg-[length:24px_24px]" />
        </div>

        {/* Floating Navigation */}
        <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-6 py-3 shadow-2xl">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Github className="w-5 h-5 text-white" />
                </div>
                GitFrame
              </Link>
              <div className="flex items-center gap-6">
                <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 font-medium">
                  Dashboard
                </Link>
                <Link
                  href="/embed-gallery"
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Embed Gallery
                </Link>
                <Link
                  href="/dev"
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Developers
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <AuthButton />
              </div>
            </div>
          </div>
        </nav>

        <div className="pt-24 px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Github className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">GitHub Dashboard</h1>
                  <p className="text-slate-600 dark:text-slate-300">@{user?.username} • Last updated 5 minutes ago</p>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "Total Commits",
                  value: statsData.totalCommits,
                  icon: GitCommit,
                  color: "text-blue-500",
                  bg: "bg-blue-500/10",
                },
                {
                  label: "Repositories",
                  value: statsData.repositories,
                  icon: Code2,
                  color: "text-green-500",
                  bg: "bg-green-500/10",
                },
                {
                  label: "Stars Earned",
                  value: statsData.stars,
                  icon: Star,
                  color: "text-yellow-500",
                  bg: "bg-yellow-500/10",
                },
                {
                  label: "Followers",
                  value: statsData.followers,
                  icon: Users,
                  color: "text-purple-500",
                  bg: "bg-purple-500/10",
                },
              ].map((stat, index) => (
                <Card
                  key={index}
                  className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                      {stat.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-1">
                <TabsTrigger value="overview" className="rounded-xl">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="languages" className="rounded-xl">
                  Languages
                </TabsTrigger>
                <TabsTrigger value="activity" className="rounded-xl">
                  Activity
                </TabsTrigger>
                <TabsTrigger value="contributions" className="rounded-xl">
                  Contributions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/50"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            {activity.type === "commit" && <GitCommit className="w-4 h-4 text-white" />}
                            {activity.type === "pr" && <GitPullRequest className="w-4 h-4 text-white" />}
                            {activity.type === "issue" && <AlertCircle className="w-4 h-4 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {activity.message}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{activity.repo}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-green-500" />
                        Quick Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { label: "Pull Requests", value: statsData.prs, change: "+12%", positive: true },
                        { label: "Issues Opened", value: statsData.issues, change: "-5%", positive: false },
                        { label: "Code Reviews", value: 34, change: "+8%", positive: true },
                        { label: "Contributions", value: statsData.contributions, change: "+23%", positive: true },
                      ].map((stat, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/50"
                        >
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{stat.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</span>
                            <Badge
                              variant={stat.positive ? "default" : "secondary"}
                              className={`text-xs ${stat.positive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
                            >
                              {stat.change}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="languages" className="space-y-6">
                <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-blue-500" />
                      Programming Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {languages.map((lang, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-900 dark:text-white">{lang.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {lang.lines.toLocaleString()} lines
                            </span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {lang.percentage}%
                            </span>
                            <Button variant="ghost" size="sm">
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${lang.color} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${lang.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      Contribution Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Contribution calendar visualization coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contributions">
                <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Contribution Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Detailed contribution analytics coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Floating Footer */}
        <footer className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-6 py-3 shadow-2xl">
            <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
              <span>© 2024 GitFrame</span>
              <div className="flex items-center gap-4">
                <Link href="/dev" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Built by @KCozy
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
