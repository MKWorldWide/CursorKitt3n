import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { registerGitHubRoutes } from './routes/github.js';

/**
 * Bootstraps the HTTP server and wires core middleware.
 *
 * Security: applies helmet to harden HTTP headers.
 * Reliability: loads environment variables early to prevent undefined configs.
 */
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Basic security headers
app.use(helmet());

// Register modular routes
registerGitHubRoutes(app);

// Start the server
app.listen(PORT, () => {
  console.log(`GitHub App integration server running on port ${PORT}`);
});
