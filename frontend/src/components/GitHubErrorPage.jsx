import React from 'react';
import { useNavigate } from 'react-router-dom';
import GitHubIcon from './GitHubIcon';

function GitHubErrorPage({ 
  error, 
  username = null, 
  rateLimit = null, 
  onRetry = null,
  showSimpleWidget = true
}) {
  const navigate = useNavigate();
  
  // Check if error is related to rate limits
  const isRateLimitError = 
    error?.message?.includes('rate limit') || 
    error?.toString().includes('rate limit') ||
    rateLimit?.remaining === 0;
  
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center p-6 bg-white dark:bg-github-dark rounded-lg shadow-md text-center">
      <div className="mb-4 text-github-red text-5xl">
        {isRateLimitError ? '⏱️' : '⚠️'}
      </div>
      
      <h2 className="text-xl font-semibold mb-2">
        {isRateLimitError 
          ? 'GitHub API Rate Limit Exceeded' 
          : 'Unable to Load GitHub Data'}
      </h2>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md">
        {isRateLimitError 
          ? `GitHub limits API requests for security reasons. ${rateLimit ? `Rate limit will reset at ${new Date(rateLimit.reset * 1000).toLocaleTimeString()}.` : ''}`
          : error?.message || 'An error occurred while fetching data from GitHub.'}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-github-accent text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">↻</span> Try Again
          </button>
        )}
        
        {showSimpleWidget && username && (
          <button
            onClick={() => navigate(`/simple-widget?user=${username}`)}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">🔄</span> Try Simple Widget
          </button>
        )}
      </div>
      
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
        <p className="mb-2 font-medium flex items-center justify-center">
          <GitHubIcon size={16} className="mr-2" /> GitHub API Limits:
        </p>
        <ul className="space-y-1 text-left">
          <li>• Unauthenticated: 60 requests/hour</li>
          <li>• Authenticated: 5,000 requests/hour</li>
        </ul>
        <button 
          onClick={() => navigate('/login')}
          className="mt-3 text-github-accent hover:underline"
        >
          Sign in with GitHub for higher limits
        </button>
      </div>
    </div>
  );
}

export default GitHubErrorPage;