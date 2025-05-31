import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './Loader';
import ErrorDisplay from './ErrorDisplay';
import { useAuth } from '../context/AuthContext';
import { getGitHubToken, createGitHubHeaders } from '../utils/tokenUtils';

function DirectGitHubStats({ username, theme = 'dark' }) {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [rateLimit, setRateLimit] = useState(null);

  useEffect(() => {
    if (!username) {
      setError('No username provided');
      setLoading(false);
      return;
    }

    async function fetchGitHubData() {
      try {
        // Get GitHub token if authenticated
        const githubToken = getGitHubToken();
        const headers = createGitHubHeaders(githubToken);
        
        // Create an axios instance with authentication headers
        const api = axios.create({
          baseURL: 'https://api.github.com',
          headers
        });
        
        // Check rate limits first
        try {
          const rateLimitResponse = await api.get('/rate_limit');
          setRateLimit(rateLimitResponse.data.rate);
          console.log('GitHub API Rate Limit:', rateLimitResponse.data.rate);
        } catch (rateLimitError) {
          console.warn('Failed to check rate limit:', rateLimitError);
        }
        
        // Fetch basic user data
        const userResponse = await api.get(`/users/${username}`);
        setUserData(userResponse.data);

        // Fetch repositories
        const reposResponse = await api.get(`/users/${username}/repos?per_page=100&sort=updated`);
        
        // Sort by stars and get top 5
        const sortedRepos = reposResponse.data
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 5);
        
        setRepos(sortedRepos);

        // Process languages
        const languageMap = {};
        
        // Count languages across repos
        for (const repo of reposResponse.data.filter(r => !r.fork && r.language)) {
          if (repo.language) {
            languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
          }
        }
        
        // Convert to array and sort
        const languageArray = Object.entries(languageMap)
          .map(([name, count]) => ({
            name,
            count,
            percentage: (count / reposResponse.data.length) * 100
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        setLanguages(languageArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError(err.response?.data?.message || 'Failed to fetch GitHub data');
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, [username, isAuthenticated]);

  if (loading) return <Loader />;
  if (error) return <ErrorDisplay message={error} />;
  if (!userData) return <ErrorDisplay message="No GitHub user data found" />;

  return (
    <div className={`p-4 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex items-start gap-4">
        {/* User Avatar and Info */}
        <img 
          src={userData.avatar_url} 
          alt={`${username}'s avatar`} 
          className="w-16 h-16 rounded-full"
        />
        
        <div>
          <h2 className="text-xl font-bold">{userData.name || username}</h2>
          {userData.bio && <p className="text-sm mt-1">{userData.bio}</p>}
          
          <div className="flex gap-4 mt-2 text-sm">
            <div>
              <span className="font-semibold">{userData.public_repos}</span> repos
            </div>
            <div>
              <span className="font-semibold">{userData.followers}</span> followers
            </div>
            <div>
              <span className="font-semibold">{userData.following}</span> following
            </div>
          </div>
        </div>
      </div>

      {/* Top Repositories */}
      {repos.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold border-b pb-1 mb-2">Top Repositories</h3>
          <ul className="space-y-2">
            {repos.map(repo => (
              <li key={repo.id} className="text-sm">
                <a 
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {repo.name}
                </a>
                <span className="ml-2">⭐ {repo.stargazers_count}</span>
                {repo.language && <span className="ml-2">{repo.language}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold border-b pb-1 mb-2">Top Languages</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {languages.map((lang, index) => (
              <span 
                key={index}
                className="px-2 py-1 rounded text-xs font-medium"
                style={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                  color: theme === 'dark' ? '#93c5fd' : '#2563eb'
                }}
              >
                {lang.name} ({lang.percentage.toFixed(0)}%)
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <a 
          href={userData.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-400 hover:underline"
        >
          View Full Profile
        </a>
        
        {rateLimit && (
          <div className="mt-2 text-xs text-gray-500">
            <div className="flex justify-center items-center">
              <span>API Rate Limit: {rateLimit.remaining}/{rateLimit.limit}</span>
              {rateLimit.limit > 60 && (
                <span className="ml-2 text-green-500">✓ Using authenticated access</span>
              )}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-1 max-w-xs mx-auto">
              <div 
                className={`${rateLimit.remaining < 10 ? "bg-red-500" : "bg-green-500"} h-1 rounded-full`} 
                style={{ width: `${Math.max(1, (rateLimit.remaining / rateLimit.limit) * 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DirectGitHubStats;