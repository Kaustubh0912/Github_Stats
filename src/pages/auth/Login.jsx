import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GitHubIcon from '../../components/GitHubIcon';

function Login() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('github_stats_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginClick = () => {
    // Redirect to server's GitHub OAuth route
    window.location.href = 'http://localhost:3000/api/auth/github';
  };

  const handleLogoutClick = () => {
    // Clear local storage
    localStorage.removeItem('github_stats_token');
    localStorage.removeItem('github_username');
    setIsAuthenticated(false);
  };

  const handleContinueToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-github-dark rounded-lg shadow-md p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">GitHub Stats Widget</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isAuthenticated 
              ? "You're logged in with GitHub" 
              : "Sign in with your GitHub account to create personalized widgets"}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>Authentication failed. Please try again.</p>
          </div>
        )}

        <div className="flex flex-col items-center">
          {isAuthenticated ? (
            <>
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-md w-full">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl mr-2">✅</span>
                  <span className="font-bold text-lg">Successfully Authenticated</span>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="bg-white/50 dark:bg-gray-800/50 p-2 rounded flex items-center">
                    <span className="font-mono bg-green-200 dark:bg-green-800 px-2 py-1 rounded mr-2">5,000</span>
                    <span>API requests per hour (increased from 60)</span>
                  </div>
                  <p className="text-sm">
                    Your widgets will now use your GitHub authentication token for all API requests,
                    giving you higher rate limits and access to your private data.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button
                  onClick={handleContinueToHome}
                  className="github-btn flex-1"
                >
                  Continue to Home
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md flex-1"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={handleLoginClick}
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-md flex items-center relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-0 bg-github-accent transition-all duration-300 ease-out group-hover:w-full"></span>
              <span className="relative flex items-center">
                <GitHubIcon color="white" className="mr-2" />
                Sign in with GitHub
              </span>
            </button>
          )}
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-2 font-medium">Why sign in with GitHub?</p>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
            <div className="flex items-start mb-2">
              <div className="mr-2 text-green-500 font-bold">⚡</div>
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">Higher API Rate Limits</p>
                <p>5,000 requests/hour vs only 60 when not signed in</p>
              </div>
            </div>
            <div className="flex items-start mb-2">
              <div className="mr-2 text-blue-500 font-bold">🔑</div>
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">Authenticated Access</p>
                <p>Access your private repositories and user data</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mr-2 text-purple-500 font-bold">🛡️</div>
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">Avoid Rate Limit Errors</p>
                <p>Stop seeing "API limit exceeded" errors in widgets</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;