import DevClient from "./DevClient";

export default async function DevPage() {
  const username = "Kaustubh0912";
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    "Content-Type": "application/json",
  };

  const graphqlQuery = {
    query: `
      {
        user(login: "${username}") {
          name
          bio
          avatarUrl
          followers {
            totalCount
          }
          following {
            totalCount
          }
          repositories(first: 100, privacy: PUBLIC) {
            totalCount
            nodes {
              defaultBranchRef {
                target {
                  ... on Commit {
                    history {
                      totalCount
                    }
                  }
                }
              }
              stargazers {
                totalCount
              }
            }
          }
        }
      }
    `,
  };

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify(graphqlQuery),
  });

  const json = await res.json();
  const user = json.data.user;
  const repos = user.repositories.nodes;

  const totalStars = repos.reduce((sum: number, repo: any) => {
    return sum + (repo.stargazers?.totalCount || 0);
  }, 0);

  const totalCommits = repos.reduce((sum: number, repo: any) => {
    return sum + (repo.defaultBranchRef?.target?.history?.totalCount || 0);
  }, 0);

  const githubData = {
    commits: totalCommits,
    repos: user.repositories.totalCount,
    stars: totalStars,
    followers: user.followers.totalCount,
    following: user.following.totalCount,
    name: user.name || "Kaustubh Agrawal",
    bio: user.bio || "Full-Stack Developer",
    avatar_url: user.avatarUrl,
  };

  return <DevClient githubData={githubData} />;
}