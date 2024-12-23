import { ThemeProvider } from '../src/context/ThemeContext';
import '../ui.css';
import { Preview } from '@storybook/react';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
