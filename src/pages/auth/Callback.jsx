import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Callback() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const error = searchParams.get('error');
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    if (error) {
      setStatus('Authentication failed. Please try again.');
      setTimeout(() => navigate('/login?error=true'), 2000);
      return;
    }

    if (!token) {
      setStatus('No authentication token found. Please try again.');
      setTimeout(() => navigate('/login?error=true'), 2000);
      return;
    }

    // Store the token in localStorage
    localStorage.setItem('github_stats_token', token);
    
    // Get user info from token (JWT)
    try {
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      
      if (payload && payload.username) {
        localStorage.setItem('github_username', payload.username);
      }
    } catch (err) {
      console.error('Error parsing token:', err);
    }

    setStatus('Authentication successful! Redirecting...');
    setTimeout(() => navigate('/'), 1500);
  }, [token, error, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-github-dark rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="mb-4">
          {error ? (
            <div className="text-5xl text-github-red mb-4">❌</div>
          ) : (
            <div className="text-5xl text-github-green mb-4">
              {token ? "✅" : "⏳"}
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold mb-4">
          {error ? "Authentication Failed" : "GitHub Authentication"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{status}</p>
        
        {(error || !token) && (
          <button
            onClick={() => navigate('/login')}
            className="github-btn mt-4"
          >
            Return to Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Callback;