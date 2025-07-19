import crypto from 'crypto';

/**
 * Verifies the X-Hub-Signature-256 header for GitHub webhook requests.
 *
 * @param secret - The webhook secret shared with GitHub
 * @param payload - The raw request body as a string
 * @param signature - The value of the X-Hub-Signature-256 header
 * @returns true if the signature is valid, false otherwise
 *
 * Security: Uses constant-time comparison to prevent timing attacks.
 *
 * Usage Example:
 *   verifyGitHubSignature(process.env.GITHUB_WEBHOOK_SECRET, rawBody, req.header('X-Hub-Signature-256'))
 */
export function verifyGitHubSignature(secret: string, payload: string, signature: string): boolean {
  if (!signature || !signature.startsWith('sha256=')) return false;
  const sig = Buffer.from(signature.replace('sha256=', ''), 'hex');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload, 'utf-8');
  const digest = Buffer.from(hmac.digest('hex'), 'hex');
  // Constant-time comparison
  return sig.length === digest.length && crypto.timingSafeEqual(sig, digest);
} 