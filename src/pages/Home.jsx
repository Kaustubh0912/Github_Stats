import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark');
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
    <div className="page-wrapper">
      <header className="page-header">
        <div className="header-container">
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title">
                GitHub Stats Widget
              </h1>
              <p className="page-subtitle">
                Embed GitHub stats for any user on your website
              </p>
            </div>
            <div className="header-actions">
              {isAuthenticated ? (
                <div className="user-auth-display">
                  <div className="user-info">
                    <span className="user-label">Signed in as</span>
                    <span className="user-name">{user?.username}</span>
                  </div>
                  <button 
                    onClick={logout}
                    className="btn btn-secondary btn-sm"
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
      
      <main className="page-container">
        <section className="widget-generator card">
          <h2 className="section-title">Generate Your Widget</h2>
          
          {isAuthenticated ? (
            <div className="auth-status-banner auth-success">
              <div className="banner-content">
                <div className="banner-icon">✓</div>
                <div className="banner-text">
                  <h3 className="banner-title">Using Authenticated GitHub Access</h3>
                  <p className="banner-description">
                    You're signed in, so your widgets will use authenticated GitHub API access with higher rate limits.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="auth-status-banner auth-warning">
              <div className="banner-content">
                <div className="banner-icon">⚠️</div>
                <div className="banner-text">
                  <h3 className="banner-title">Rate Limit Warning</h3>
                  <p className="banner-description">
                    You're not signed in. GitHub API has a limit of 60 requests per hour for unauthenticated requests.{' '}
                    <button 
                      onClick={() => navigate('/login')}
                      className="text-link"
                    >
                      Sign in with GitHub
                    </button>{' '}
                    to increase this to 5,000 requests per hour.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              GitHub Username
            </label>
            <div className="input-group">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., octocat"
                className="form-input"
              />
              {isAuthenticated && user?.username && (
                <button
                  onClick={() => setUsername(user.username)}
                  className="input-addon-btn"
                  title="Use your GitHub username"
                >
                  Use Mine
                </button>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Theme
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  className="radio-input"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={() => {
                    setTheme('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('github-stats-theme', 'dark');
                  }}
                />
                <span className="radio-text">Dark</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  className="radio-input"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={() => {
                    setTheme('light');
                    document.documentElement.setAttribute('data-theme', 'light');
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('github-stats-theme', 'light');
                  }}
                />
                <span className="radio-text">Light</span>
              </label>
            </div>
          </div>
          
          {username && (
            <div className="action-buttons">
              <div className="button-group">
                <a
                  href={`/widget?user=${username}&theme=${theme}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
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
                  className="btn btn-secondary"
                  title="Uses fewer API calls to avoid rate limits"
                >
                  Simple Widget (Fallback)
                </a>
              </div>
            </div>
          )}
          
          {username && (
            <div className="embed-code-section">
              <h3 className="section-subtitle">Embed Code</h3>
              <div className="code-container">
                <pre className="code-display">
                  {getEmbedCode()}
                </pre>
              </div>
              <div className="info-message">
                <p className="info-text">Having issues? Try using the Simple Widget URL:</p>
                <code className="simple-url">
                  {window.location.origin}/simple-widget?user={username}&theme={theme}
                </code>
                <p className="info-text-secondary">The Simple Widget uses fewer API calls to avoid rate limits.</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getEmbedCode());
                  alert('Embed code copied to clipboard!');
                }}
                className="btn btn-sm btn-primary copy-btn"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
          
          {username && (
            <div className="direct-link-section">
              <h3 className="section-subtitle">Direct Link</h3>
              <div className="link-container">
                <a 
                  href={getWidgetLink()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="direct-link"
                >
                  {getWidgetLink()}
                </a>
              </div>
            </div>
          )}
        </section>
        
        <section className="info-section card">
          <h2 className="section-title">How It Works</h2>
          <p className="info-text">
            The GitHub Stats Widget provides a simple way to showcase GitHub profiles and statistics on your website 
            or portfolio. It uses the GitHub API to fetch public data for any username you provide.
          </p>
          <h3 className="feature-title">Features:</h3>
          <ul className="feature-list">
            <li>Profile information (avatar, name, bio)</li>
            <li>Account statistics (repos, followers, following)</li>
            <li>Language usage breakdown</li>
            <li>Top repositories by stars</li>
            <li>Recent activity</li>
          </ul>
          <p className="info-text">
            Simply copy the embed code above and paste it into your HTML to display the widget on your site.
          </p>
          
          <div className="rate-limit-info-banner">
            <h4 className="rate-limit-title">GitHub API Rate Limits</h4>
            <p className="rate-limit-text">
              The GitHub API has rate limits for requests:
            </p>
            <ul className="rate-limit-list">
              <li>For unauthenticated requests: <strong>60 requests per hour</strong></li>
              <li>For authenticated requests: <strong>5,000 requests per hour</strong></li>
            </ul>
            <p className="rate-limit-text">
              If you encounter rate limit errors, you may need to wait until the limit resets or try the Simple Widget option.
            </p>
          </div>
        </section>
      </main>
      
      <footer className="page-footer">
        <div className="footer-content">
          <p className="footer-text">
            GitHub Stats Widget uses the public GitHub API. This is not an official GitHub product.
          </p>
          <p className="footer-links">
            <a 
              href="https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
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