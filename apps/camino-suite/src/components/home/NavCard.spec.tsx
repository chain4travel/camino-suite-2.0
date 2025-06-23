import { render, screen, fireEvent } from '@testing-library/react';
import NavCard, { OptionType } from './NavCard';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('NavCard', () => {
  const mockPlatform: OptionType = {
    name: 'Test Platform',
    description: 'Test Description',
    url: '/test',
    private: false,
  };

  it('renders platform information correctly', () => {
    render(<NavCard platform={mockPlatform} />);
    
    expect(screen.getByText('Test Platform')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('common.goTo Test Platform')).toBeInTheDocument();
  });

  it('navigates to correct URL on click', () => {
    const mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(<NavCard platform={mockPlatform} />);
    
    const button = screen.getByText('common.goTo Test Platform');
    fireEvent.click(button);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/test');
  });
}); 