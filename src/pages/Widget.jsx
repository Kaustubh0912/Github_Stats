import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import directGithubService from '../api/directGithubService';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Components
import StatsCard from '../components/StatsCard';
import SimpleLanguageChart from '../components/SimpleLanguageChart';
import TopReposList from '../components/TopReposList';
import RecentActivity from '../components/RecentActivity';
import Loader from '../components/Loader';
import ErrorDisplay from '../components/ErrorDisplay';
import DirectGitHubStats from '../components/DirectGitHubStats';
import RateLimitInfo from '../components/RateLimitInfo';

// For debugging
const DEBUG = false;

function Widget() {
  const { isAuthenticated, token, githubToken } = useAuth();
  const [searchParams] = useSearchParams();
  const username = searchParams.get('user');
  const theme = searchParams.get('theme') || 'dark';
  const langLimit = parseInt(searchParams.get('langLimit') || '5', 10);
  const repoLimit = parseInt(searchParams.get('repoLimit') || '3', 10);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [languageData, setLanguageData] = useState([]);
  const [reposData, setReposData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);
  const [usingAuthToken, setUsingAuthToken] = useState(false);

  useEffect(() => {
    // Reset state when username changes
    setLoading(true);
    setError(null);
    setUserData(null);
    setLanguageData([]);
    setReposData([]);
    setActivityData([]);
    
    if (DEBUG) console.log('Widget params:', { username, theme, langLimit, repoLimit });
    
    if (!username) {
      setError('No username provided');
      setLoading(false);
      return;
    }
    
    // Configure if authenticated
    if (isAuthenticated && (token || githubToken)) {
      setUsingAuthToken(true);
      if (DEBUG) console.log('Using authenticated GitHub access with token:', !!githubToken);
    }
    
    async function fetchUserData() {
      try {
        // Check rate limits
        const rateLimit = await directGithubService.checkRateLimit(token);
        setRateLimitInfo(rateLimit);
        
        // If we have a GitHub token from auth, use it directly
        const effectiveToken = githubToken || token;
        
        // Check if token is valid by testing rate limit
        if (effectiveToken) {
          try {
            const response = await axios.get('https://api.github.com/rate_limit', {
              headers: {
                Authorization: `token ${effectiveToken}`
              }
            });
            setRateLimitInfo(response.data.rate);
            console.log('Using authenticated GitHub access, rate limit:', response.data.rate.limit);
          } catch (err) {
            console.error('Error validating GitHub token:', err);
          }
        }
        
        // Fetch all data in parallel for better performance
        const [user, languages, repos, activity] = await Promise.all([
          directGithubService.getUser(username, effectiveToken),
          directGithubService.computeLanguageStats(username, 10, effectiveToken),
          directGithubService.getTopRepos(username, repoLimit, effectiveToken),
          directGithubService.getActivity(username, 5, effectiveToken)
        ]);
        
        setUserData(user);
        setLanguageData(languages ? languages.slice(0, langLimit) : []);
        setReposData(repos || []);
        setActivityData(activity ? activity.slice(0, 5) : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError(err.message || 'Failed to load GitHub data');
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [username, langLimit, repoLimit, token, githubToken, isAuthenticated]);

  // Conditionally render loader or content
  if (loading) {
    return <Loader />;
  }
  
  // If we have an error and no user data, use fallback
  if (error && !userData) {
    return <DirectGitHubStats username={username} theme={theme} />;
  }
  
  if (!userData) {
    return <ErrorDisplay message="No GitHub user data available. Please check the username and try again." />;
  }

  return (
    <div className={`widget-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <div className="flex flex-col space-y-4">
        {/* User Profile */}
        <div className="profile-section">
          <StatsCard userData={userData} />
        </div>
        
        {/* Language Stats */}
        {languageData && languageData.length > 0 ? (
          <div className="widget-section">
            <h3 className="stats-title">Top Languages</h3>
            <div className="language-chart">
              <SimpleLanguageChart languages={languageData} theme={theme} />
            </div>
          </div>
        ) : null}
        
        {/* Top Repos */}
        {reposData && reposData.length > 0 ? (
          <div className="widget-section">
            <h3 className="stats-title">Top Repositories</h3>
            <div className="repos-list">
              <TopReposList repos={reposData} />
            </div>
          </div>
        ) : null}
        
        {/* Recent Activity */}
        {activityData && activityData.length > 0 ? (
          <div className="widget-section">
            <h3 className="stats-title">Recent Activity</h3>
            <div className="activity-list">
              <RecentActivity activities={activityData} />
            </div>
          </div>
        ) : error ? (
          <div className="error-message">
            {error}
          </div>
        ) : null}
        
        {/* Footer with attribution */}
        <div className="widget-footer">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="attribution-link"
          >
            Powered by GitHub API
          </a>
          {usingAuthToken && (
            <div className="auth-status">
              <span className="auth-badge">✓</span> Using authenticated GitHub access (5,000 req/hour)
            </div>
          )}
          {rateLimitInfo && <RateLimitInfo rateLimit={rateLimitInfo} theme={theme} />}
        </div>
      </div>
    </div>
  );
}

export default Widget;