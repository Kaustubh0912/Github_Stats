import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Service for interacting with the GitHub Stats API
 */
class GitHubService {
  /**
   * Fetch a user's profile information
   * @param {string} username - GitHub username
   * @param {Object} headers - Optional headers with authentication
   * @returns {Promise<Object>} User profile data
   */
  async getUser(username, headers = {}) {
    try {
      try {
        // Try to use our backend first
        const { data } = await axios.get(`${API_BASE_URL}/github/${username}`);
        return data;
      } catch (backendError) {
        console.warn('Backend API error, falling back to direct GitHub API:', backendError);
        // Fallback to direct GitHub API
        const { data } = await axios.get(`${GITHUB_API_URL}/users/${username}`);
        return data;
      }
    } catch (error) {
      console.error('Error fetching GitHub user:', error);
      throw error;
    }
  }

  /**
   * Fetch a user's repositories
   * @param {string} username - GitHub username
   * @param {Object} headers - Optional headers with authentication
   * @returns {Promise<Array>} User repositories
   */
  async getRepos(username, headers = {}) {
    try {
      try {
        // Try to use our backend first
        const { data } = await axios.get(`${API_BASE_URL}/github/${username}/repos`);
        return data;
      } catch (backendError) {
        console.warn('Backend API error, falling back to direct GitHub API:', backendError);
        // Fallback to direct GitHub API
        const { data } = await axios.get(`${GITHUB_API_URL}/users/${username}/repos`, {
          params: { sort: 'updated', per_page: 100 }
        });
        return data;
      }
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }
  }

  /**
   * Fetch a user's recent activity
   * @param {string} username - GitHub username
   * @param {Object} headers - Optional headers with authentication
   * @returns {Promise<Array>} User activity events
   */
  async getActivity(username, headers = {}) {
    try {
      try {
        // Try to use our backend first
        const { data } = await axios.get(`${API_BASE_URL}/github/${username}/activity`);
        return data;
      } catch (backendError) {
        console.warn('Backend API error, falling back to direct GitHub API:', backendError);
        // Fallback to direct GitHub API
        const { data } = await axios.get(`${GITHUB_API_URL}/users/${username}/events/public`, {
          params: { per_page: 30 }
        });
        return data;
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
      throw error;
    }
  }

  /**
   * Fetch a user's language statistics
   * @param {string} username - GitHub username
   * @param {Object} headers - Optional headers with authentication
   * @returns {Promise<Array>} User language statistics
   */
  async getLanguages(username, headers = {}) {
    try {
      try {
        // Try to use our backend first
        const { data } = await axios.get(`${API_BASE_URL}/github/${username}/languages`);
        return data;
      } catch (backendError) {
        console.warn('Backend API error, falling back to direct GitHub API:', backendError);
        // Fallback to direct GitHub API - This is complex to compute client-side
        // Just return a simplified version
        console.warn('Language stats require backend processing, returning empty array');
        return [];
      }
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw error;
    }
  }

  /**
   * Alternative: Direct calls to GitHub API (client-side only)
   * Only use this for frontend-only deployments without a backend
   * @param {string} username - GitHub username
   * @param {Object} headers - Optional headers with authentication
   * @returns {Promise<Object>} User profile data
   */
  async getUserDirect(username, headers = {}) {
    try {
      const { data } = await axios.get(`https://api.github.com/users/${username}`, { headers });
      return data;
    } catch (error) {
      console.error('Error fetching GitHub user directly:', error);
      throw error;
    }
  }
}

export default new GitHubService();