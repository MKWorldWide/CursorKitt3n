import express, { Request, Response } from 'express';
import { verifyGitHubSignature } from '../utils/verifySignature.js';
import { getOctokit } from '../utils/octokit.js';

/**
 * Registers GitHub-related webhook and API routes.
 *
 * Security: ensures request signatures are validated before processing.
 * Performance: modular router avoids unnecessary middleware on unrelated endpoints.
 */
export function registerGitHubRoutes(app: express.Application): void {
  const router = express.Router();

  // Raw body required for signature validation
  router.use('/webhook', express.raw({ type: '*/*' }));
  // JSON parser for other GitHub routes
  router.use(express.json());

  router.post('/webhook', (req: Request, res: Response) => {
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
    const rawBody = req.body instanceof Buffer ? req.body.toString('utf-8') : '';
    if (!verifyGitHubSignature(secret, rawBody, signature)) {
      console.warn('[Webhook] Invalid signature for incoming event');
      return res.status(401).send('Invalid signature');
    }
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
    res.status(200).send('Event received');
  });

  router.get('/repos', async (_req: Request, res: Response) => {
    try {
      const octokit = await getOctokit('token');
      const response = await octokit.request('GET /user/repos');
      res.json(response.data);
    } catch (err) {
      console.error('Failed to fetch repositories:', err);
      res.status(500).json({ error: 'Failed to fetch repositories' });
    }
  });

  app.use('/api/github', router);
}
