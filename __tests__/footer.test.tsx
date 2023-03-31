import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useState as useStateMock } from 'react';
import Footer from '../components/footer';

import { ColorSchemeProvider, type ColorScheme } from '@mantine/core';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));
const setState = jest.fn();

describe('Footer', () => {
  // const [colorScheme, setColorScheme] = useStateMock<ColorScheme>('light');

  it('renders a heading', () => {
    render(
      <ColorSchemeProvider colorScheme={'light'} toggleColorScheme={null}>
        <Footer />
      </ColorSchemeProvider>
    );

    const heading = screen.getByRole('heading', {
      name: /weekly specials/i,
    });

    beforeEach(() => {
      useStateMock.mockImplementation((init: any) => [init, setState]);
    });

    expect(heading).toBeInTheDocument();
  });
});
