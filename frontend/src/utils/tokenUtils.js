// tokenUtils.js - Utility functions for handling tokens

/**
 * Safely extracts a payload from a JWT token
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded token payload or null if invalid
 */
export function decodeJWT(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return null;
  }

  try {
    // Split the token
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Base64Url decode
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    
    // Decode and parse
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Extracts GitHub access token from JWT or localStorage
 * @returns {string|null} - GitHub access token or null
 */
export function getGitHubToken() {
  // Try to get token directly from localStorage first
  const directToken = localStorage.getItem('github_access_token');
  if (directToken) return directToken;
  
  // Try to extract from JWT
  const jwtToken = localStorage.getItem('github_stats_token');
  if (!jwtToken) return null;
  
  const payload = decodeJWT(jwtToken);
  return payload?.accessToken || null;
}

/**
 * Creates authorization headers for GitHub API requests
 * @param {string} [token] - Optional token to use instead of stored token
 * @returns {Object} - Headers object with Authorization if token available
 */
export function createGitHubHeaders(token = null) {
  const headers = {
    'Accept': 'application/vnd.github.v3+json'
  };
  
  const accessToken = token || getGitHubToken();
  if (accessToken) {
    headers['Authorization'] = `token ${accessToken}`;
  }
  
  return headers;
}

/**
 * Checks if the user is authenticated with GitHub
 * @returns {boolean} - True if authenticated
 */
export function isGitHubAuthenticated() {
  return !!getGitHubToken();
}

/**
 * Tests GitHub token validity by checking rate limit
 * @param {string} [token] - Optional token to test
 * @returns {Promise<object>} - Rate limit information if token is valid
 */
export async function testGitHubToken(token = null) {
  const accessToken = token || getGitHubToken();
  if (!accessToken) {
    throw new Error('No GitHub token available');
  }
  
  const response = await fetch('https://api.github.com/rate_limit', {
    headers: createGitHubHeaders(accessToken)
  });
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.rate;
}