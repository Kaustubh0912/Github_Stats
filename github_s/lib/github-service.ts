import { Octokit } from "octokit";

export interface GitHubStats {
  totalCommits: number;
  repositories: number;
  followers: number;
  following: number;
  stars: number;
  prs: number;
  issues: number;
  contributions: number;
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  created_at: string;
}

export interface GitHubLanguage {
  name: string;
  percentage: number;
  color: string;
  lines: number;
}

export interface GitHubActivity {
  type: "commit" | "pr" | "issue";
  repo: string;
  message: string;
  time: string;
  url?: string;
}

export class GitHubService {
  private octokit: Octokit;

  constructor(accessToken?: string) {
    // Use provided access token or fall back to PAT for public API calls
    const token = accessToken || process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
    this.octokit = new Octokit({
      auth: token,
      throttle: {
        onRateLimit: (retryAfter: number, options: any) => {
          console.warn(
            `Request quota exhausted for request ${options.method} ${options.url}`,
          );
          if (options.request.retryCount === 0) {
            console.log(`Retrying after ${retryAfter} seconds!`);
            return true;
          }
        },
        onSecondaryRateLimit: (retryAfter: number, options: any) => {
          console.warn(
            `Secondary rate limit hit for ${options.method} ${options.url}`,
          );
        },
      },
    });
  }

  /**
   * Get public user data (uses PAT for higher rate limits)
   */
  async getPublicUserData(username: string) {
    try {
      const { data } = await this.octokit.rest.users.getByUsername({
        username,
      });
      return data;
    } catch (error) {
      console.error(`Error fetching public user data for ${username}:`, error);
      throw error;
    }
  }

  /**
   * Get public repositories for any user
   */
  async getPublicRepositories(username: string) {
    try {
      const { data } = await this.octokit.rest.repos.listForUser({
        username,
        per_page: 100,
        sort: "updated",
        type: "public",
      });
      return data;
    } catch (error) {
      console.error(`Error fetching repositories for ${username}:`, error);
      throw error;
    }
  }

  /**
   * Get public events for any user
   */
  async getPublicEvents(username: string) {
    try {
      const { data } = await this.octokit.rest.activity.listPublicEventsForUser(
        {
          username,
          per_page: 100,
        },
      );
      return data;
    } catch (error) {
      console.error(`Error fetching events for ${username}:`, error);
      throw error;
    }
  }

  /**
   * Get user profile information (authenticated user)
   */
  async getUserProfile() {
    const { data } = await this.octokit.rest.users.getAuthenticated();
    return data;
  }

  /**
   * Get user repositories (authenticated user)
   */
  async getUserRepositories() {
    const { data } = await this.octokit.rest.repos.listForAuthenticatedUser({
      per_page: 100,
      sort: "updated",
    });
    return data;
  }

  /**
   * Get contribution stats using GraphQL
   */
  async getContributionStats(username: string, from: string, to: string) {
    try {
      const query = `
        query($username: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
              totalCommitContributions
              totalIssueContributions
              totalPullRequestContributions
              totalPullRequestReviewContributions
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `;

      const response = await this.octokit.graphql(query, {
        username,
        from,
        to,
      });

      // @ts-ignore
      return response.user.contributionsCollection;
    } catch (error) {
      console.error("Error fetching contribution stats:", error);
      return null;
    }
  }

  /**
   * Get comprehensive stats for any public user
   */
  async getPublicUserStats(username: string): Promise<GitHubStats> {
    // Get user profile
    const profile = await this.getPublicUserData(username);

    // Get user repositories
    const repos = await this.getPublicRepositories(username);

    // Calculate total stars
    const stars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

    // Get contribution stats for the last year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const contributionStats = await this.getContributionStats(
      username,
      oneYearAgo.toISOString(),
      new Date().toISOString(),
    );

    // Get public events for commit counting
    const events = await this.getPublicEvents(username);
    const commits = events
      .filter((event) => event.type === "PushEvent")
      // @ts-ignore
      .reduce((acc, event) => acc + (event.payload.size || 0), 0);

    // Get search results for PRs and issues (more accurate than events)
    const [prsResult, issuesResult] = await Promise.all([
      this.octokit.rest.search.issuesAndPullRequests({
        q: `author:${username} type:pr`,
        per_page: 1,
      }),
      this.octokit.rest.search.issuesAndPullRequests({
        q: `author:${username} type:issue`,
        per_page: 1,
      }),
    ]);

    return {
      totalCommits: contributionStats?.totalCommitContributions || commits,
      repositories: repos.length,
      followers: profile.followers,
      following: profile.following,
      stars,
      prs: prsResult.data.total_count,
      issues: issuesResult.data.total_count,
      contributions:
        contributionStats?.contributionCalendar.totalContributions || 0,
      login: profile.login,
      name: profile.name || profile.login,
      avatar_url: profile.avatar_url,
      public_repos: profile.public_repos,
      created_at: profile.created_at,
    };
  }

  /**
   * Get user stats (authenticated user)
   */
  async getUserStats(): Promise<GitHubStats> {
    // Get user profile
    const profile = await this.getUserProfile();

    // Get user repositories
    const repos = await this.getUserRepositories();

    // Calculate total stars
    const stars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

    // Get contribution stats for the last year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const contributionStats = await this.getContributionStats(
      profile.login,
      oneYearAgo.toISOString(),
      new Date().toISOString(),
    );

    // Get search results for PRs and issues
    const [prsResult, issuesResult] = await Promise.all([
      this.octokit.rest.search.issuesAndPullRequests({
        q: `author:${profile.login} type:pr`,
        per_page: 1,
      }),
      this.octokit.rest.search.issuesAndPullRequests({
        q: `author:${profile.login} type:issue`,
        per_page: 1,
      }),
    ]);

    return {
      totalCommits: contributionStats?.totalCommitContributions || 0,
      repositories: repos.length,
      followers: profile.followers,
      following: profile.following,
      stars,
      prs: prsResult.data.total_count,
      issues: issuesResult.data.total_count,
      contributions:
        contributionStats?.contributionCalendar.totalContributions || 0,
      login: profile.login,
      name: profile.name || profile.login,
      avatar_url: profile.avatar_url,
      public_repos: profile.public_repos,
      created_at: profile.created_at,
    };
  }

  /**
   * Get public user languages
   */
  async getPublicUserLanguages(username: string): Promise<GitHubLanguage[]> {
    const repos = await this.getPublicRepositories(username);

    // Get languages for the most recent and starred repositories
    const topRepos = repos
      .sort((a, b) => {
        const aScore = a.stargazers_count + a.forks_count * 2;
        const bScore = b.stargazers_count + b.forks_count * 2;
        return bScore - aScore;
      })
      .slice(0, 20);

    // Get languages for each repository
    const languagesPromises = topRepos.map((repo) =>
      this.octokit.rest.repos
        .listLanguages({
          owner: repo.owner.login,
          repo: repo.name,
        })
        .catch(() => ({ data: {} })),
    );

    const languagesResults = await Promise.all(languagesPromises);

    // Combine languages from all repositories
    const languagesMap = new Map<string, number>();
    languagesResults.forEach((result) => {
      const languages = result.data;
      Object.entries(languages).forEach(([language, bytes]) => {
        const current = languagesMap.get(language) || 0;
        languagesMap.set(language, current + bytes);
      });
    });

    // Calculate total bytes
    const totalBytes = Array.from(languagesMap.values()).reduce(
      (acc, bytes) => acc + bytes,
      0,
    );

    if (totalBytes === 0) {
      return [];
    }

    // Map of language colors
    const languageColors: Record<string, string> = {
      TypeScript: "bg-blue-500",
      JavaScript: "bg-yellow-500",
      Python: "bg-green-500",
      Go: "bg-cyan-500",
      Rust: "bg-orange-500",
      Java: "bg-red-500",
      "C#": "bg-purple-500",
      Ruby: "bg-pink-500",
      PHP: "bg-indigo-500",
      HTML: "bg-gray-500",
      CSS: "bg-teal-500",
      Shell: "bg-gray-700",
      C: "bg-blue-700",
      "C++": "bg-red-700",
      Swift: "bg-orange-400",
      Kotlin: "bg-purple-400",
      Dart: "bg-blue-400",
      Vue: "bg-green-400",
      Svelte: "bg-red-400",
      Dockerfile: "bg-blue-600",
      YAML: "bg-yellow-600",
      JSON: "bg-gray-600",
    };

    // Convert to array and sort by percentage
    const languages = Array.from(languagesMap.entries())
      .map(([name, bytes]) => ({
        name,
        percentage: Math.round((bytes / totalBytes) * 100),
        color: languageColors[name] || "bg-gray-500",
        lines: Math.round(bytes / 30),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 6);

    return languages;
  }

  /**
   * Get user languages (authenticated user)
   */
  async getUserLanguages(): Promise<GitHubLanguage[]> {
    const repos = await this.getUserRepositories();

    // Get languages for the most recent and starred repositories
    const topRepos = repos
      .sort((a, b) => {
        const aScore = a.stargazers_count + a.forks_count * 2;
        const bScore = b.stargazers_count + b.forks_count * 2;
        return bScore - aScore;
      })
      .slice(0, 20);

    // Get languages for each repository
    const languagesPromises = topRepos.map((repo) =>
      this.octokit.rest.repos
        .listLanguages({
          owner: repo.owner.login,
          repo: repo.name,
        })
        .catch(() => ({ data: {} })),
    );

    const languagesResults = await Promise.all(languagesPromises);

    // Combine languages from all repositories
    const languagesMap = new Map<string, number>();
    languagesResults.forEach((result) => {
      const languages = result.data;
      Object.entries(languages).forEach(([language, bytes]) => {
        const current = languagesMap.get(language) || 0;
        languagesMap.set(language, current + bytes);
      });
    });

    // Calculate total bytes
    const totalBytes = Array.from(languagesMap.values()).reduce(
      (acc, bytes) => acc + bytes,
      0,
    );

    if (totalBytes === 0) {
      return [];
    }

    // Map of language colors
    const languageColors: Record<string, string> = {
      TypeScript: "bg-blue-500",
      JavaScript: "bg-yellow-500",
      Python: "bg-green-500",
      Go: "bg-cyan-500",
      Rust: "bg-orange-500",
      Java: "bg-red-500",
      "C#": "bg-purple-500",
      Ruby: "bg-pink-500",
      PHP: "bg-indigo-500",
      HTML: "bg-gray-500",
      CSS: "bg-teal-500",
      Shell: "bg-gray-700",
      C: "bg-blue-700",
      "C++": "bg-red-700",
      Swift: "bg-orange-400",
      Kotlin: "bg-purple-400",
      Dart: "bg-blue-400",
      Vue: "bg-green-400",
      Svelte: "bg-red-400",
      Dockerfile: "bg-blue-600",
      YAML: "bg-yellow-600",
      JSON: "bg-gray-600",
    };

    // Convert to array and sort by percentage
    const languages = Array.from(languagesMap.entries())
      .map(([name, bytes]) => ({
        name,
        percentage: Math.round((bytes / totalBytes) * 100),
        color: languageColors[name] || "bg-gray-500",
        lines: Math.round(bytes / 30),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 6);

    return languages;
  }

  /**
   * Get recent activity with better formatting
   */
  async getRecentActivity(): Promise<GitHubActivity[]> {
    const profile = await this.getUserProfile();

    // Get user events
    const { data: events } =
      await this.octokit.rest.activity.listEventsForAuthenticatedUser({
        username: profile.login,
        per_page: 30,
      });

    // Format events as activities
    const activities = events
      .filter((event) =>
        [
          "PushEvent",
          "PullRequestEvent",
          "IssuesEvent",
          "CreateEvent",
          "ForkEvent",
          "WatchEvent",
        ].includes(event.type),
      )
      .map((event) => {
        let type: "commit" | "pr" | "issue" = "commit";
        let repo = event.repo.name;
        let message = "";
        let url = `https://github.com/${repo}`;

        switch (event.type) {
          case "PushEvent":
            type = "commit";
            // @ts-ignore
            const commits = event.payload.commits || [];
            const commitCount = commits.length;
            if (commitCount === 1) {
              message = commits[0].message || "Pushed 1 commit";
            } else {
              message = `Pushed ${commitCount} commits`;
            }
            break;
          case "PullRequestEvent":
            type = "pr";
            // @ts-ignore
            const action = event.payload.action;
            // @ts-ignore
            const prTitle = event.payload.pull_request?.title;
            message = `${action} pull request: ${prTitle}`;
            // @ts-ignore
            url = event.payload.pull_request?.html_url;
            break;
          case "IssuesEvent":
            type = "issue";
            // @ts-ignore
            const issueAction = event.payload.action;
            // @ts-ignore
            const issueTitle = event.payload.issue?.title;
            message = `${issueAction} issue: ${issueTitle}`;
            // @ts-ignore
            url = event.payload.issue?.html_url;
            break;
          case "CreateEvent":
            type = "commit";
            // @ts-ignore
            const refType = event.payload.ref_type;
            message = `Created ${refType}`;
            break;
          case "ForkEvent":
            type = "commit";
            message = "Forked repository";
            break;
          case "WatchEvent":
            type = "commit";
            message = "Starred repository";
            break;
        }

        // Format time
        const createdAt = new Date(event.created_at);
        const now = new Date();
        const diffMs = now.getTime() - createdAt.getTime();
        const diffMins = Math.round(diffMs / (1000 * 60));
        const diffHours = Math.round(diffMs / (1000 * 60 * 60));
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

        let time = "";
        if (diffMins < 1) {
          time = "Just now";
        } else if (diffMins < 60) {
          time = `${diffMins}m ago`;
        } else if (diffHours < 24) {
          time = `${diffHours}h ago`;
        } else if (diffDays === 1) {
          time = "Yesterday";
        } else if (diffDays < 7) {
          time = `${diffDays}d ago`;
        } else {
          time = createdAt.toLocaleDateString();
        }

        // Truncate long messages
        if (message.length > 60) {
          message = message.substring(0, 57) + "...";
        }

        return {
          type,
          repo,
          message,
          time,
          url,
        };
      })
      .slice(0, 8);

    return activities;
  }
}
