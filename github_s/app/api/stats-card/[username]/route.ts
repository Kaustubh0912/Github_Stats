import { NextRequest } from "next/server";
import { GitHubService } from "@/lib/github-service";
type GradientStop = {
  offset: string;
  color: string;
};

type ThemeStyle = {
  background: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  statBg: string;
  avatarBorder: string;
  isGradient: boolean;
  gradientStops?: GradientStop[]; // ✅ optional key
};

const themeStyles: Record<string, ThemeStyle> = {
  "minimal-glass": {
    background: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    textPrimary: "#1e293b",
    textSecondary: "#64748b",
    statBg: "rgba(0, 0, 0, 0.1)",
    avatarBorder: "rgba(255, 255, 255, 0.5)",
    isGradient: false,
  },
  "dark-titanium": {
    background: "#0f172a",
    border: "1px solid #334155",
    textPrimary: "#ffffff",
    textSecondary: "#94a3b8",
    statBg: "rgba(255, 255, 255, 0.05)",
    avatarBorder: "rgba(255, 255, 255, 0.5)",
    isGradient: false,
  },
  "soft-white": {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    textPrimary: "#1e293b",
    textSecondary: "#475569",
    statBg: "rgba(0, 0, 0, 0.05)",
    avatarBorder: "rgba(255, 255, 255, 0.5)",
    isGradient: false,
  },
  "gradient-pro": {
    background: "url(#gradientProBg)",
    border: "1px solid rgba(165, 180, 252, 0.5)",
    textPrimary: "#1e293b",
    textSecondary: "#475569",
    statBg: "rgba(0, 0, 0, 0.1)",
    avatarBorder: "rgba(255, 255, 255, 0.5)",
    isGradient: true,
    gradientStops: [
      { offset: "0%", color: "rgba(59, 130, 246, 0.1)" },
      { offset: "100%", color: "rgba(168, 85, 247, 0.1)" },
    ],
  },
  "github-dark": {
    background: "#0d1117",
    border: "1px solid #30363d",
    textPrimary: "#c9d1d9",
    textSecondary: "#8b949e",
    statBg: "rgba(255, 255, 255, 0.05)",
    avatarBorder: "rgba(255, 255, 255, 0.5)",
    isGradient: false,
  },
  synthwave: {
    background: "url(#synthwaveBg)",
    border: "1px solid #bb72ac",
    textPrimary: "#f0d8f7",
    textSecondary: "#d8b2e8",
    statBg: "rgba(255, 255, 255, 0.1)",
    avatarBorder: "#bb72ac",
    isGradient: true,
    gradientStops: [
      { offset: "0%", color: "#2d2354" },
      { offset: "50%", color: "#3d245c" },
      { offset: "100%", color: "#602966" },
    ],
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const { searchParams } = new URL(request.url);

    const theme =
      (searchParams.get("theme") as keyof typeof themeStyles) ||
      "minimal-glass";
    const opacity = searchParams.get("opacity") || "100";
    const radius = searchParams.get("radius") || "12";
    const statsParam = searchParams.get("stats") || "commits,prs,issues,stars,followers,repos,topLanguage";

    const styles = themeStyles[theme];
    const githubService = new GitHubService();
    const stats = await githubService.getPublicUserStats(username);
    const languages = await githubService.getPublicUserLanguages(username);
    const topLanguage = languages.length > 0 ? languages[0].name : "N/A";

    console.log("Fetched stats:", stats);

    const selectedStats = statsParam.split(",").filter(Boolean);

    // Define all available stats with proper mapping
    const allStats = {
      commits: { label: "Commits", value: stats.totalCommits.toLocaleString() },
      prs: { label: "PRs", value: stats.prs.toLocaleString() },
      issues: { label: "Issues", value: stats.issues?.toLocaleString() || "0" },
      stars: { label: "Stars", value: stats.stars.toLocaleString() },
      followers: { label: "Followers", value: stats.followers?.toLocaleString() || "0" },
      repos: { label: "Repos", value: stats.repositories.toLocaleString() },
      topLanguage: { label: "Top Lang", value: topLanguage },
    };

    // Map selected stats to display data
    const statData: { label: string; value: string }[] = selectedStats
      .map((statKey) => allStats[statKey as keyof typeof allStats])
      .filter(Boolean);

    // Dynamic card sizing based on number of stats
    const getCardDimensions = (statCount: number) => {
      if (statCount <= 2) return { width: 320, height: 180 };
      if (statCount <= 4) return { width: 420, height: 180 };
      if (statCount <= 6) return { width: 480, height: 220 };
      return { width: 520, height: 240 };
    };

    const { width: cardWidth, height: cardHeight } = getCardDimensions(statData.length);
    const padding = 20;

    // Header section
    const avatarSize = 48;
    const avatarX = padding;
    const avatarY = padding;
    const nameX = avatarX + avatarSize + 16;
    const nameY = avatarY + 18;
    const usernameY = nameY + 20;

    // Stats grid configuration
    const statsStartY = avatarY + avatarSize + 20;
    const statHeight = 48;
    const gap = 12;
    const totalStatsWidth = cardWidth - padding * 2;

    // Calculate grid layout
    const getGridLayout = (count: number) => {
      if (count <= 2) return { cols: 2, rows: 1 };
      if (count <= 4) return { cols: count <= 2 ? 2 : 4, rows: 1 };
      if (count <= 6) return { cols: 3, rows: 2 };
      return { cols: 4, rows: 2 };
    };

    const { cols, rows } = getGridLayout(statData.length);
    const statWidth = (totalStatsWidth - (cols - 1) * gap) / cols;

    const statElements = statData
      .map((stat, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = padding + col * (statWidth + gap);
        const y = statsStartY + row * (statHeight + gap);

        return `
        <g>
          <!-- Stat background -->
          <rect x="${x}" y="${y}" width="${statWidth}" height="${statHeight}" 
                rx="6" fill="${styles.statBg}" />
          
          <!-- Stat value -->
          <text x="${x + statWidth / 2}" y="${y + 20}" 
                text-anchor="middle" font-size="16" font-weight="700" 
                fill="${styles.textPrimary}">${stat.value}</text>
          
          <!-- Stat label -->
          <text x="${x + statWidth / 2}" y="${y + 36}" 
                text-anchor="middle" font-size="10" font-weight="400" 
                fill="${styles.textSecondary}" opacity="0.8">${stat.label}</text>
        </g>
      `;
      })
      .join("\n");

    // Create gradient definitions
    const createGradientDefs = () => {
      if (!styles.isGradient) return "";
      
      const gradientId = theme === "gradient-pro" ? "gradientProBg" : "synthwaveBg";
      const stops = styles.gradientStops?.map(stop => 
        `<stop offset="${stop.offset}" stop-color="${stop.color}" />`
      ).join("\n") || "";

      return `
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          ${stops}
        </linearGradient>
      `;
    };

    const svg = `
<svg width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .card-title { 
      font: 700 16px 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; 
      dominant-baseline: middle;
    }
    .card-subtitle { 
      font: 400 12px 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; 
      dominant-baseline: middle;
    }
    .stat-value { 
      font: 700 16px 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; 
      dominant-baseline: middle;
    }
    .stat-label { 
      font: 400 10px 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; 
      dominant-baseline: middle;
    }
  </style>
  
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="8" flood-color="rgba(0,0,0,0.1)"/>
    </filter>
    <clipPath id="avatarClip">
      <circle cx="${avatarX + avatarSize / 2}" cy="${avatarY + avatarSize / 2}" r="${avatarSize / 2}" />
    </clipPath>
    ${createGradientDefs()}
  </defs>

  <!-- Card background -->
  <rect width="100%" height="100%" rx="${radius}" 
        fill="${styles.background}" 
        stroke="${styles.border.replace('1px solid ', '')}" 
        fill-opacity="${parseInt(opacity) / 100}"
        filter="url(#shadow)" />

  <!-- Avatar with border -->
  <circle cx="${avatarX + avatarSize / 2}" cy="${avatarY + avatarSize / 2}" r="${avatarSize / 2 + 1}" 
          fill="none" stroke="${styles.avatarBorder}" stroke-width="2" />
  
  <!-- Avatar image -->
  <image href="${stats.avatar_url}" x="${avatarX}" y="${avatarY}" 
         width="${avatarSize}" height="${avatarSize}" 
         clip-path="url(#avatarClip)" />

  <!-- User info -->
  <text x="${nameX}" y="${nameY}" class="card-title" fill="${styles.textPrimary}">
    ${stats.name || stats.login}
  </text>
  <text x="${nameX}" y="${usernameY}" class="card-subtitle" fill="${styles.textSecondary}" opacity="0.8">
    @${stats.login}
  </text>

  <!-- Stats grid -->
  ${statElements}
</svg>
    `;

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=1800",
      },
    });
  } catch (error) {
    const errorSvg = generateErrorSVG();
    return new Response(errorSvg, {
      status: 500,
      headers: { "Content-Type": "image/svg+xml" },
    });
  }
}

function generateErrorSVG() {
  return `<svg width="520" height="240" viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg">
    <style>
      .error-title { font: 600 16px 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; }
      .error-text { font: 400 12px 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; }
    </style>
    
    <defs>
      <filter id="errorShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="8" flood-color="rgba(0,0,0,0.1)"/>
      </filter>
    </defs>

    <!-- Error card background -->
    <rect width="100%" height="100%" rx="12" fill="rgba(239, 68, 68, 0.1)" 
          stroke="rgba(239, 68, 68, 0.3)" stroke-width="1" filter="url(#errorShadow)" />
    
    <!-- Error icon -->
    <circle cx="260" cy="100" r="16" fill="rgba(239, 68, 68, 0.2)" />
    <text x="260" y="107" text-anchor="middle" font-size="18" fill="#dc2626">⚠</text>
    
    <!-- Error messages -->
    <text x="260" y="140" text-anchor="middle" class="error-title" fill="#dc2626">
      Error: Failed to load GitHub stats
    </text>
    <text x="260" y="160" text-anchor="middle" class="error-text" fill="#b91c1c">
      Please check the username or try again later
    </text>
  </svg>`;
}