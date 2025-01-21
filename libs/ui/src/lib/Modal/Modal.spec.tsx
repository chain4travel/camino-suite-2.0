import '@testing-library/jest-dom';

import { act, fireEvent, render, screen } from '@testing-library/react';

import Modal from './Modal';
import React from 'react';

describe('Modal', () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    onCloseMock.mockClear();
  });

  afterEach(() => {
    act(() => {
      // Cleanup any open modals
      document.body.innerHTML = '';
    });
  });

  it('renders when isOpen is true', () => {
    act(() => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          Test content
        </Modal>
      );
    });

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    act(() => {
      render(
        <Modal isOpen={false} onClose={onCloseMock} title="Test Modal">
          Test content
        </Modal>
      );
    });

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('calls onClose when clicking close button', () => {
    act(() => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          Test content
        </Modal>
      );
    });

    const closeButton = screen.getByLabelText('Close modal');
    act(() => {
      fireEvent.click(closeButton);
    });
    expect(onCloseMock).toHaveBeenCalled();
  });
});
