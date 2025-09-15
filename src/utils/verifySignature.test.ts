import crypto from 'crypto';
import { verifyGitHubSignature } from '@/utils/verifySignature';

describe('verifyGitHubSignature', () => {
  const secret = 'supersecret';
  const payload = JSON.stringify({ hello: 'world' });

  function makeSignature(sec: string, body: string): string {
    const h = crypto.createHmac('sha256', sec);
    h.update(body, 'utf-8');
    return 'sha256=' + h.digest('hex');
  }

  it('validates a correct signature', () => {
    const signature = makeSignature(secret, payload);
    expect(verifyGitHubSignature(secret, payload, signature)).toBe(true);
  });

  it('rejects an incorrect signature', () => {
    const badSig = makeSignature('wrong', payload);
    expect(verifyGitHubSignature(secret, payload, badSig)).toBe(false);
  });

  it('rejects a signature without sha256= prefix', () => {
    const raw = makeSignature(secret, payload).replace('sha256=', '');
    expect(verifyGitHubSignature(secret, payload, raw)).toBe(false);
  });
});

