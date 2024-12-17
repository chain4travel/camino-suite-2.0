import React from 'react';
import { render } from '@testing-library/react';

import Box from '.';

describe('Box', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Box>Box</Box>);
    expect(baseElement).toBeTruthy();
  });

  // render with different className
  it('should render with different className', () => {
    const { baseElement } = render(<Box className="bg-red-500">Box</Box>);
    expect(baseElement).toMatchSnapshot();
  });
});
