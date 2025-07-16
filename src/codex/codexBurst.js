import { CursorKitten } from '../agents/CursorKitten.js';
import { Aletheia } from '../agents/Aletheia.js';
import { Serafina } from '../agents/Serafina.js';
import { Phantom } from '../agents/Phantom.js';
import fs from 'fs';
import path from 'path';

function log(message) {
  const logDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  const logPath = path.join(logDir, 'codex.log');
  const entry = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logPath, entry);
}

const AGENTS = {
  dev: CursorKitten,
  enlighten: Aletheia,
  outreach: Serafina,
  stealth: Phantom,
};

export async function codexBurst(...args) {
  console.log('[🐾 codexBurst] invoked with args:', args.join(' '));

  const env = args[0];
  const extraArgs = args.slice(1);

  const agent = AGENTS[env];

  if (!agent) {
    console.log(`🚫 No agent configured for env: ${env}`);
    return;
  }

  const startMsg = `[💥 CodexBurst] Firing ${agent.name()} in ${env}...`;
  console.log(startMsg);
  log(startMsg);

  try {
    const result = await agent.execute(...extraArgs);
    const endMsg = `[✅ ${agent.name()}] ${result}`;
    console.log(endMsg);
    log(endMsg);
  } catch (err) {
    const errMsg = `[❌ ${agent.name()}] ${err}`;
    console.error(errMsg);
    log(errMsg);
  }
}
