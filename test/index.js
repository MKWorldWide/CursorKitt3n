import { initEidolonCore } from '../src/modules/EidolonCore/index.js';
import { initGameDin } from '../src/modules/GameDin/index.js';
import { initSovereign } from '../src/modules/Sovereign/index.js';
import { codexBurst } from '../src/codex/codexBurst.js';

initEidolonCore();
initGameDin();
initSovereign();
await codexBurst('dev', 'test-arg');
console.log('Tests ran');
