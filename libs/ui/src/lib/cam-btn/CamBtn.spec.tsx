import React from 'react';
import { render } from '@testing-library/react';

import CamBtn from './CamBtn';

describe('CamBtn', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <CamBtn
        variant="primary"
        size="md"
        children="button"
        onClick={() => {}}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
