"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Github, BarChart3, Code2, GitBranch, Star, Calendar, TrendingUp, Zap, Eye, Download } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthButton } from "@/components/auth-button"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Background Texture */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,rgba(255,255,255,0.1)_50%,transparent_65%)] bg-[length:20px_20px]" />
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
              <Link
                href="/dashboard"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
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
                Developer
              </Link>
              <ThemeToggle />
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-800/50 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Visual Gateway to Your GitHub Profile
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent mb-6">
            Git<span className="text-blue-500">Frame</span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            A visual gateway to your GitHub profile, crafted for developers who value elegance and precision. Transform
            your GitHub stats into beautiful, embeddable visualizations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Github className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Connect with GitHub
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-slate-300 dark:border-slate-600 px-8 py-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 bg-transparent"
            >
              <Eye className="w-5 h-5 mr-2" />
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "Real-time Stats",
                description: "Live GitHub metrics via GraphQL API with beautiful charts and visualizations",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: Code2,
                title: "Language Analytics",
                description: "Detailed breakdown of programming languages used across all repositories",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: GitBranch,
                title: "Contribution Insights",
                description: "Track commits, PRs, issues, and contribution patterns with heatmaps",
                gradient: "from-green-500 to-emerald-500",
              },
              {
                icon: Star,
                title: "Repository Metrics",
                description: "Stars, forks, watchers, and detailed repository performance analytics",
                gradient: "from-yellow-500 to-orange-500",
              },
              {
                icon: Calendar,
                title: "Activity Calendar",
                description: "Visual contribution calendar with streak counters and activity patterns",
                gradient: "from-red-500 to-rose-500",
              },
              {
                icon: Download,
                title: "Embed Generator",
                description: "One-click iframe generation for README.md with customizable themes",
                gradient: "from-indigo-500 to-blue-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
              >
                <CardContent className="p-0">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Preview */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Beautiful GitHub Visualizations</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Transform your GitHub data into stunning, shareable widgets
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Mock Stats Cards */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 rounded-2xl p-6 text-white">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Total Contributions</h3>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold mb-2">1,247</div>
              <div className="text-sm text-slate-400">+23% from last month</div>
              <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Languages</h3>
                <Code2 className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-3">
                {[
                  { name: "TypeScript", percentage: 45, color: "bg-blue-500" },
                  { name: "JavaScript", percentage: 30, color: "bg-yellow-500" },
                  { name: "Python", percentage: 25, color: "bg-green-500" },
                ].map((lang, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{lang.name}</span>
                        <span className="text-sm text-slate-500">{lang.percentage}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${lang.color} rounded-full`}
                          style={{ width: `${lang.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-800/50 rounded-3xl p-12">
            <CardContent className="p-0">
              <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Ready to Showcase Your Code?</h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                Join thousands of developers using GitFrame to create beautiful GitHub profile visualizations
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Github className="w-5 h-5 mr-2" />
                Get Started Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

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
  )
}
