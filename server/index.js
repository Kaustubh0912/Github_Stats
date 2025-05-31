import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import githubRoutes from "./routes/github.js";
import authRoutes from "./routes/auth.js";
import { MongoClient } from "mongodb";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Session setup
app.use(
  session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// MongoDB Connection (if configured)
let db;
if (MONGODB_URI) {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    db = client.db("github-stats");
    console.log("Connected to MongoDB");

    // Make db available in the request object
    app.use((req, res, next) => {
      req.db = db;
      next();
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

// Routes
app.use("/api/github", githubRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "GitHub Stats API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
