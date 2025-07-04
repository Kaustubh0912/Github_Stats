"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Github,
  Copy,
  Palette,
  Settings,
  Eye,
  Download,
  Sparkles,
  Zap,
  Moon,
  Sun,
  Loader2,
  GitPullRequest,
  AlertCircle,
  Layers3,
  Code,
  Users,
  Star,
  Menu,
  X,
  Monitor,
  ExternalLink,
} from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButton } from "@/components/auth-button";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";


export default function EmbedGallery() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("github-dark");
  const [embedFormat, setEmbedFormat] = useState("iframe"); // "iframe" or "github"
  const [showStats, setShowStats] = useState({
    commits: true,
    prs: true,
    stars: true,
    repos: true,
    issues: false,
    followers: false,
    topLanguage: false,
  });
  const [opacity, setOpacity] = useState([100]);
  const [borderRadius, setBorderRadius] = useState([12]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.login) return;

      setLoading(true);
      setError(null);

      try {
        const [statsRes, languagesRes, activityRes] = await Promise.all([
          fetch("/api/github/stats"),
          fetch("/api/github/languages"),
          fetch("/api/github/activity"),
        ]);

        if (!statsRes.ok || !languagesRes.ok || !activityRes.ok) {
          const failed = [statsRes, languagesRes, activityRes].find(
            (r) => !r.ok
          );
          const errorData = await failed
            ?.json()
            .catch(() => ({ error: failed?.statusText || "Failed to fetch" }));
          throw new Error(`API Error: ${errorData.error}`);
        }

        const [statsData, languagesData, activityData] = await Promise.all([
          statsRes.json(),
          languagesRes.json(),
          activityRes.json(),
        ]);

        setUserData({
          ...statsData,
          topLanguage: languagesData.length > 0 ? languagesData[0].name : "N/A",
          recentActivity: activityData,
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(`Failed to load GitHub data. ${errorMessage}`);
        toast({
          title: "Error fetching preview data",
          description: "Could not fetch your GitHub data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.login) {
      fetchUserData();
    }
  }, [session?.user?.login, toast]);

  if (!mounted) return null;

  const themes = [
    {
      id: "github-dark",
      name: "GitHub Dark",
      description: "Classic, developer-friendly dark theme.",
      preview: "bg-[#0d1117] border border-[#30363d]",
      icon: Github,
      text: "text-[#c9d1d9]",
      subtext: "text-[#8b949e]",
    },
    {
      id: "synthwave",
      name: "Synthwave",
      description: "A vibrant, retro-futuristic theme.",
      preview:
        "bg-gradient-to-br from-[#2d2354] to-[#602966] border border-[#bb72ac]",
      icon: Moon,
      text: "text-[#f0d8f7]",
      subtext: "text-[#f0d8f7]/80",
    },
    {
      id: "minimal-glass",
      name: "Minimal Glass",
      description: "Clean glassmorphic design.",
      preview: "bg-white/20 backdrop-blur-md border border-white/30",
      icon: Sparkles,
      text: "text-slate-900 dark:text-white",
      subtext: "opacity-80",
    },
    {
      id: "dark-titanium",
      name: "Dark Titanium",
      description: "Professional dark theme.",
      preview: "bg-slate-900 border border-slate-700",
      icon: Zap,
      text: "text-white",
      subtext: "text-slate-400",
    },
    {
      id: "soft-white",
      name: "Soft White",
      description: "Gentle white theme with soft shadows.",
      preview: "bg-white border border-slate-200 shadow-lg",
      icon: Sun,
      text: "text-slate-900",
      subtext: "text-slate-600",
    },
    {
      id: "gradient-pro",
      name: "Pro Gradient",
      description: "Elegant gradient backgrounds.",
      preview:
        "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200/50",
      icon: Palette,
      text: "text-slate-900 dark:text-white",
      subtext: "opacity-80",
    },
  ];

  const enabledStatsKeys = Object.entries(showStats)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key);

  // Use the actual GitHub username from session
  const embedUsername = session?.user?.login || "username";

  // Generate the embed URL
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

  const iframeUrl = `${baseUrl}/embed/${embedUsername}?theme=${selectedTheme}&opacity=${
    opacity[0]
  }&radius=${borderRadius[0]}&stats=${enabledStatsKeys.join(",")}`;

  // For GitHub embed, exclude topLanguage and opacity/radius parameters
  const githubStatsKeys = enabledStatsKeys;
  const githubUrl = `${baseUrl}/api/stats-card/${embedUsername}?theme=${selectedTheme}&stats=${githubStatsKeys.join(
    ","
  )}`;

  // Generate embed codes based on format
  const iframeCode = `<iframe
  src="${iframeUrl}"
  width="400"
  height="180"
  frameborder="0"
  scrolling="no"
  style="border-radius: ${borderRadius[0]}px; overflow: hidden;">
</iframe>`;

  const githubEmbedCode = `[![GitFrame](${githubUrl})](${githubUrl})`;

  const embedCode = embedFormat === "iframe" ? iframeCode : githubEmbedCode;

  const handleCopy = () => {
    if (!session?.user?.login) {
      toast({
        title: "Sign in required",
        description: "Please sign in to generate your personalized embed code.",
        variant: "destructive",
      });
      return;
    }

    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Copied!",
      description: `${
        embedFormat === "iframe" ? "Iframe" : "GitHub"
      } embed code copied to clipboard.`,
    });
  };

  const handlePreview = () => {
    if (!session?.user?.login) {
      toast({
        title: "Sign in required",
        description: "Please sign in to preview your embed.",
        variant: "destructive",
      });
      return;
    }

    window.open(iframeUrl, "_blank");
  };

  const selectedThemeConfig =
    themes.find((t) => t.id === selectedTheme) || themes[0];
  const themeClasses = `${selectedThemeConfig.preview} ${selectedThemeConfig.text}`;

  const statItems = {
    commits: {
      label: "Commits",
      value: userData?.totalCommits,
      icon: <Github className="w-3 h-3" />,
    },
    prs: {
      label: "PRs",
      value: userData?.prs,
      icon: <GitPullRequest className="w-3 h-3" />,
    },
    issues: {
      label: "Issues",
      value: userData?.issues,
      icon: <AlertCircle className="w-3 h-3" />,
    },
    stars: {
      label: "Stars",
      value: userData?.stars,
      icon: <Star className="w-3 h-3" />,
    },
    followers: {
      label: "Followers",
      value: userData?.followers,
      icon: <Users className="w-3 h-3" />,
    },
    repos: {
      label: "Repos",
      value: userData?.repositories,
      icon: <Layers3 className="w-3 h-3" />,
    },
    topLanguage: {
      label: "Top Lang",
      value: userData?.topLanguage,
      icon: <Code className="w-3 h-3" />,
    },
  };

  const visibleStats = enabledStatsKeys
    .map((key) => ({ key, ...statItems[key as keyof typeof statItems] }))
    .filter(Boolean);

  // Calculate grid columns for stats display
  const getGridCols = (count: number) => {
    if (count <= 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-4";
    if (count <= 6) return "grid-cols-3";
    return "grid-cols-4";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pb-32">
      {/* Responsive Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-4 sm:px-6">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-4 sm:px-6 py-3 shadow-2xl">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg sm:text-xl"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Github className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="hidden sm:inline">GitFrame</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/embed-gallery"
                className="text-blue-600 dark:text-blue-400 font-medium"
              >
                Embed Gallery
              </Link>
              <Link
                href="/dev"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Developer
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <ThemeToggle />
                <AuthButton />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
              <div className="flex flex-col space-y-3">
                <Link
                  href="/dashboard"
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/embed-gallery"
                  className="text-blue-600 dark:text-blue-400 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Embed Gallery
                </Link>
                <Link
                  href="/dev"
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Developer
                </Link>
                <div className="flex items-center gap-2 pt-2 sm:hidden">
                  <ThemeToggle />
                  <AuthButton />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              Embed Gallery
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Curated templates to style iframe cards for your READMEs. Choose
              from multiple themes and customize to match your project's
              aesthetic.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Theme Selection and Preview */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Theme Selection */}
              <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl lg:text-2xl">
                    <Palette className="w-5 h-5 lg:w-6 lg:h-6 text-purple-500" />
                    Choose Your Theme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {themes.map((theme) => (
                      <div
                        key={theme.id}
                        className={`p-4 lg:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                          selectedTheme === theme.id
                            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-105"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:scale-102"
                        }`}
                        onClick={() => setSelectedTheme(theme.id)}
                      >
                        <div
                          className={`w-full h-20 lg:h-24 rounded-xl mb-4 ${theme.preview} flex items-center justify-center`}
                        >
                          <theme.icon className="w-6 h-6 lg:w-8 lg:h-8 text-slate-600 dark:text-slate-300" />
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm lg:text-base">
                          {theme.name}
                        </h3>
                        <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {theme.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Live Preview */}
              <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-xl lg:text-2xl">
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 lg:w-6 lg:h-6 text-green-500" />
                      Live Preview
                    </div>
                    {session?.user?.login && (
                      <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                        (@{session.user.login})
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 lg:p-12 flex items-center justify-center min-h-[280px] lg:min-h-[320px]">
                    <div
                      className={`w-full max-w-md lg:max-w-lg p-5 lg:p-6 font-sans transition-all duration-300 ${themeClasses}`}
                      style={{
                        opacity: opacity[0] / 100,
                        borderRadius: `${borderRadius[0]}px`,
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={
                            session?.user?.image ||
                            "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                          }
                          alt={userData?.login || "GitHub user"}
                          className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 border-white/50 bg-slate-500"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg lg:text-xl leading-tight truncate">
                            {userData?.name ||
                              session?.user?.name ||
                              "Your Name"}
                          </h3>
                          <p
                            className={`text-sm lg:text-base ${selectedThemeConfig.subtext} truncate`}
                          >
                            @
                            {userData?.login ||
                              session?.user?.login ||
                              "username"}
                          </p>
                        </div>
                      </div>

                      {visibleStats.length > 0 ? (
                        <div
                          className={`grid gap-3 ${getGridCols(
                            visibleStats.length
                          )}`}
                        >
                          {visibleStats.map((stat, index) => {
                            const isLang = stat.key === "topLanguage";
                            const isLongLanguageName = stat.value?.length > 8;

                            return (
                              <div
                                key={index}
                                className={`text-center bg-black/10 dark:bg-white/5 p-3 rounded-md ${
                                  isLang
                                    ? "col-span-2 min-h-[80px] flex flex-col justify-center"
                                    : ""
                                }`}
                              >
                                <div
                                  className={`font-bold tracking-tight leading-tight mb-1 ${
                                    isLang && isLongLanguageName
                                      ? "text-base lg:text-lg"
                                      : "text-xl lg:text-2xl"
                                  } ${
                                    isLang ? "break-words hyphens-auto" : ""
                                  }`}
                                >
                                  {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                  ) : error ? (
                                    <span title={error}>N/A</span>
                                  ) : session?.user?.login ? (
                                    <span>
                                      {stat.key === "topLanguage"
                                        ? stat.value
                                        : stat.value?.toLocaleString() || "0"}
                                    </span>
                                  ) : (
                                    "..."
                                  )}
                                </div>
                                <div
                                  className={`text-xs lg:text-sm flex items-center justify-center gap-1.5 ${selectedThemeConfig.subtext}`}
                                >
                                  {stat.icon}
                                  <span>{stat.label}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p
                            className={`text-sm lg:text-base ${selectedThemeConfig.subtext}`}
                          >
                            Select a stat to display
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customization Panel */}
            <div className="space-y-6 sm:space-y-8">
              <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl lg:text-2xl">
                    <Settings className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500" />
                    Customize
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-8">
                  {/* --- Show Stats --- */}
                  <div className="space-y-4">
                    <h4 className="text-base lg:text-lg font-medium text-slate-900 dark:text-white">
                      Show Stats
                    </h4>
                    <div className="space-y-3">
                      {Object.entries({
                        commits: "Commits",
                        prs: "PRs",
                        issues: "Issues",
                        stars: "Stars",
                        repos: "Repos",
                        followers: "Followers",
                        topLanguage: "Top Lang",
                      }).map(([key, label]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                        >
                          <span className="text-sm lg:text-base text-slate-700 dark:text-slate-300 font-medium">
                            {label}
                          </span>
                          <Switch
                            checked={showStats[key as keyof typeof showStats]}
                            onCheckedChange={(checked) =>
                              setShowStats((prev) => ({
                                ...prev,
                                [key]: checked,
                              }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* --- Opacity --- */}
                  <div className="space-y-4">
                    <h4 className="text-base lg:text-lg font-medium text-slate-900 dark:text-white">
                      Background Opacity
                    </h4>
                    <Slider
                      value={opacity}
                      onValueChange={setOpacity}
                      max={100}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                    <div className="text-center text-sm lg:text-base font-medium text-slate-600 dark:text-slate-400">
                      {opacity[0]}%
                    </div>
                  </div>

                  {/* --- Border Radius --- */}
                  <div className="space-y-4">
                    <h4 className="text-base lg:text-lg font-medium text-slate-900 dark:text-white">
                      Border Radius
                    </h4>
                    <Slider
                      value={borderRadius}
                      onValueChange={setBorderRadius}
                      max={24}
                      min={0}
                      step={2}
                      className="w-full"
                    />
                    <div className="text-center text-sm lg:text-base font-medium text-slate-600 dark:text-slate-400">
                      {borderRadius[0]}px
                    </div>
                  </div>

                  {/* --- Embed Format & Code --- */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-base lg:text-lg font-medium text-slate-900 dark:text-white">
                        Embed Format
                      </h4>

                      <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                        <button
                          onClick={() => setEmbedFormat("iframe")}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                            embedFormat === "iframe"
                              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <Monitor className="w-4 h-4" />
                          Iframe
                        </button>
                        <button
                          onClick={() => setEmbedFormat("github")}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                            embedFormat === "github"
                              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <Github className="w-4 h-4" />
                          GitHub
                        </button>
                      </div>
                    </div>

                    {/* Code Display */}
                    <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-4 overflow-x-auto">
                      <code className="text-xs lg:text-sm text-green-400 font-mono whitespace-pre-wrap break-words">
                        {embedCode}
                      </code>
                    </div>

                    {/* Copy and Preview Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCopy}
                        disabled={!session?.user?.login}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm lg:text-base py-3 lg:py-4"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy {embedFormat === "iframe" ? "Iframe" : "GitHub"}
                      </Button>

                      <Button
                        onClick={handlePreview}
                        disabled={!session?.user?.login}
                        variant="outline"
                        className="px-4 py-3 lg:py-4 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>

                    {!session?.user?.login && (
                      <p className="text-xs lg:text-sm text-center mt-3 text-slate-500">
                        Please sign in to generate your personalized embed code.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
