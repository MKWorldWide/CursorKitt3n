// Global test setup
import { TextEncoder, TextDecoder } from 'util';

// Add TextEncoder and TextDecoder to global scope for testing
// This is necessary for some Node.js modules that expect these globals
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Global test timeout (10 seconds)
jest.setTimeout(10000);

// Mock console methods to keep test output clean
const consoleMethods = ['log', 'warn', 'error', 'info', 'debug'];

beforeEach(() => {
  consoleMethods.forEach((method) => {
    jest.spyOn(console, method).mockImplementation(() => {});
  });
});

afterEach(() => {
  // Clear all mocks after each test
  jest.clearAllMocks();
  
  // Restore original console methods
  consoleMethods.forEach((method) => {
    if (console[method].mockRestore) {
      console[method].mockRestore();
    }
  });
});

// Global test teardown
afterAll(async () => {
  // Clean up any resources or connections here
});
