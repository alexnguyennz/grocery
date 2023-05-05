import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useState } from "react";
import Footer from "@/components/footer";

import {
  ColorSchemeProvider,
  type ColorScheme,
  MantineProvider,
} from "@mantine/core";

const Providers = ({ children }: { children: JSX.Element }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider>{children}</MantineProvider>
    </ColorSchemeProvider>
  );
};

describe("Footer", () => {
  it("renders footer", () => {
    render(
      <Providers>
        <Footer />
      </Providers>
    );

    const heading = screen.getByRole("heading", {
      name: /grocery/i,
    });

    expect(heading).toBeInTheDocument();
  });

  it("changes colour mode", async () => {
    const user = userEvent.setup();

    render(
      <Providers>
        <Footer />
      </Providers>
    );

    const toggle = screen.getByRole("checkbox", {
      name: /toggle colour mode/i,
    });

    await user.click(toggle);

    expect(toggle).toBeChecked();
  });
});
