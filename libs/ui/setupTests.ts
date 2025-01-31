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
