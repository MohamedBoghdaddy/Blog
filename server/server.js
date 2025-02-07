import express from "express";
import path from "path";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import multer from "multer";
import session from "express-session";
import { fileURLToPath } from "url";
import connectMongoDBSession from "connect-mongodb-session";
import userRoutes from "./routes/userroutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import blogRoutes from "./routes/BlogRoutes.js";
import analyticRoutes from "./routes/analyticRoutes.js";

dotenv.config();

// Resolving __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: "uploads/" });
const MongoDBStore = connectMongoDBSession(session);
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("MongoDB connection string (MONGO_URL) is missing.");
  process.exit(1);
}

const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: "sessions",
});

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });

store.on("error", (error) =>
  console.error("MongoDB session store error:", error)
);

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-deployed-domain.com",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// JWT Authentication Middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/analytics", analyticRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Serve the client app
app.use(express.static(path.join(__dirname, "../client/build")));

// Render client for any path not handled by API routes
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/build/index.html"))
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
