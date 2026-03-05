// Global stub for @/auth — prevents next-auth (ESM) from being loaded in Jest.
// Tests that need specific auth behaviour can override with jest.mock('@/auth', ...).
export const auth = jest.fn().mockResolvedValue(null);
export const signIn = jest.fn();
export const signOut = jest.fn();
export const handlers = { GET: jest.fn(), POST: jest.fn() };
