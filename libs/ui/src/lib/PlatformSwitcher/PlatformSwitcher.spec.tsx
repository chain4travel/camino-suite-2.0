import React from 'react';
import { render } from '@testing-library/react';

import PlatformSwitcher from '.';

describe('PlatformSwitcher', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <PlatformSwitcher
        options={[]}
        activeApp=""
        onSelect={() => {
          console.log('onSelect');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
