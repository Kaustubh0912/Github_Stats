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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center max-w-md mx-auto p-6 rounded-lg shadow-lg" 
             style={{ backgroundColor: document.body.className.includes('dark') ? '#1e293b' : 'white' }}>
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <h3 className="text-xl font-bold mb-2">Unable to Load GitHub Data</h3>
          <p className="mb-4">{error}</p>
          
          {rateLimitInfo && (
            <div className="mt-4 text-sm p-3 rounded bg-opacity-10 bg-red-500">
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
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto p-4 rounded-lg shadow-lg m-4" 
      style={{ backgroundColor: document.body.className.includes('dark') ? '#1e293b' : 'white' }}>
      <div className="flex items-center space-x-4">
        <img 
          src={userData.avatar_url} 
          alt={`${userData.login}'s avatar`} 
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-xl font-bold">{userData.name || userData.login}</h1>
          <p className="text-sm text-gray-400">@{userData.login}</p>
        </div>
      </div>
      
      {userData.bio && (
        <p className="mt-3 text-sm">{userData.bio}</p>
      )}
      
      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        <div>
          <div className="font-bold">{userData.public_repos}</div>
          <div className="text-xs text-gray-400">Repos</div>
        </div>
        <div>
          <div className="font-bold">{userData.followers}</div>
          <div className="text-xs text-gray-400">Followers</div>
        </div>
        <div>
          <div className="font-bold">{userData.following}</div>
          <div className="text-xs text-gray-400">Following</div>
        </div>
      </div>
      {/* Language Stats */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Top Languages</h3>
        <div className="simple-language-chart">
          {/* Languages will be computed from repo data */}
          {repos.length > 0 && (
            <div>
              {(() => {
                // Simple language computation from repos
                const langMap = {};
                repos.forEach(repo => {
                  if (repo.language) {
                    langMap[repo.language] = (langMap[repo.language] || 0) + 1;
                  }
                });
                
                const totalCount = Object.values(langMap).reduce((a, b) => a + b, 0);
                const languages = Object.entries(langMap)
                  .map(([name, count]) => ({
                    name,
                    percentage: (count / totalCount) * 100
                  }))
                  .sort((a, b) => b.percentage - a.percentage);
                
                // Get color for a language
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
                        <div className="flex justify-between text-sm mb-1">
                          <span>{lang.name}</span>
                          <span>{lang.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full" 
                            style={{ 
                              width: `${lang.percentage}%`,
                              backgroundColor: getLanguageColor(lang.name, idx)
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
      
      {repos.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Top Repositories</h3>
          <ul className="space-y-2">
            {repos.map(repo => (
              <li key={repo.id} className="text-sm p-2 bg-opacity-10 bg-blue-500 rounded">
                <a 
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  {repo.name}
                </a>
                <div className="flex items-center mt-1 text-xs text-gray-400">
                  <span className="mr-3">⭐ {repo.stargazers_count}</span>
                  {repo.language && <span>{repo.language}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <a 
          href={userData.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          View GitHub Profile
        </a>
      </div>
      
      <div className="mt-4 text-xs text-center text-gray-400">
        Powered by GitHub API
        {isAuthenticated && githubToken && (
          <div className="text-xs text-green-500 mt-1">
            Using authenticated access ✓
          </div>
        )}
        {rateLimitInfo && (
          <div className="mt-2">
            <div className="flex justify-center items-center space-x-1">
              <span>API Rate Limit: {rateLimitInfo.remaining}/{rateLimitInfo.limit}</span>
              <span className={rateLimitInfo.remaining < 10 ? "text-red-500" : "text-green-500"}>
                {rateLimitInfo.remaining < 10 ? " ⚠️" : " ✓"}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-1 max-w-xs mx-auto">
              <div 
                className={`${rateLimitInfo.remaining < 10 ? "bg-red-500" : "bg-green-500"} h-1 rounded-full`} 
                style={{ width: `${Math.max(1, (rateLimitInfo.remaining / rateLimitInfo.limit) * 100)}%` }}
              ></div>
            </div>
            <span className="block mt-1 text-xs">
              Resets at: {new Date(rateLimitInfo.reset * 1000).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SimpleWidget;