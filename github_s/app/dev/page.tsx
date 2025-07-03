"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Twitter, Globe, Mail, Code2, Coffee, Heart, Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthButton } from "@/components/auth-button"

export default function DevPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const developer = {
    name: "Kaustubh Agrawal",
    handle: "@KCozy",
    role: "Full-Stack Developer & UI/UX Designer",
    bio: "Passionate creator of beautiful, performant web applications with a keen eye for design and user experience. Specializes in React, TypeScript, and modern web technologies while crafting intuitive interfaces and smooth animations.",
    avatar: "/placeholder.svg?height=120&width=120",
    skills: [
      "React",
      "TypeScript",
      "Next.js",
      "Node.js",
      "Tailwind CSS",
      "Framer Motion",
      "GraphQL",
      "PostgreSQL",
      "Figma",
      "Three.js",
    ],
    social: {
      github: "https://github.com/kcozy",
      twitter: "https://twitter.com/kcozy",
      website: "https://kaustubh.dev",
    },
    stats: {
      commits: 3847,
      repos: 89,
      stars: 2156,
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Background Texture */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:28px_28px]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,rgba(255,255,255,0.1)_50%,transparent_65%)] bg-[length:28px_28px]" />
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
              <Link href="/dev" className="text-blue-600 dark:text-blue-400 font-medium">
                Developer
              </Link>
              <ThemeToggle />
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/50 dark:border-purple-800/50 rounded-full px-4 py-2 mb-6">
              <Heart className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Made with passion</span>
            </div>

            <h1 className="text-5xl font-bold mb-6 text-slate-900 dark:text-white">Meet the Developer</h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              The creative mind behind GitFrame, dedicated to building tools that make developers' lives easier and more
              beautiful.
            </p>
          </div>

          {/* Developer Card */}
          <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-12 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group mb-16">
            <CardContent className="p-0">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Code2 className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-green-500 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{developer.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium text-xl mb-4">{developer.handle}</p>
                <Badge
                  variant="secondary"
                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-lg px-4 py-2"
                >
                  {developer.role}
                </Badge>
              </div>

              {/* Bio */}
              <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed text-lg text-center max-w-3xl mx-auto">
                {developer.bio}
              </p>

              {/* Skills */}
              <div className="mb-8">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-center text-xl">
                  Skills & Technologies
                </h4>
                <div className="flex flex-wrap gap-3 justify-center">
                  {developer.skills.map((skill, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="outline"
                      className="bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-base px-4 py-2"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8 max-w-md mx-auto">
                <div className="text-center p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {developer.stats.commits.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Commits</div>
                </div>
                <div className="text-center p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{developer.stats.repos}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Repos</div>
                </div>
                <div className="text-center p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {developer.stats.stars.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Stars</div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent"
                >
                  <Github className="w-5 h-5 mr-2" />
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Website
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent"
                >
                  <Twitter className="w-5 h-5 mr-2" />
                  Twitter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-800/50 rounded-3xl p-12 text-center">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Built with Passion</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
                GitFrame is an open-source project built by a developer, for developers. I believe in creating tools
                that not only work well but also bring joy to the development experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8"
                >
                  <Github className="w-5 h-5 mr-2" />
                  View on GitHub
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-slate-300 dark:border-slate-600 px-8 bg-transparent"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Get in Touch
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Footer */}
      <footer className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-6 py-3 shadow-2xl">
          <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
            <span>© 2024 GitFrame</span>
            <div className="flex items-center gap-4">
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors">Built by @KCozy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
