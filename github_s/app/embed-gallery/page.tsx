"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Github, Copy, Palette, Settings, Eye, Download, Sparkles, Zap, Moon, Sun } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthButton } from "@/components/auth-button"

export default function EmbedGallery() {
  const [mounted, setMounted] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState("minimal-glass")
  const [showStats, setShowStats] = useState({
    commits: true,
    languages: true,
    stars: true,
    followers: false,
  })
  const [opacity, setOpacity] = useState([80])
  const [borderRadius, setBorderRadius] = useState([12])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const themes = [
    {
      id: "minimal-glass",
      name: "Minimal Glass",
      description: "Clean glassmorphic design with subtle transparency",
      preview: "bg-white/20 backdrop-blur-md border border-white/30",
      icon: Sparkles,
    },
    {
      id: "dark-titanium",
      name: "Dark Titanium",
      description: "Professional dark theme with metallic accents",
      preview: "bg-slate-900 border border-slate-700",
      icon: Zap,
    },
    {
      id: "soft-white",
      name: "Soft White",
      description: "Gentle white theme with soft shadows",
      preview: "bg-white border border-slate-200 shadow-lg",
      icon: Sun,
    },
    {
      id: "gradient-pro",
      name: "Professional Gradient",
      description: "Elegant gradient backgrounds with modern styling",
      preview: "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200/50",
      icon: Moon,
    },
  ]

  const embedCode = `<iframe 
  src="https://gitframe.dev/embed/username?theme=${selectedTheme}&opacity=${opacity[0]}&radius=${borderRadius[0]}&stats=${Object.entries(
    showStats,
  )
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key)
    .join(",")}"
  width="400" 
  height="200" 
  frameborder="0">
</iframe>`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Background Texture */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:32px_32px]" />
        <div className="absolute inset-0 bg-[linear-gradient(60deg,transparent_35%,rgba(255,255,255,0.1)_50%,transparent_65%)] bg-[length:32px_32px]" />
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
              <Link href="/embed-gallery" className="text-blue-600 dark:text-blue-400 font-medium">
                Embed Gallery
              </Link>
              <Link
                href="/dev"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Developers
              </Link>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <ThemeToggle />
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Embed Gallery</h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Curated templates to style iframe cards for your READMEs. Choose from multiple themes and customize to
              match your project's aesthetic.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Theme Selection */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-500" />
                    Choose Your Theme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {themes.map((theme) => (
                      <div
                        key={theme.id}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                          selectedTheme === theme.id
                            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                        onClick={() => setSelectedTheme(theme.id)}
                      >
                        <div
                          className={`w-full h-24 rounded-xl mb-3 ${theme.preview} flex items-center justify-center`}
                        >
                          <theme.icon className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{theme.name}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{theme.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-green-500" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 flex items-center justify-center">
                    <div
                      className={`w-96 h-48 rounded-2xl p-6 ${
                        selectedTheme === "minimal-glass"
                          ? "bg-white/20 backdrop-blur-md border border-white/30"
                          : selectedTheme === "dark-titanium"
                            ? "bg-slate-900 border border-slate-700"
                            : selectedTheme === "soft-white"
                              ? "bg-white border border-slate-200 shadow-lg"
                              : "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200/50"
                      }`}
                      style={{
                        opacity: opacity[0] / 100,
                        borderRadius: `${borderRadius[0]}px`,
                      }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Github className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">@username</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400">GitHub Stats</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {showStats.commits && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-slate-900 dark:text-white">1,247</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">Commits</div>
                          </div>
                        )}
                        {showStats.languages && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-slate-900 dark:text-white">8</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">Languages</div>
                          </div>
                        )}
                        {showStats.stars && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-slate-900 dark:text-white">324</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">Stars</div>
                          </div>
                        )}
                        {showStats.followers && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-slate-900 dark:text-white">156</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">Followers</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customization Panel */}
            <div className="space-y-6">
              <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-500" />
                    Customize
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Stats Selection */}
                  <div>
                    <h4 className="font-medium mb-3 text-slate-900 dark:text-white">Show Stats</h4>
                    <div className="space-y-3">
                      {Object.entries(showStats).map(([key, enabled]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">{key}</span>
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) => setShowStats((prev) => ({ ...prev, [key]: checked }))}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Opacity */}
                  <div>
                    <h4 className="font-medium mb-3 text-slate-900 dark:text-white">Background Opacity</h4>
                    <Slider
                      value={opacity}
                      onValueChange={setOpacity}
                      max={100}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{opacity[0]}%</div>
                  </div>

                  {/* Border Radius */}
                  <div>
                    <h4 className="font-medium mb-3 text-slate-900 dark:text-white">Border Radius</h4>
                    <Slider
                      value={borderRadius}
                      onValueChange={setBorderRadius}
                      max={24}
                      min={0}
                      step={2}
                      className="w-full"
                    />
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{borderRadius[0]}px</div>
                  </div>
                </CardContent>
              </Card>

              {/* Embed Code */}
              <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-orange-500" />
                    Embed Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-4 mb-4">
                    <code className="text-sm text-green-400 font-mono whitespace-pre-wrap break-all">{embedCode}</code>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Embed Code
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Footer */}
      <footer className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-6 py-3 shadow-2xl">
          <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
            <span>© 2024 GitFrame</span>
            <div className="flex items-center gap-4">
              <span>Built by @KCozy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
