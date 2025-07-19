import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { verifyGitHubSignature } from './utils/verifySignature';
import { getOctokit } from './utils/octokit';

// Load environment variables from .env file
// Ensures secrets and config are available at runtime
//
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Use raw body for signature verification
app.use('/api/github/webhook', bodyParser.raw({ type: '*/*' }));
// Use JSON parser for other routes
app.use(bodyParser.json());

/**
 * POST /api/github/webhook
 * Receives GitHub webhook events, verifies signature, and processes events securely.
 *
 * Security: Verifies X-Hub-Signature-256 using shared secret.
 *
 * Example usage: GitHub sends push event to this endpoint.
 */
app.post('/api/github/webhook', (req: Request, res: Response) => {
  const signature = req.header('X-Hub-Signature-256');
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    console.error('GITHUB_WEBHOOK_SECRET not set');
    return res.status(500).send('Server misconfiguration');
  }
  if (!signature) {
    console.warn('[Webhook] Missing signature header');
    return res.status(400).send('Missing signature');
  }
  // Verify signature using the new utility
  const rawBody = req.body instanceof Buffer ? req.body.toString('utf-8') : '';
  if (!verifyGitHubSignature(secret, rawBody, signature)) {
    console.warn('[Webhook] Invalid signature for incoming event');
    return res.status(401).send('Invalid signature');
  }
  // Parse event type
  const event = req.header('X-GitHub-Event');
  if (event === 'push') {
    try {
      const payload = JSON.parse(rawBody);
      const branch = payload.ref?.split('/').pop();
      const latestCommit = payload.head_commit?.message;
      console.log(`[Webhook] Push event on branch: ${branch}`);
      console.log(`[Webhook] Latest commit message: ${latestCommit}`);
    } catch (err) {
      console.error('Failed to parse push event payload:', err);
      return res.status(400).send('Invalid payload');
    }
  }
  // Respond to GitHub
  res.status(200).send('Event received');
});

/**
 * GET /api/github/repos
 * Lists repositories accessible by the authenticated GitHub App or user.
 *
 * Security: Uses installation token or PAT from environment.
 *
 * Example usage: curl http://localhost:3001/api/github/repos
 */
app.get('/api/github/repos', async (req: Request, res: Response) => {
  try {
    const octokit = await getOctokit();
    const response = await octokit.request('GET /user/repos');
    res.json(response.data);
  } catch (err) {
    console.error('Failed to fetch repositories:', err);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`GitHub App integration server running on port ${PORT}`);
}); 