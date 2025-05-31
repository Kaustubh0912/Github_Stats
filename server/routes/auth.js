import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as GitHubStrategy } from "passport-github2";
import axios from "axios";

import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Configure GitHub OAuth strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("GitHub auth successful for user:", profile.username);

        // Create user object with GitHub profile info and token
        const user = {
          id: profile.id,
          username: profile.username,
          displayName: profile.displayName || profile.username,
          avatar: profile._json.avatar_url,
          url: profile.profileUrl,
          accessToken,
        };

        return done(null, user);
      } catch (error) {
        console.error("GitHub auth error:", error);
        return done(error);
      }
    },
  ),
);

// Serialize/deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Initiate GitHub OAuth flow
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email", "read:user", "public_repo"],
  }),
);

// GitHub OAuth callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${FRONTEND_URL}/login?error=true`,
  }),
  (req, res) => {
    try {
      // Create JWT token with user info and GitHub access token
      const token = jwt.sign(
        {
          id: req.user.id,
          username: req.user.username,
          displayName: req.user.displayName,
          avatar: req.user.avatar,
          url: req.user.url,
          accessToken: req.user.accessToken,
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      // Redirect to frontend with token
      res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (error) {
      console.error("Authentication error:", error);
      res.redirect(`${FRONTEND_URL}/login?error=true`);
    }
  },
);

// Get current user info
router.get("/me", (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err);
        return res.status(401).json({ error: "Invalid token" });
      }

      // Create a user object without exposing the access token in the response
      const { accessToken, ...user } = decoded;

      // Check GitHub rate limit using the token
      axios
        .get("https://api.github.com/rate_limit", {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        })
        .then((response) => {
          const rateLimit = response.data.rate;
          return res.json({
            user,
            rateLimit,
          });
        })
        .catch((error) => {
          console.warn("Rate limit check failed:", error.message);
          return res.json({ user });
        });
    });
  } catch (error) {
    console.error("Error getting user info:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

// Health check route
router.get("/status", (req, res) => {
  res.json({
    status: "ok",
    message: "GitHub authentication service is running",
    clientId: process.env.GITHUB_CLIENT_ID ? "configured" : "missing",
    callbackUrl: process.env.GITHUB_CALLBACK_URL,
    tokenFormat:
      "Contains GitHub access_token for authenticated API calls (5,000 req/hour)",
  });
});

// Test GitHub token route
router.get("/test-token", (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }

      // Get access token from decoded JWT
      const { accessToken } = decoded;

      if (!accessToken) {
        return res
          .status(400)
          .json({ error: "No GitHub access token found in JWT" });
      }

      try {
        // Test the GitHub token by fetching rate limit
        const response = await axios.get("https://api.github.com/rate_limit", {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        });

        return res.json({
          status: "ok",
          authenticated: true,
          rateLimit: response.data.rate,
          message: "GitHub token is valid and working correctly",
        });
      } catch (apiError) {
        return res.status(400).json({
          error: "GitHub API error",
          message: apiError.message,
          details: apiError.response?.data,
        });
      }
    });
  } catch (error) {
    console.error("Error testing token:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
