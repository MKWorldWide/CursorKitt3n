/**
 * Primary development agent embodying playful creativity.
 * Delegates to NovaSanctum CursorKitten rules if present.
 */
export const CursorKitten = {
  name: () => 'CursorKitten',
  async execute(...args) {
    console.log('[🐾 CursorKitten] Executing with args:', args.join(' '));
    try {
      // Prefer NovaSanctum CursorKitten rules if available
      const mod = await import('../../NovaSanctum/src/codex/rules/cursorKitten.js');
      if (mod?.cursorKittenRules?.transform) {
        return await mod.cursorKittenRules.transform(...args);
      }
    } catch (_err) {
      // Fallback to local behavior
    }
    return '✨ CursorKitten purrs through the code.';
  },
};
