import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { GitHubService } from "@/lib/github-service";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  try {
    // Get the session with auth options to ensure we get the access token
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if access token is available
    if (!session.accessToken) {
      console.error("Access token missing from session:", JSON.stringify(session, null, 2));
      return NextResponse.json(
        { error: "GitHub access token not available. Please sign out and sign in again." },
        { status: 401 }
      );
    }

    // Create GitHub service
    const githubService = new GitHubService(session.accessToken);

    // Get user activity
    const activity = await githubService.getRecentActivity();

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Error fetching GitHub activity:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch GitHub activity";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}