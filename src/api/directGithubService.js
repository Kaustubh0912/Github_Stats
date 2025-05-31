import axios from 'axios';

// GitHub API base URL
const GITHUB_API_URL = 'https://api.github.com';

// Function to create GitHub API client with optional token
const createGitHubClient = (token = null) => {
  const headers = {
    'Accept': 'application/vnd.github.v3+json'
  };
  
  if (token) {
    // If token is a JWT, it might contain the GitHub access token
    if (token.split('.').length === 3) {
      try {
        // Try to extract GitHub access token from JWT
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        if (payload.accessToken) {
          // Use the GitHub access token from the JWT
          headers['Authorization'] = `token ${payload.accessToken}`;
        } else {
          // Use the token directly (might be a GitHub token already)
          headers['Authorization'] = `token ${token}`;
        }
      } catch (e) {
        console.warn('Error extracting token from JWT, using token directly:', e);
        headers['Authorization'] = `token ${token}`;
      }
    } else {
      // Use token directly
      headers['Authorization'] = `token ${token}`;
    }
  }
  
  return axios.create({
    baseURL: GITHUB_API_URL,
    headers
  });
};

/**
 * Direct GitHub API service that doesn't rely on our backend
 */
class DirectGithubService {
  constructor() {
    this.rateLimit = null;
  }

  /**
   * Check current rate limit status
   * @param {string} token - Optional auth token
   * @returns {Promise<Object>} Rate limit information
   */
  async checkRateLimit(token = null) {
    try {
      const client = createGitHubClient(token);
      const { data } = await client.get('/rate_limit');
      this.rateLimit = data.rate;
      
      // Log rate limit info for debugging
      console.log('GitHub API Rate Limit:', {
        limit: this.rateLimit.limit,
        remaining: this.rateLimit.remaining,
        reset: new Date(this.rateLimit.reset * 1000).toLocaleTimeString(),
        authenticated: this.rateLimit.limit > 60
      });
      
      return this.rateLimit;
    } catch (error) {
      console.error('Error checking rate limit:', error);
      throw error;
    }
  }

  /**
   * Fetch a user's profile information directly from GitHub
   * @param {string} username - GitHub username
   * @param {string} token - Optional auth token
   * @returns {Promise<Object>} User profile data
   */
  async getUser(username, token = null) {
    try {
      const client = createGitHubClient(token);
      const { data } = await client.get(`/users/${username}`);
      return data;
    } catch (error) {
      console.error('Error fetching GitHub user directly:', error);
      throw error;
    }
  }

  /**
   * Fetch a user's repositories directly from GitHub
   * @param {string} username - GitHub username
   * @param {Object} options - Options for the request
   * @param {number} options.per_page - Number of results per page
   * @param {string} options.sort - Sort field (stars, updated, etc.)
   * @param {string} token - Optional auth token
   * @returns {Promise<Array>} User repositories
   */
  async getRepos(username, options = { per_page: 100, sort: 'updated' }, token = null) {
    try {
      const client = createGitHubClient(token);
      const { data } = await client.get(`/users/${username}/repos`, {
        params: options
      });
      return data;
    } catch (error) {
      console.error('Error fetching repositories directly:', error);
      throw error;
    }
  }

  /**
   * Fetch a user's top repositories by stars
   * @param {string} username - GitHub username
   * @param {number} limit - Maximum number of repos to return
   * @param {string} token - Optional auth token
   * @returns {Promise<Array>} Top repositories by stars
   */
  async getTopRepos(username, limit = 5, token = null) {
    try {
      const repos = await this.getRepos(username, { per_page: 100, sort: 'pushed' }, token);
      
      // Sort by stars (descending) and take top N
      return repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching top repositories:', error);
      throw error;
    }
  }

  /**
   * Fetch a user's recent activity directly from GitHub
   * @param {string} username - GitHub username
   * @param {number} limit - Maximum number of events to return
   * @param {string} token - Optional auth token
   * @returns {Promise<Array>} User activity events
   */
  async getActivity(username, limit = 10, token = null) {
    try {
      const client = createGitHubClient(token);
      const { data } = await client.get(`/users/${username}/events/public`, {
        params: { per_page: limit }
      });
      return data;
    } catch (error) {
      console.error('Error fetching activity directly:', error);
      throw error;
    }
  }

  /**
   * Compute language statistics from repositories
   * @param {string} username - GitHub username
   * @param {number} maxRepos - Maximum number of repos to analyze
   * @param {string} token - Optional auth token
   * @returns {Promise<Array>} Language statistics
   */
  async computeLanguageStats(username, maxRepos = 10, token = null) {
    try {
      // First verify we have proper authentication
      await this.checkRateLimit(token);
      
      // Get repositories
      const repos = await this.getRepos(username, { per_page: 100 }, token);
      
      // Filter out forks and take the most recent repos to analyze
      const reposToAnalyze = repos
        .filter(repo => !repo.fork)
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
        .slice(0, maxRepos);
      
      console.log(`Analyzing languages for ${reposToAnalyze.length} repositories`);
      
      // For each repo, fetch languages
      const languageStats = {};
      let totalBytes = 0;
      
      const client = createGitHubClient(token);
      
      for (const repo of reposToAnalyze) {
        try {
          // Skip empty repos
          if (repo.size === 0) continue;
          
          const { data: languages } = await client.get(repo.languages_url);
          
          // Aggregate language bytes
          for (const [lang, bytes] of Object.entries(languages)) {
            languageStats[lang] = (languageStats[lang] || 0) + bytes;
            totalBytes += bytes;
          }
        } catch (langError) {
          console.warn(`Couldn't fetch languages for ${repo.name}:`, langError.message);
          // Continue with other repos
        }
      }
      
      // Convert to array and calculate percentages
      const languageArray = Object.entries(languageStats).map(([name, bytes]) => ({
        name,
        bytes,
        percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0
      }));
      
      // Sort by bytes (descending)
      return languageArray.sort((a, b) => b.bytes - a.bytes);
    } catch (error) {
      console.error('Error computing language statistics:', error);
      // Return empty array instead of failing
      return [];
    }
  }
}

export default new DirectGithubService();