describe.skip('CursorKitten agent', () => {
  it('executes and returns a non-empty string', async () => {
    const { CursorKitten } = await import('./CursorKitten.js');
    const res = await CursorKitten.execute('smoke');
    expect(typeof res).toBe('string');
    expect(res.length).toBeGreaterThan(0);
  });
});
