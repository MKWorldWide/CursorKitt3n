import { initEidolonCore } from '../src/modules/EidolonCore/index.js';
import { initGameDin } from '../src/modules/GameDin/index.js';
import { initSovereign } from '../src/modules/Sovereign/index.js';

initEidolonCore();
initGameDin();
initSovereign();
console.log('Tests ran');
