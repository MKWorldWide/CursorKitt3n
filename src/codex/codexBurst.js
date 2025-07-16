import { CursorKitten } from '../../NovaSanctum/src/codex/agents/CursorKitten.js';
import fs from 'fs';
import path from 'path';

function log(message) {
  const logDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  const logPath = path.join(logDir, 'codex.log');
  const entry = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logPath, entry);
}

export async function codexBurst(env = 'dev') {
  const startMsg = `[💥 CodexBurst] Firing ${CursorKitten.name} in ${env}...`;
  console.log(startMsg);
  log(startMsg);

  const result = await CursorKitten.execute();

  const endMsg = `[✅ ${CursorKitten.name}] ${result}`;
  console.log(endMsg);
  log(endMsg);
}
