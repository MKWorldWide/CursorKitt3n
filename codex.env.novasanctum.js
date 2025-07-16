export const NovaSanctumEnv = {
  modules: {
    EidolonCore: './src/modules/EidolonCore',
    GameDin: './src/modules/GameDin',
    Sovereign: './src/modules/Sovereign'
  },
  memory: {
    shortTerm: 'redis://localhost:6379/0',
    longTerm: 'redis://localhost:6379/1'
  }
};
