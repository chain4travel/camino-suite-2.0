import { render } from '@testing-library/react';

import AppsLogin from './apps-login';

describe('AppsLogin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AppsLogin />);
    expect(baseElement).toBeTruthy();
  });
});
