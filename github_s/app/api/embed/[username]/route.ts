import { NextRequest, NextResponse } from "next/server";
import { GitHubService } from "@/lib/github-service";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } },
) {
  try {
    const { username } = params;
    const { searchParams } = new URL(request.url);

    // Get theme and stats parameters
    const theme = searchParams.get("theme") || "minimal-glass";
    const statsParam = searchParams.get("stats") || "commits,prs,stars,repos";
    const opacity = searchParams.get("opacity") || "80";
    const radius = searchParams.get("radius") || "12";

    // Parse stats to display
    const statsToShow = statsParam.split(",");

    // Create GitHub service with PAT for higher rate limits
    const githubService = new GitHubService(); // Will use PAT from env

    // Get public user data
    const stats = await githubService.getPublicUserStats(username);
    const languages = await githubService.getPublicUserLanguages(username);

    // Find the top language
    const topLanguage = languages.length > 0 ? languages[0].name : "None";

    // Prepare response data
    const embedData = {
      user: {
        login: stats.login,
        name: stats.name,
        avatar_url: stats.avatar_url,
      },
      stats: {
        commits: stats.totalCommits,
        pullRequests: stats.prs,
        issues: stats.issues,
        stars: stats.stars,
        followers: stats.followers,
        repos: stats.repositories,
        topLanguage,
      },
      theme,
      opacity,
      radius,
      statsToShow,
    };

    return NextResponse.json(embedData, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error generating embed:", error);
    const errorMessage =
      error instanceof Error && "message" in error
        ? error.message
        : "Failed to generate embed";
    const status = errorMessage.includes("Not Found") ? 404 : 500;

    return NextResponse.json(
      {
        error: `Failed to generate embed for user. ${status === 404 ? "User not found." : ""}`,
      },
      {
        status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    );
  }
}
