import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import App from '../pages/_app';
import Home from '../pages/index';

jest.mock('@fontsource/mulish', () => jest.fn());

describe('Home', () => {
  it('renders a heading', () => {
    render(
      <App>
        <Home />
      </App>
    );

    const heading = screen.getByRole('heading', {
      name: /weekly specials/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
