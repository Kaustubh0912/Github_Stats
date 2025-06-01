import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext(null);

// Create provider as a named function component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('github_stats_token') || null);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('github_stats_token');
      
      if (storedToken) {
        try {
          // Set token in state
          setToken(storedToken);
          
          // Try to get username from token (JWT)
          try {
            const tokenParts = storedToken.split('.');
            if (tokenParts.length === 3) {
              // Base64 decode and parse the payload
              try {
                // Add padding if needed
                const base64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
                const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
                const payload = JSON.parse(atob(padded));
                
                if (payload && payload.username) {
                  // Create user object with access token
                  const userData = {
                    username: payload.username,
                    id: payload.id,
                    avatar: payload.avatar || null,
                    displayName: payload.displayName || payload.username,
                    accessToken: payload.accessToken || null
                  };
                  setUser(userData);
                  
                  // Store GitHub access token separately
                  if (payload.accessToken) {
                    localStorage.setItem('github_access_token', payload.accessToken);
                    console.log('GitHub access token restored from JWT');
                  }
                }
              } catch (decodeErr) {
                console.error('Error decoding token payload:', decodeErr);
              }
            }
          } catch (err) {
            console.error('Error parsing token:', err);
          }
        } catch (error) {
          console.error('Authentication error:', error);
          // Clear invalid token
          localStorage.removeItem('github_stats_token');
          localStorage.removeItem('github_access_token');
          setToken(null);
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (newToken) => {
    localStorage.setItem('github_stats_token', newToken);
    setToken(newToken);
    
    // Extract user info from token
    try {
      const tokenParts = newToken.split('.');
      if (tokenParts.length === 3) {
        // Base64 decode and parse the payload
        try {
          // Add padding if needed
          const base64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
          const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
          const payload = JSON.parse(atob(padded));
          
          if (payload && payload.username) {
            const userData = {
              username: payload.username,
              id: payload.id,
              avatar: payload.avatar || null,
              displayName: payload.displayName || payload.username,
              // Store GitHub access token for API calls
              accessToken: payload.accessToken || null
            };
            setUser(userData);
            localStorage.setItem('github_username', payload.username);
            
            // Also store GitHub access token separately for easier access
            if (payload.accessToken) {
              localStorage.setItem('github_access_token', payload.accessToken);
              console.log('GitHub access token successfully stored for API calls');
            }
          }
        } catch (decodeErr) {
          console.error('Error decoding token payload:', decodeErr);
        }
      }
    } catch (err) {
      console.error('Error parsing token:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('github_stats_token');
    localStorage.removeItem('github_username');
    localStorage.removeItem('github_access_token'); // Also remove GitHub access token
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
        githubToken: user?.accessToken || localStorage.getItem('github_access_token')
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export the context as default
export default AuthContext;