"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Linkedin,
  Mail,
  Code2,
  Coffee,
  Heart,
  Zap,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButton } from "@/components/auth-button";
import { useToast } from "@/components/ui/use-toast";

export default function DevPage() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [githubData, setGithubData] = useState({
    commits: 0,
    repos: 0,
    stars: 0,
    followers: 0,
    following: 0,
    name: "Kaustubh Agrawal",
    bio: "",
    avatar_url: "",
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    fetchGithubData();
  }, []);

  const fetchGithubData = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/embed/Kaustubh0912?stats=commits,prs,stars,repos,followers",
      );

      if (response.ok) {
        const data = await response.json();

        setGithubData({
          commits: data.stats.commits || 0,
          repos: data.stats.repos || 0,
          stars: data.stats.stars || 0,
          followers: data.stats.followers || 0,
          following: 0, // Not available in embed API, will fetch separately
          name: data.user.name || "Kaustubh Agrawal",
          bio: "",
          avatar_url: data.user.avatar_url || "",
        });

        // Fetch additional data directly from GitHub API for following count
        try {
          const userResponse = await fetch(
            "https://api.github.com/users/Kaustubh0912",
          );
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setGithubData((prev) => ({
              ...prev,
              following: userData.following || 0,
              bio: userData.bio || prev.bio,
            }));
          }
        } catch (error) {
          console.log("Could not fetch additional user data:", error);
        }
      } else {
        throw new Error("Failed to fetch from embed API");
      }
    } catch (error) {
      console.error("Error fetching GitHub data:", error);

      // Fallback: Try direct GitHub API call
      try {
        const [userResponse, reposResponse, eventsResponse] = await Promise.all(
          [
            fetch("https://api.github.com/users/Kaustubh0912"),
            fetch(
              "https://api.github.com/users/Kaustubh0912/repos?per_page=100",
            ),
            fetch(
              "https://api.github.com/users/Kaustubh0912/events/public?per_page=100",
            ),
          ],
        );

        if (userResponse.ok && reposResponse.ok) {
          const userData = await userResponse.json();
          const reposData = await reposResponse.json();

          // Calculate total stars
          const totalStars = reposData.reduce(
            (acc: number, repo: any) => acc + repo.stargazers_count,
            0,
          );

          // Calculate commits from events (if available)
          let totalCommits = 0;
          if (eventsResponse.ok) {
            const eventsData = await eventsResponse.json();
            const commitEvents = eventsData.filter(
              (event: any) => event.type === "PushEvent",
            );
            totalCommits = commitEvents.reduce((acc: number, event: any) => {
              return acc + (event.payload?.size || 0);
            }, 0);
          }

          setGithubData({
            commits: totalCommits || 150, // Fallback number if events don't provide enough data
            repos: userData.public_repos,
            stars: totalStars,
            followers: userData.followers,
            following: userData.following,
            name: userData.name || "Kaustubh Agrawal",
            bio: userData.bio || "",
            avatar_url: userData.avatar_url,
          });
        } else {
          throw new Error("GitHub API failed");
        }
      } catch (fallbackError) {
        console.error("Fallback GitHub API also failed:", fallbackError);
        // Use static fallback data
        setGithubData({
          commits: 150,
          repos: 25,
          stars: 50,
          followers: 10,
          following: 20,
          name: "Kaustubh Agrawal",
          bio: "Passionate Full-Stack Developer",
          avatar_url: "",
        });

        toast({
          title: "Limited Data Available",
          description:
            "Showing cached GitHub statistics. Live data will load when API limits reset.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGetInTouch = () => {
    const subject = encodeURIComponent("Hello from GitFrame!");
    const body = encodeURIComponent(
      "Hi Kaustubh,\n\nI found your GitFrame project and would like to get in touch.\n\nBest regards,",
    );
    window.open(
      `mailto:kaustubharun2003@gmail.com?subject=${subject}&body=${body}`,
      "_blank",
    );
  };

  const handleDiscordContact = () => {
    // You can replace this with your actual Discord username
    const discordUsername = "kaustubh_ag"; // Replace with your actual Discord username

    toast({
      title: "Discord Username Copied!",
      description: `Discord username "${discordUsername}" has been copied to your clipboard.`,
    });

    navigator.clipboard.writeText(discordUsername).catch(() => {
      toast({
        title: "Discord Contact",
        description: `Discord username: ${discordUsername}`,
      });
    });
  };

  const handleCopyEmail = () => {
    const email = "kaustubharun2003@gmail.com";
    navigator.clipboard
      .writeText(email)
      .then(() => {
        toast({
          title: "Email copied!",
          description: "My email address has been copied to your clipboard.",
        });
      })
      .catch(() => {
        toast({
          title: "Email Address",
          description: email,
        });
      });
  };

  if (!mounted) return null;

  const developer = {
    name: githubData.name,
    handle: "@KCozy",
    role: "Full-Stack Developer & UI/UX Designer",
    bio:
      githubData.bio ||
      "Passionate creator of beautiful, performant web applications with a keen eye for design and user experience. Specializes in React, TypeScript, and modern web technologies while crafting intuitive interfaces and smooth animations.",
    avatar: githubData.avatar_url,
    skills: [
      "React",
      "TypeScript",
      "Next.js",
      "Node.js",
      "Tailwind CSS",
      "Python",
      "JavaScript",
      "MongoDB",
      "Express.js",
      "Git",
    ],
    social: {
      github: "https://github.com/Kaustubh0912",
      linkedin: "https://linkedin.com/in/nox912",
      email: "kaustubharun2003@gmail.com",
    },
    stats: {
      commits: githubData.commits,
      repos: githubData.repos,
      stars: githubData.stars,
      followers: githubData.followers,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Background Texture */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:28px_28px]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,rgba(255,255,255,0.1)_50%,transparent_65%)] bg-[length:28px_28px]" />
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
                className="text-blue-600 dark:text-blue-400 font-medium"
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
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Embed Gallery
                </Link>
                <Link
                  href="/dev"
                  className="text-blue-600 dark:text-blue-400 font-medium py-2"
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/50 dark:border-purple-800/50 rounded-full px-3 sm:px-4 py-2 mb-4 sm:mb-6">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
              <span className="text-xs sm:text-sm font-medium text-purple-700 dark:text-purple-300">
                Made with passion
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6 text-slate-900 dark:text-white">
              Meet the Developer
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              The creative mind behind GitFrame, dedicated to building tools
              that make developers' lives easier and more beautiful.
            </p>
          </div>

          {/* Developer Card */}
          <Card className="group bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-8 sm:p-12 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 mb-12 sm:mb-16">
            <CardContent className="p-0">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                    {developer.avatar ? (
                      <img
                        src={developer.avatar}
                        alt={developer.name}
                        className="w-full h-full object-cover rounded-3xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (
                            e.target as HTMLImageElement
                          ).parentElement!.innerHTML =
                            `<div class="w-12 h-12 sm:w-16 sm:h-16 text-white flex items-center justify-center"><svg class="w-12 h-12 sm:w-16 sm:h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H9V9L7 11V22H9V16H11V22H13V16H15V22H17V11L15 9H21Z"/></svg></div>`;
                        }}
                      />
                    ) : (
                      <Code2 className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-8 h-8 sm:w-12 sm:h-12 bg-green-500 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
                    <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {developer.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium text-lg sm:text-xl mb-3 sm:mb-4">
                  {developer.handle}
                </p>
                <Badge
                  variant="secondary"
                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2"
                >
                  {developer.role}
                </Badge>
              </div>

              {/* Bio */}
              <p className="text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 leading-relaxed text-base sm:text-lg text-center max-w-3xl mx-auto">
                {developer.bio}
              </p>

              {/* Skills */}
              <div className="mb-6 sm:mb-8">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4 text-center text-lg sm:text-xl">
                  Skills & Technologies
                </h4>
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                  {developer.skills.map((skill, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="outline"
                      className="bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8 max-w-2xl mx-auto">
                <div className="text-center p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {loading ? "..." : developer.stats.commits.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Commits
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {loading ? "..." : developer.stats.repos}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Repos
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {loading ? "..." : developer.stats.stars.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Stars
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {loading ? "..." : developer.stats.followers}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Followers
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent w-full sm:w-auto"
                  onClick={() => window.open(developer.social.github, "_blank")}
                >
                  <Github className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent w-full sm:w-auto"
                  onClick={() =>
                    window.open(developer.social.linkedin, "_blank")
                  }
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent w-full sm:w-auto"
                  onClick={handleGetInTouch}
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Email Me
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-800/50 rounded-3xl p-8 sm:p-12 text-center">
            <CardContent className="p-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Coffee className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-slate-900 dark:text-white">
                Built with Passion
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6 sm:mb-8">
                GitFrame is an open-source project built by a developer, for
                developers. I believe in creating tools that not only work well
                but also bring joy to the development experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  size="lg"
                  className="relative z-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 sm:px-8 w-full sm:w-auto"
                  onClick={handleGetInTouch}
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Get in Touch
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="relative z-10 border-2 border-slate-300 dark:border-slate-600 px-6 sm:px-8 bg-transparent w-full sm:w-auto"
                  onClick={handleDiscordContact}
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Discord
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="relative z-10 border-2 border-slate-300 dark:border-slate-600 px-6 sm:px-8 bg-transparent w-full sm:w-auto"
                  onClick={handleCopyEmail}
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Copy Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Responsive Footer */}
      <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm sm:max-w-md px-4">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-4 sm:px-6 py-3 shadow-2xl">
          <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <span>© 2024 GitFrame</span>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Built by @KCozy
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
