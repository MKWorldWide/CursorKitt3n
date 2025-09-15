import { getOctokit } from '@/utils/octokit';

// Mock @octokit/core and @octokit/auth-app to avoid network/real auth
jest.mock('@octokit/core', () => {
  const Octokit = jest.fn().mockImplementation((opts: any) => ({ __opts: opts }));
  return { Octokit };
});

jest.mock('@octokit/auth-app', () => {
  return {
    createAppAuth: (cfg: any) => async ({ type, installationId }: any) => {
      const suffix = type === 'installation' ? `installation-${installationId}` : type;
      return { token: `${suffix}-token-for-${cfg.appId}` };
    },
  };
});

describe('getOctokit', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('throws when GITHUB_TOKEN not set for token auth', async () => {
    delete process.env.GITHUB_TOKEN;
    await expect(getOctokit('token')).rejects.toThrow('GITHUB_TOKEN not set');
  });

  it('returns Octokit for token auth when token is set', async () => {
    process.env.GITHUB_TOKEN = 'abc';
    const o: any = await getOctokit('token');
    expect(o.__opts.auth).toBe('abc');
  });

  it('throws when appId/privateKey not set for app auth', async () => {
    delete process.env.GITHUB_APP_ID;
    delete process.env.GITHUB_PRIVATE_KEY;
    await expect(getOctokit('app')).rejects.toThrow('GITHUB_APP_ID or GITHUB_PRIVATE_KEY not set');
  });

  it('returns Octokit for app auth when env is present', async () => {
    process.env.GITHUB_APP_ID = '123';
    process.env.GITHUB_PRIVATE_KEY = '---PRIVATE KEY---';
    const o: any = await getOctokit('app');
    expect(o.__opts.auth).toContain('app-token-for-123');
  });

  it('returns Octokit for installation auth when env and installationId provided', async () => {
    process.env.GITHUB_APP_ID = '999';
    process.env.GITHUB_PRIVATE_KEY = '---PK---';
    const o: any = await getOctokit('installation', { installationId: 42 });
    expect(o.__opts.auth).toContain('installation-42-token-for-999');
  });

  it('throws for installation auth when installationId missing', async () => {
    process.env.GITHUB_APP_ID = '1';
    process.env.GITHUB_PRIVATE_KEY = 'k';
    // @ts-expect-error intentionally missing installationId
    await expect(getOctokit('installation', {})).rejects.toThrow('installationId required');
  });

  it('throws on invalid authType', async () => {
    await expect(getOctokit('bogus' as any)).rejects.toThrow('Invalid authType');
  });
});
