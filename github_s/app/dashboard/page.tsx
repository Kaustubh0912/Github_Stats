"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "@/components/icons";
import { signOut } from "next-auth/react";

import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButton } from "@/components/auth-button";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/components/auth-context";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<any>(null);
  const [languages, setLanguages] = useState<
    Array<{
      name: string;
      percentage: number;
      color: string;
      lines: number;
    }>
  >([]);
  const [recentActivity, setRecentActivity] = useState<
    Array<{
      type: "commit" | "pr" | "issue";
      repo: string;
      message: string;
      time: string;
      url?: string;
    }>
  >([]);
  const { user } = useAuth();

  // Fetch GitHub data
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch stats
        const statsResponse = await fetch("/api/github/stats");
        if (!statsResponse.ok) {
          const errorData = await statsResponse.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch GitHub stats");
        }
        const statsData = await statsResponse.json();
        setStatsData(statsData);

        // Fetch languages
        const languagesResponse = await fetch("/api/github/languages");
        if (!languagesResponse.ok) {
          const errorData = await languagesResponse.json().catch(() => ({}));
          throw new Error(
            errorData.error || "Failed to fetch GitHub languages"
          );
        }
        const languagesData = await languagesResponse.json();
        setLanguages(languagesData);

        // Fetch activity
        const activityResponse = await fetch("/api/github/activity");
        if (!activityResponse.ok) {
          const errorData = await activityResponse.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch GitHub activity");
        }
        const activityData = await activityResponse.json();
        setRecentActivity(activityData);
      } catch (err) {
        console.error("Error fetching GitHub data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    if (mounted && user) {
      fetchGitHubData();
    }
  }, [mounted, user]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Calculate additional stats
  const totalStars = statsData?.stars || 0;
  const totalRepos = statsData?.repositories || 0;
  const totalFollowers = statsData?.followers || 0;
  const totalCommits = statsData?.totalCommits || 0;
  const totalPRs = statsData?.prs || 0;
  const totalIssues = statsData?.issues || 0;
  const totalContributions = statsData?.contributions || 0;

  // Calculate growth percentages (mock data for now)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center max-w-sm w-full">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <Github className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600 mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                Loading GitHub data...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="fixed inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center max-w-md w-full">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                Error Loading Data
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 text-center mb-4 sm:mb-6">
                {error}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white w-full sm:w-auto"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Background Texture */}
        <div className="fixed inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:24px_24px]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_35%,rgba(255,255,255,0.1)_50%,transparent_65%)] bg-[length:24px_24px]" />
        </div>

        {/* Responsive Navigation */}
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4 sm:px-6">
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
                  className="text-blue-600 dark:text-blue-400 font-medium"
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
                    className="text-blue-600 dark:text-blue-400 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/embed-gallery"
                    className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-2"
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

        <div className="pt-20 sm:pt-24 px-4 sm:px-6 pb-16 sm:pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Github className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                      GitHub Dashboard
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                      {statsData?.name || user?.name || "Welcome!"}
                      {statsData?.login && ` • @${statsData.login}`}
                      {statsData?.created_at &&
                        ` • Joined ${new Date(
                          statsData.created_at
                        ).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                {user && (
                  <Button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    variant="outline"
                    className="flex items-center gap-2 border-slate-300 dark:border-slate-700 w-full sm:w-auto"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[
                {
                  label: "Total Commits",
                  value: totalCommits,
                  icon: GitCommit,
                  color: "text-blue-500",
                  bg: "bg-blue-500/10",
                },
                {
                  label: "Repositories",
                  value: totalRepos,
                  icon: Code2,
                  color: "text-green-500",
                  bg: "bg-green-500/10",
                },
                {
                  label: "Stars Earned",
                  value: totalStars,
                  icon: Star,
                  color: "text-yellow-500",
                  bg: "bg-yellow-500/10",
                },
                {
                  label: "Followers",
                  value: totalFollowers,
                  icon: Users,
                  color: "text-purple-500",
                  bg: "bg-purple-500/10",
                },
              ].map((stat, index) => (
                <Card
                  key={index}
                  className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-300 group"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <stat.icon
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`}
                        />
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
                      {stat.value.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
              <TabsList className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-1 w-full sm:w-fit">
                <TabsTrigger
                  value="overview"
                  className="rounded-xl text-xs sm:text-sm"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="languages"
                  className="rounded-xl text-xs sm:text-sm"
                >
                  Languages
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="rounded-xl text-xs sm:text-sm"
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value="contributions"
                  className="rounded-xl text-xs sm:text-sm"
                >
                  Contributions
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                  {/* Recent Activity */}
                  <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                      {recentActivity.length > 0 ? (
                        recentActivity.slice(0, 4).map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition-colors group"
                          >
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              {activity.type === "commit" && (
                                <GitCommit className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              )}
                              {activity.type === "pr" && (
                                <GitPullRequest className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              )}
                              {activity.type === "issue" && (
                                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                {activity.message}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                <span className="truncate">
                                  {activity.repo}
                                </span>
                                {activity.url && (
                                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3" />
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 sm:py-8 text-slate-500 dark:text-slate-400">
                          <Activity className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No recent activity found</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        Quick Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                      {[
                        {
                          label: "Pull Requests",
                          value: totalPRs,
                        },
                        {
                          label: "Issues Opened",
                          value: totalIssues,
                        },
                        {
                          label: "Contributions",
                          value: totalContributions,
                        },
                        {
                          label: "Following",
                          value: statsData?.following || 0,
                        },
                      ].map((stat, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/50"
                        >
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {stat.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                              {stat.value.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="languages" className="space-y-4 sm:space-y-6">
                <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                      Programming Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    {languages.length > 0 ? (
                      languages.map((lang, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div className="flex items-center gap-2">
                              {/* Color indicator dot */}
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  lang.color || "bg-gray-500"
                                }`}
                              />
                              <span className="font-medium text-slate-900 dark:text-white">
                                {lang.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="text-slate-600 dark:text-slate-400">
                                {lang.lines?.toLocaleString() || 0} lines
                              </span>
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {lang.percentage}%
                              </span>
                            </div>
                          </div>

                          {/* Progress bar with proper fallback */}
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                lang.color || "bg-gray-500"
                              }`}
                              style={{
                                width: `${Math.max(lang.percentage, 0)}%`,
                                minWidth: lang.percentage > 0 ? "4px" : "0px", // Ensure small percentages are visible
                              }}
                            />
                          </div>

                          {/* Debug info (remove in production) */}
                          {process.env.NODE_ENV === "development" && (
                            <div className="text-xs text-gray-400 opacity-50">
                              Debug: {lang.name} → {lang.color || "NO COLOR"}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 sm:py-8 text-slate-500 dark:text-slate-400">
                        <Code2 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No language data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="activity">
                <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                      Activity Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {recentActivity.length > 0 ? (
                        recentActivity.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition-colors group"
                          >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                              {activity.type === "commit" && (
                                <GitCommit className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              )}
                              {activity.type === "pr" && (
                                <GitPullRequest className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              )}
                              {activity.type === "issue" && (
                                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate">
                                  {activity.repo}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="text-xs w-fit"
                                >
                                  {activity.type}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white mb-2 break-words">
                                {activity.message}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {activity.time}
                              </p>
                            </div>
                            {activity.url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                onClick={() =>
                                  window.open(activity.url, "_blank")
                                }
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 sm:py-12 text-slate-500 dark:text-slate-400">
                          <Calendar className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
                          <p>No recent activity found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="contributions">
                <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      Contribution Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          This Year
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              Total Contributions
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {totalContributions.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              Commits
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {totalCommits.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              Pull Requests
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {totalPRs.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              Issues
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {totalIssues.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          Repository Stats
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              Public Repositories
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {totalRepos.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              Total Stars
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {totalStars.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              Followers
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {totalFollowers.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              Following
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {(statsData?.following || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-green-200/50 dark:border-green-800/50">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-green-700 dark:text-green-400">
                          Activity Trend
                        </span>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        Your contributions show consistent activity with recent
                        growth in repository stars and followers.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Responsive Footer */}
        <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm sm:max-w-md px-4">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-4 sm:px-6 py-3 shadow-2xl">
            <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <span>© 2025 GitFrame</span>
              <div className="flex items-center gap-2 sm:gap-4">
                <Link
                  href="/dev"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Built by @KCozy
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
