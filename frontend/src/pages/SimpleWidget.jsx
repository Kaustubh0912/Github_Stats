import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function SimpleWidget() {
  const { isAuthenticated, githubToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user') || 'octocat';
    const theme = urlParams.get('theme') || 'dark';

    document.body.className = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800';

    async function fetchData() {
      // Create axios instance with default headers
      const headers = {
        'Accept': 'application/vnd.github.v3+json'
      };

      // Add authorization header if we have a GitHub token
      if (isAuthenticated && githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
        console.log('Using authenticated GitHub access for SimpleWidget');
      }

      const githubApi = axios.create({
        baseURL: 'https://api.github.com',
        headers
      });

      try {
        // Check rate limit first
        const rateResponse = await githubApi.get('/rate_limit');
        const { rate } = rateResponse.data;
        setRateLimitInfo(rate);

        console.log(`GitHub API Rate Limit: ${rate.remaining}/${rate.limit}`);

        if (rate.remaining < 5) {
          const resetDate = new Date(rate.reset * 1000);
          throw new Error(`GitHub API rate limit exceeded. Resets at ${resetDate.toLocaleTimeString()}`);
        }

        // Fetch user data and repos in parallel to minimize API calls
        const [userResponse, reposResponse] = await Promise.all([
          githubApi.get(`/users/${username}`),
          githubApi.get(`/users/${username}/repos`, {
            params: {
              per_page: 10,
              sort: 'pushed',
              direction: 'desc'
            }
          })
        ]);

        setUserData(userResponse.data);

        // Sort by stars and take top 5
        const sortedRepos = [...reposResponse.data]
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 5);

        setRepos(sortedRepos);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        // Check for rate limit error
        if (err.response?.status === 403 && err.response?.data?.message?.includes('rate limit')) {
          const resetTime = err.response.headers['x-ratelimit-reset']
            ? new Date(parseInt(err.response.headers['x-ratelimit-reset']) * 1000).toLocaleTimeString()
            : 'unknown time';

          setError(`GitHub API rate limit exceeded. Limit will reset at ${resetTime}.`);

          // Still set rate limit info if available in headers
          if (err.response.headers['x-ratelimit-limit'] && err.response.headers['x-ratelimit-remaining']) {
            setRateLimitInfo({
              limit: parseInt(err.response.headers['x-ratelimit-limit']),
              remaining: parseInt(err.response.headers['x-ratelimit-remaining']),
              reset: parseInt(err.response.headers['x-ratelimit-reset'])
            });
          }
        } else {
          setError(err.message || 'Failed to load GitHub data');
        }
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card"
          style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
          <div className="error-icon">⚠️</div>
          <h3 className="error-title">Unable to Load GitHub Data</h3>
          <p className="error-message">{error}</p>

          {rateLimitInfo && (
            <div className="rate-limit-details">
              <p className="font-medium">GitHub API Rate Limit Information:</p>
              <p>Limit: {rateLimitInfo.limit} requests per hour</p>
              <p>Remaining: {rateLimitInfo.remaining} requests</p>
              <p>Resets at: {new Date(rateLimitInfo.reset * 1000).toLocaleTimeString()}</p>

              <div className="mt-3 text-xs">
                <p>GitHub limits API requests to {rateLimitInfo.limit} per hour for unauthenticated requests.</p>
                <p>Please try again after the rate limit resets.</p>
              </div>
            </div>
          )}

          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="widget-container simple-widget"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div className="flex items-center space-x-4">
        <img
          src={userData.avatar_url}
          alt={`${userData.login}'s avatar`}
          className="profile-avatar"
        />
        <div className="profile-info">
          <h1 className="profile-name">{userData.name || userData.login}</h1>
          <p className="profile-username">@{userData.login}</p>
        </div>
      </div>

      {userData.bio && <p className="profile-bio">{userData.bio}</p>}

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{userData.public_repos}</div>
          <div className="stat-label">Repos</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{userData.followers}</div>
          <div className="stat-label">Followers</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{userData.following}</div>
          <div className="stat-label">Following</div>
        </div>
      </div>

      {/* Language Stats */}
      <div className="widget-section">
        <h3 className="stats-title">Top Languages</h3>
        <div className="simple-language-chart">
          {repos.length > 0 && (() => {
            const langMap = {};
            repos.forEach((repo) => {
              if (repo.language) {
                langMap[repo.language] = (langMap[repo.language] || 0) + 1;
              }
            });

            const totalCount = Object.values(langMap).reduce((a, b) => a + b, 0);
            const languages = Object.entries(langMap)
              .map(([name, count]) => ({
                name,
                percentage: (count / totalCount) * 100,
              }))
              .sort((a, b) => b.percentage - a.percentage);

            const getLanguageColor = (language, index) => {
              const colors = {
                JavaScript: '#f1e05a',
                TypeScript: '#3178c6',
                Python: '#3572A5',
                Java: '#b07219',
                'C#': '#178600',
                CSS: '#563d7c',
                HTML: '#e34c26',
                'ASP.NET': '#512bd4',
                ShaderLab: '#222c37',
              };
              const fallbacks = ['#2ea44f', '#58a6ff', '#f85149', '#8957e5', '#ec6547'];
              return colors[language] || fallbacks[index % fallbacks.length];
            };

            return (
              <>
                {languages.map((lang, idx) => (
                  <div key={idx} className="mb-2">
                    <div className="language-bar-item">
                      <div className="language-bar-header">
                        <span className="language-name">{lang.name}</span>
                        <span className="language-percentage">
                          {lang.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="language-bar">
                        <div
                          className="language-segment"
                          style={{
                            width: `${lang.percentage}%`,
                            backgroundColor: getLanguageColor(lang.name, idx),
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            );
          })()}
        </div>
      </div>

      {/* Top Repositories */}
      {repos.length > 0 && (
        <div className="widget-section">
          <h3 className="stats-title">Top Repositories</h3>
          <ul className="repos-list">
            {repos.map((repo) => (
              <li key={repo.id} className="repo-item">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-name"
                >
                  {repo.name}
                </a>
                <div className="repo-stats">
                  <span className="repo-stat">⭐ {repo.stargazers_count}</span>
                  {repo.language && (
                    <span className="repo-language">{repo.language}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Profile Action */}
      <div className="profile-action">
        <a
          href={userData.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="profile-link"
        >
          View GitHub Profile
        </a>
      </div>

      {/* Footer */}
      <div className="widget-footer">
        Powered by GitHub API
        {isAuthenticated && githubToken && (
          <div className="text-xs text-green-500 mt-1">
            Using authenticated access ✓
          </div>
        )}
        {rateLimitInfo && (
          <div className="rate-limit-container">
            <div className="rate-limit-header">
              <span className="rate-limit-title">
                API Rate Limit: {rateLimitInfo.remaining}/{rateLimitInfo.limit}
              </span>
              <span
                className={
                  rateLimitInfo.remaining < 10
                    ? 'rate-limit-warning'
                    : 'rate-limit-success'
                }
              >
                {rateLimitInfo.remaining < 10 ? ' ⚠️' : ' ✓'}
              </span>
            </div>
            <div className="rate-limit-progress-bg">
              <div
                className="rate-limit-progress-bar"
                style={{
                  width: `${Math.max(
                    1,
                    (rateLimitInfo.remaining / rateLimitInfo.limit) * 100
                  )}%`,
                  backgroundColor:
                    rateLimitInfo.remaining < 10
                      ? 'var(--color-danger)'
                      : 'var(--color-success)',
                }}
              ></div>
            </div>
            <div className="rate-limit-reset">
              Resets at:{' '}
              {new Date(rateLimitInfo.reset * 1000).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );

}

export default SimpleWidget;
