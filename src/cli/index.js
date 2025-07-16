#!/usr/bin/env node
import { codexBurst } from '../codex/codexBurst.js';

const args = process.argv.slice(2);
const command = args[0];
const envArg = args.find(a => a.startsWith('--env='));
const env = envArg ? envArg.split('=')[1] : 'dev';
const extraArgs = args.filter((a, i) => i > 0 && !a.startsWith('--env='));

switch (command) {
  case 'burst':
    codexBurst(env, ...extraArgs);
    break;
  case 'update':
    codexBurst(env, ...extraArgs);
    break;
  default:
    console.log('Usage: ns <burst|update> [--env=dev]');
}
