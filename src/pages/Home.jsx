import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [theme, setTheme] = useState('dark');
  const [widgetAvailable, setWidgetAvailable] = useState(true);
  
  // Check if the widget page is accessible and set username from auth if available
  useEffect(() => {
    // Simple check to ensure the widget route is working
    fetch('/widget')
      .then(response => {
        setWidgetAvailable(response.ok);
      })
      .catch(error => {
        console.error('Error checking widget availability:', error);
        setWidgetAvailable(false);
      });
    
    // Set username from authenticated user if available
    if (isAuthenticated && user?.username) {
      setUsername(user.username);
    }
  }, [isAuthenticated, user]);
  
  // Generate the iframe embed code based on current settings
  const getEmbedCode = () => {
    if (!username) return '';
    
    const baseUrl = window.location.origin;
    const widgetUrl = `${baseUrl}/widget?user=${username}&theme=${theme}`;
    
    return `<iframe
  src="${widgetUrl}"
  width="400"
  height="300"
  style="border:none; overflow:hidden;"
  loading="lazy">
</iframe>`;
  };

  // Generate the direct link to the widget
  const getWidgetLink = () => {
    if (!username) return '';
    return `${window.location.origin}/widget?user=${username}&theme=${theme}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="bg-white dark:bg-github-dark shadow-md">
        <div className="container mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                GitHub Stats Widget
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Embed GitHub stats for any user on your website
              </p>
            </div>
            <div>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="block text-sm text-github-accent">Signed in as</span>
                    <span className="font-medium">{user?.username}</span>
                  </div>
                  <button 
                    onClick={logout}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="github-btn"
                >
                  Sign in with GitHub
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <section className="max-w-3xl mx-auto bg-white dark:bg-github-dark rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Generate Your Widget</h2>
          
          {isAuthenticated ? (
            <div className="bg-github-accent/10 border border-github-accent/20 rounded-md p-4 mb-4">
              <div className="flex items-start">
                <div className="text-github-accent text-xl mr-3">✓</div>
                <div>
                  <h3 className="font-medium">Using Authenticated GitHub Access</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    You're signed in, so your widgets will use authenticated GitHub API access with higher rate limits.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-md p-4 mb-4">
              <div className="flex items-start">
                <div className="text-yellow-500 text-xl mr-3">⚠️</div>
                <div>
                  <h3 className="font-medium">Rate Limit Warning</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    You're not signed in. GitHub API has a limit of 60 requests per hour for unauthenticated requests.{' '}
                    <button 
                      onClick={() => navigate('/login')}
                      className="text-github-accent underline"
                    >
                      Sign in with GitHub
                    </button>{' '}
                    to increase this to 5,000 requests per hour.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              GitHub Username
            </label>
            <div className="flex">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., octocat"
                className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-github-accent dark:bg-gray-800 dark:border-gray-700"
              />
              {isAuthenticated && user?.username && (
                <button
                  onClick={() => setUsername(user.username)}
                  className="bg-github-accent text-white px-4 py-2 rounded-r-md hover:bg-opacity-90"
                  title="Use your GitHub username"
                >
                  Use Mine
                </button>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Theme
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-github-accent"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={() => setTheme('dark')}
                />
                <span className="ml-2">Dark</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-github-accent"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={() => setTheme('light')}
                />
                <span className="ml-2">Light</span>
              </label>
            </div>
          </div>
          
          {username && (
            <div className="mb-6">
              <div className="flex space-x-4">
                <a
                  href={`/widget?user=${username}&theme=${theme}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-btn inline-block"
                  onClick={(e) => {
                    // Fallback mechanism in case of issues
                    try {
                      // Continue with normal link behavior
                    } catch (error) {
                      console.error('Error navigating to widget:', error);
                    }
                  }}
                >
                  Preview Widget
                </a>
                <a
                  href={`/simple-widget?user=${username}&theme=${theme}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                  title="Uses fewer API calls to avoid rate limits"
                >
                  Simple Widget (Fallback)
                </a>
              </div>
            </div>
          )}
          
          {username && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Embed Code</h3>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4">
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                  {getEmbedCode()}
                </pre>
              </div>
              <div className="text-xs text-github-secondary mt-2">
                <p className="mb-1">Having issues? Try using the Simple Widget URL:</p>
                <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded break-all">
                  {window.location.origin}/simple-widget?user={username}&theme={theme}
                </code>
                <p className="mt-1">The Simple Widget uses fewer API calls to avoid rate limits.</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getEmbedCode());
                  alert('Embed code copied to clipboard!');
                }}
                className="mt-2 text-sm github-btn"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
          
          {username && (
            <div>
              <h3 className="text-lg font-medium mb-2">Direct Link</h3>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4">
                <a 
                  href={getWidgetLink()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-github-accent break-all"
                >
                  {getWidgetLink()}
                </a>
              </div>
            </div>
          )}
        </section>
        
        <section className="max-w-3xl mx-auto bg-white dark:bg-github-dark rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="mb-4">
            The GitHub Stats Widget provides a simple way to showcase GitHub profiles and statistics on your website 
            or portfolio. It uses the GitHub API to fetch public data for any username you provide.
          </p>
          <h3 className="text-xl font-medium mb-2">Features:</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Profile information (avatar, name, bio)</li>
            <li>Account statistics (repos, followers, following)</li>
            <li>Language usage breakdown</li>
            <li>Top repositories by stars</li>
            <li>Recent activity</li>
          </ul>
          <p className="mb-4">
            Simply copy the embed code above and paste it into your HTML to display the widget on your site.
          </p>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 mt-4 rounded">
            <h4 className="text-lg font-medium mb-2 text-yellow-800 dark:text-yellow-200">GitHub API Rate Limits</h4>
            <p className="mb-2 text-sm">
              The GitHub API has rate limits for requests:
            </p>
            <ul className="list-disc pl-5 mb-2 text-sm">
              <li>For unauthenticated requests: <strong>60 requests per hour</strong></li>
              <li>For authenticated requests: <strong>5,000 requests per hour</strong></li>
            </ul>
            <p className="text-sm">
              If you encounter rate limit errors, you may need to wait until the limit resets or try the Simple Widget option.
            </p>
          </div>
        </section>
      </main>
      
      <footer className="bg-white dark:bg-github-dark shadow-md mt-8">
        <div className="container mx-auto py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            GitHub Stats Widget uses the public GitHub API. This is not an official GitHub product.
          </p>
          <p className="mt-2">
            <a 
              href="https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-github-accent hover:underline"
            >
              Learn more about GitHub API rate limits
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;