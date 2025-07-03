import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Github,
  GitPullRequest,
  Star,
  Users,
  AlertCircle,
  Layers3,
  Code,
} from "lucide-react";

interface EmbedProps {
  params: {
    username: string;
  };
  searchParams: {
    theme?: string;
    opacity?: string;
    radius?: string;
    stats?: string;
  };
}

export async function generateMetadata({
  params,
}: EmbedProps): Promise<Metadata> {
  return {
    title: `GitHub Stats for ${params.username}`,
    description: `A dynamically generated GitHub statistics card for ${params.username}.`,
  };
}

// Helper to fetch data with better caching and error handling
async function getEmbedData(
  username: string,
  searchParams: EmbedProps["searchParams"],
) {
  const queryParams = new URLSearchParams();

  if (searchParams.theme) queryParams.append("theme", searchParams.theme);
  if (searchParams.opacity) queryParams.append("opacity", searchParams.opacity);
  if (searchParams.radius) queryParams.append("radius", searchParams.radius);
  if (searchParams.stats) queryParams.append("stats", searchParams.stats);

  const queryString = queryParams.toString();
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/embed/${username}${queryString ? `?${queryString}` : ""}`;

  try {
    // Cache for 5 minutes for better performance
    const response = await fetch(url, {
      next: { revalidate: 300 },
      headers: {
        "User-Agent": "GitFrame-Embed/1.0",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // This will trigger notFound()
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching embed data:", error);
    return { error: "Could not fetch data." };
  }
}

export default async function EmbedPage({ params, searchParams }: EmbedProps) {
  const { username } = params;
  const embedData = await getEmbedData(username, searchParams);

  if (!embedData) {
    return notFound();
  }

  if (embedData.error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent p-4">
        <div className="w-full max-w-md h-[180px] p-4 sm:p-6 bg-red-500/10 border border-red-500/30 rounded-lg flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 mb-2" />
          <h3 className="font-semibold text-red-200 mb-1 text-sm sm:text-base">
            Error Loading Data
          </h3>
          <p className="text-xs text-red-300">{embedData.error}</p>
        </div>
      </div>
    );
  }

  const { user, stats, theme, opacity, radius, statsToShow } = embedData;

  // Enhanced theme styles
  const themeStyles = {
    "minimal-glass":
      "bg-white/20 backdrop-blur-md border border-white/30 text-slate-900 dark:text-white",
    "dark-titanium": "bg-slate-900 border border-slate-700 text-white",
    "soft-white": "bg-white border border-slate-200 shadow-lg text-slate-900",
    "gradient-pro":
      "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200/50 text-slate-900 dark:text-white",
    "github-dark": "bg-[#0d1117] border border-[#30363d] text-[#c9d1d9]",
    synthwave:
      "bg-gradient-to-br from-[#2d2354] via-[#3d245c] to-[#602966] border border-[#bb72ac] text-[#f0d8f7]",
  };

  const selectedTheme =
    themeStyles[theme as keyof typeof themeStyles] ||
    themeStyles["minimal-glass"];

  const statItems = {
    commits: {
      label: "Commits",
      value: stats.commits?.toLocaleString() || "0",
      icon: <Github className="w-3 h-3" />,
    },
    prs: {
      label: "PRs",
      value: stats.pullRequests?.toLocaleString() || "0",
      icon: <GitPullRequest className="w-3 h-3" />,
    },
    issues: {
      label: "Issues",
      value: stats.issues?.toLocaleString() || "0",
      icon: <AlertCircle className="w-3 h-3" />,
    },
    stars: {
      label: "Stars",
      value: stats.stars?.toLocaleString() || "0",
      icon: <Star className="w-3 h-3" />,
    },
    followers: {
      label: "Followers",
      value: stats.followers?.toLocaleString() || "0",
      icon: <Users className="w-3 h-3" />,
    },
    repos: {
      label: "Repos",
      value: stats.repos?.toLocaleString() || "0",
      icon: <Layers3 className="w-3 h-3" />,
    },
    topLanguage: {
      label: "Top Lang",
      value: stats.topLanguage || "N/A",
      icon: <Code className="w-3 h-3" />,
    },
  };

  const visibleStats = statsToShow
    .map((key: string) => statItems[key as keyof typeof statItems])
    .filter(Boolean);

  // Calculate grid columns based on number of stats and responsive design
  const getGridCols = (count: number) => {
    if (count <= 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-2 sm:grid-cols-4";
    if (count <= 6) return "grid-cols-3";
    return "grid-cols-2 sm:grid-cols-4";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent p-2 sm:p-4">
      <div
        className={`w-full max-w-sm sm:max-w-md p-4 sm:p-5 font-sans transition-all duration-300 ${selectedTheme}`}
        style={{
          opacity: parseInt(opacity) / 100,
          borderRadius: `${radius}px`,
        }}
      >
        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/50 object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base sm:text-lg leading-tight truncate">
              {user.name}
            </h3>
            <p className="text-xs sm:text-sm opacity-80 truncate">
              @{user.login}
            </p>
          </div>
        </div>

        {visibleStats.length > 0 ? (
          <div
            className={`grid gap-2 sm:gap-3 ${getGridCols(visibleStats.length)}`}
          >
            {visibleStats.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-black/10 dark:bg-white/5 p-2 rounded-md"
              >
                <div className="text-base sm:text-xl font-bold tracking-tight leading-none mb-1">
                  {stat.value}
                </div>
                <div className="text-xs opacity-70 flex items-center justify-center gap-1">
                  {stat.icon}
                  <span className="truncate">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm opacity-70">No stats to display</p>
          </div>
        )}
      </div>
    </div>
  );
}
