import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const router = express.Router();
const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Optional: Personal Access Token
const JWT_SECRET = process.env.JWT_SECRET;

// Create a default GitHub API client with fallback token
const githubApi = axios.create({
  baseURL: GITHUB_API_URL,
  headers: GITHUB_TOKEN ? {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  } : {}
});

// Add response interceptor to handle rate limits
githubApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Log detailed error information
      console.error(`GitHub API Error: ${error.response.status} - ${error.response.statusText}`);
      
      if (error.response.status === 403 && error.response.headers['x-ratelimit-remaining'] === '0') {
        console.error('GitHub API rate limit exceeded. Reset at:', 
          new Date(parseInt(error.response.headers['x-ratelimit-reset']) * 1000).toLocaleString());
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to get cache data if available
async function getFromCache(db, username) {
  if (!db) return null;
  
  try {
    const cache = await db.collection('github_cache').findOne({ 
      username,
      cachedAt: { $gt: new Date(Date.now() - 60 * 60 * 1000) } // Cache valid for 1h to avoid rate limits
    });
    
    return cache;
  } catch (error) {
    console.error('Error accessing cache:', error);
    return null;
  }
}

// Helper function to save data to cache
async function saveToCache(db, username, data) {
  if (!db) return;
  
  await db.collection('github_cache').updateOne(
    { username },
    { 
      $set: { 
        ...data,
        cachedAt: new Date() 
      } 
    },
    { upsert: true }
  );
}

// Helper function to track analytics
async function trackAnalytics(db, username, ip) {
  if (!db) return;
  
  await db.collection('analytics').updateOne(
    { username },
    { 
      $inc: { views: 1 },
      $set: { lastViewed: new Date() },
      $push: { viewerIPs: ip }
    },
    { upsert: true }
  );
}

// Helper function to get an authenticated API client
const getGitHubApiClient = (req) => {
  // Check for Authorization header
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // If we have a GitHub access token in the JWT, use it
      if (decoded && decoded.accessToken) {
        return axios.create({
          baseURL: GITHUB_API_URL,
          headers: {
            Authorization: `token ${decoded.accessToken}`
          }
        });
      }
    } catch (err) {
      console.warn('Invalid JWT token, using default GitHub client');
    }
  }
  
  // Fall back to the default client
  return githubApi;
};

// Get user profile data
router.get('/:username', async (req, res) => {
  const { username } = req.params;
  const { db } = req;
  
  // Get API client (authenticated if possible)
  const api = getGitHubApiClient(req);

  try {
    // Check cache first
    const cachedData = await getFromCache(db, username);
    if (cachedData?.profileData) {
      console.log(`Serving cached data for user ${username}`);
      return res.json(cachedData.profileData);
    }

    console.log(`Fetching GitHub data for user ${username}`);
    // Fetch from GitHub API
    const { data } = await api.get(`/users/${username}`);
    
    // Save to cache
    if (db) {
      await saveToCache(db, username, { profileData: data });
      await trackAnalytics(db, username, req.ip);
    }
    
    return res.json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to fetch user data';
    
    console.error(`Error fetching GitHub user ${username}:`, message, 
      error.response?.headers ? `Rate limit: ${error.response.headers['x-ratelimit-remaining']}/${error.response.headers['x-ratelimit-limit']}` : '');
    
    if (status === 403 && !GITHUB_TOKEN) {
      return res.status(403).json({
        error: 'GitHub API Rate Limit Exceeded',
        message: 'API rate limit exceeded. Consider adding a GitHub token to increase the limit.',
        documentation_url: 'https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting'
      });
    }
    
    return res.status(status).json({ 
      error: 'GitHub API Error', 
      message: message
    });
  }
});

// Get user repos
router.get('/:username/repos', async (req, res) => {
  const { username } = req.params;
  const { db } = req;
  const { sort = 'updated', per_page = 100 } = req.query;
  
  // Get API client (authenticated if possible)
  const api = getGitHubApiClient(req);

  try {
    // Check cache first
    const cachedData = await getFromCache(db, username);
    if (cachedData?.reposData) {
      console.log(`Serving cached repo data for user ${username}`);
      return res.json(cachedData.reposData);
    }

    console.log(`Fetching GitHub repos for user ${username}`);
    // Fetch from GitHub API
    const { data } = await api.get(`/users/${username}/repos`, {
      params: { sort, per_page }
    });
    
    // Save to cache
    if (db) {
      await saveToCache(db, username, { reposData: data });
    }
    
    return res.json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to fetch repository data';
    
    console.error(`Error fetching repos for ${username}:`, message,
      error.response?.headers ? `Rate limit: ${error.response.headers['x-ratelimit-remaining']}/${error.response.headers['x-ratelimit-limit']}` : '');
    
    if (status === 403 && !GITHUB_TOKEN) {
      return res.status(403).json({
        error: 'GitHub API Rate Limit Exceeded',
        message: 'API rate limit exceeded. Consider adding a GitHub token to increase the limit.'
      });
    }
    
    return res.status(status).json({ 
      error: 'GitHub API Error', 
      message: message
    });
  }
});

// Get user activity
router.get('/:username/activity', async (req, res) => {
  const { username } = req.params;
  const { db } = req;
  const { per_page = 30 } = req.query;
  
  // Get API client (authenticated if possible)
  const api = getGitHubApiClient(req);

  try {
    // Check cache first
    const cachedData = await getFromCache(db, username);
    if (cachedData?.activityData) {
      console.log(`Serving cached activity data for user ${username}`);
      return res.json(cachedData.activityData);
    }

    console.log(`Fetching GitHub activity for user ${username}`);
    // Fetch from GitHub API
    const { data } = await api.get(`/users/${username}/events/public`, {
      params: { per_page }
    });
    
    // Save to cache
    if (db) {
      await saveToCache(db, username, { activityData: data });
    }
    
    return res.json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to fetch activity data';
    
    console.error(`Error fetching activity for ${username}:`, message,
      error.response?.headers ? `Rate limit: ${error.response.headers['x-ratelimit-remaining']}/${error.response.headers['x-ratelimit-limit']}` : '');
    
    if (status === 403 && !GITHUB_TOKEN) {
      return res.status(403).json({
        error: 'GitHub API Rate Limit Exceeded',
        message: 'API rate limit exceeded. Consider adding a GitHub token to increase the limit.'
      });
    }
    
    return res.status(status).json({ 
      error: 'GitHub API Error', 
      message: message
    });
  }
});

// Get language stats (computed from repos)
router.get('/:username/languages', async (req, res) => {
  const { username } = req.params;
  const { db } = req;
  
  // Get API client (authenticated if possible)
  const api = getGitHubApiClient(req);

  try {
    // Check cache first
    const cachedData = await getFromCache(db, username);
    if (cachedData?.languageStats) {
      console.log(`Serving cached language data for user ${username}`);
      return res.json(cachedData.languageStats);
    }

    console.log(`Fetching language data for user ${username}`);
    // Fetch repos first
    const { data: repos } = await api.get(`/users/${username}/repos`, {
      params: { per_page: 100 }
    });

    // Limit number of API calls if we have many repos to avoid rate limits
    // Filter non-fork repositories and take max 10 repos for language analysis
    const reposToAnalyze = repos.filter(repo => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10);
    
    console.log(`Analyzing languages for ${reposToAnalyze.length} repositories`);
    
    // For each repo, fetch languages
    const languagePromises = reposToAnalyze.map(repo => 
      api.get(repo.languages_url)
    );
    
    const languageResults = await Promise.allSettled(languagePromises);
    
    // Aggregate language bytes
    const languageStats = {};
    languageResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const languages = result.value.data;
        Object.entries(languages).forEach(([lang, bytes]) => {
          languageStats[lang] = (languageStats[lang] || 0) + bytes;
        });
      } else {
        console.warn(`Failed to fetch languages for repo: ${reposToAnalyze[index]?.name}`, result.reason);
      }
    });
    
    // Convert to array sorted by bytes
    const languageArray = Object.entries(languageStats).map(([name, bytes]) => ({
      name,
      bytes,
      percentage: 0 // Will calculate after total is known
    }));
    
    // Calculate total and percentages
    const totalBytes = languageArray.reduce((sum, lang) => sum + lang.bytes, 0);
    languageArray.forEach(lang => {
      lang.percentage = totalBytes > 0 ? (lang.bytes / totalBytes) * 100 : 0;
    });
    
    // Sort by bytes (descending)
    languageArray.sort((a, b) => b.bytes - a.bytes);
    
    // Save to cache
    if (db) {
      await saveToCache(db, username, { languageStats: languageArray });
    }
    
    return res.json(languageArray);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to fetch language data';
    
    console.error(`Error fetching languages for ${username}:`, message,
      error.response?.headers ? `Rate limit: ${error.response.headers['x-ratelimit-remaining']}/${error.response.headers['x-ratelimit-limit']}` : '');
    
    if (status === 403 && !GITHUB_TOKEN) {
      return res.status(403).json({
        error: 'GitHub API Rate Limit Exceeded',
        message: 'API rate limit exceeded. Consider adding a GitHub token to increase the limit.'
      });
    }
    
    // If we can't get languages, return an empty array rather than failing
    if (status === 403) {
      console.warn('Returning empty language array due to rate limits');
      return res.json([]);
    }
    
    return res.status(status).json({ 
      error: 'GitHub API Error', 
      message: message
    });
  }
});

export default router;