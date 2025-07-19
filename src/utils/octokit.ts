import { Octokit } from '@octokit/core';
import { createAppAuth } from '@octokit/auth-app';

/**
 * Initializes an authenticated Octokit instance for various auth types.
 *
 * @param authType - 'token' | 'app' | 'installation'
 * @param options - Optional parameters (e.g., installationId)
 * @returns Promise<Octokit> - Authenticated Octokit instance
 *
 * Usage:
 *   getOctokit('token')
 *   getOctokit('app')
 *   getOctokit('installation', { installationId })
 */
export async function getOctokit(
  authType: 'token' | 'app' | 'installation',
  options?: { installationId?: number }
): Promise<Octokit> {
  if (authType === 'token') {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error('GITHUB_TOKEN not set');
    return new Octokit({ auth: token });
  }
  if (authType === 'app') {
    const appId = process.env.GITHUB_APP_ID;
    const privateKey = process.env.GITHUB_PRIVATE_KEY;
    if (!appId || !privateKey) throw new Error('GITHUB_APP_ID or GITHUB_PRIVATE_KEY not set');
    const auth = createAppAuth({
      appId,
      privateKey,
    });
    const { token } = await auth({ type: 'app' });
    return new Octokit({ auth: token });
  }
  if (authType === 'installation') {
    const appId = process.env.GITHUB_APP_ID;
    const privateKey = process.env.GITHUB_PRIVATE_KEY;
    if (!appId || !privateKey) throw new Error('GITHUB_APP_ID or GITHUB_PRIVATE_KEY not set');
    if (!options?.installationId) throw new Error('installationId required for installation auth');
    const auth = createAppAuth({
      appId,
      privateKey,
      installationId: options.installationId,
    });
    const { token } = await auth({ type: 'installation', installationId: options.installationId });
    return new Octokit({ auth: token });
  }
  throw new Error('Invalid authType');
} 