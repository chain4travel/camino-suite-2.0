// Mocking ResizeObserver globally for tests
class MockResizeObserver {
  observe(target: Element) {
    // Mock implementation
    console.log('Observing:');
  }
  unobserve(target: Element) {
    // Mock implementation
    console.log('Unobserving:');
  }
  disconnect() {
    // Mock implementation
    console.log('Disconnected');
  }
}

global.ResizeObserver = MockResizeObserver;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
