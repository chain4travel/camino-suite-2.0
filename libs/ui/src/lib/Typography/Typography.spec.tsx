import React from 'react';
import { render } from '@testing-library/react';

import Typography from '.';

describe('Typography', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Typography>Typography</Typography>);
    expect(baseElement).toBeTruthy();
  });

  // render with variant
  it('should render with variant', () => {
    const { baseElement } = render(
      <Typography variant="h1">Typography</Typography>
    );
    expect(baseElement).toMatchSnapshot();
  });

  // render with different variant
  it('should render with different variant', () => {
    const { baseElement } = render(
      <Typography variant="body1">Typography</Typography>
    );
    expect(baseElement).toMatchSnapshot();
  });

  // render with different color
  it('should render with different color', () => {
    const { baseElement } = render(
      <Typography color="text-red-500">Typography</Typography>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
