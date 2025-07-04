export async function GET() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  if (!GITHUB_TOKEN) {
    return Response.json({ error: "Missing GitHub token" }, { status: 500 });
  }

  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    "Content-Type": "application/json",
  };

  const query = `
    {
      user(login: "Kaustubh0912") {
        name
        login
        bio
        avatarUrl
        createdAt
        followers {
          totalCount
        }
        following {
          totalCount
        }
        pullRequests {
          totalCount
        }
        issues {
          totalCount
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
        }
        repositories(first: 100, privacy: PUBLIC) {
          totalCount
          nodes {
            stargazers {
              totalCount
            }
            defaultBranchRef {
              target {
                ... on Commit {
                  history {
                    totalCount
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      return Response.json({ error: "GitHub API request failed" }, { status: 500 });
    }

    const json = await res.json();
    const user = json.data.user;

    const repos = user.repositories.nodes;

    const totalCommits = repos.reduce((sum: number, repo: any) => {
      return sum + (repo.defaultBranchRef?.target?.history?.totalCount || 0);
    }, 0);

    const totalStars = repos.reduce((sum: number, repo: any) => {
      return sum + (repo.stargazers?.totalCount || 0);
    }, 0);

    return Response.json({
      name: user.name,
      login: user.login,
      bio: user.bio,
      avatar_url: user.avatarUrl,
      created_at: user.createdAt,
      totalCommits,
      repositories: user.repositories.totalCount,
      stars: totalStars,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      prs: user.pullRequests.totalCount,
      issues: user.issues.totalCount,
      contributions: user.contributionsCollection.contributionCalendar.totalContributions,
    });
  } catch (err) {
    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}
