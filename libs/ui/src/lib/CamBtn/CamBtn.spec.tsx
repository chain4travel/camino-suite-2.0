import React from 'react';
import { render } from '@testing-library/react';

import CamBtn from '.';

describe('CamBtn', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CamBtn>button</CamBtn>);
    expect(baseElement).toBeTruthy();
  });

  // render with variant
  it('should match snapshot', () => {
    const { baseElement } = render(<CamBtn variant="primary">button</CamBtn>);
    expect(baseElement).toMatchSnapshot();
  });

  // render with different size
  it('should render with different size', () => {
    const { baseElement } = render(
      <CamBtn variant="primary" size="sm">
        button
      </CamBtn>
    );
    expect(baseElement).toMatchSnapshot();
  });

  // render with different variant
  it('should render with different variant', () => {
    const { baseElement } = render(<CamBtn variant="secondary">button</CamBtn>);
    expect(baseElement).toMatchSnapshot();
  });

  // onClick handler test
  it('should be clickable', () => {
    const handleClick = jest.fn();

    const { getByText } = render(<CamBtn onClick={handleClick}>button</CamBtn>);

    const button = getByText('button');
    button.click();

    expect(handleClick).toHaveBeenCalled();
  });
});
