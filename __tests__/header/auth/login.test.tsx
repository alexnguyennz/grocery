import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

import Login from "@/components/header/auth/login";

const Providers = ({ children }: { children: JSX.Element }) => {
  return (
    <MantineProvider>
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
};

describe("Login", () => {
  it("renders login", () => {
    render(
      <Providers>
        <Login />
      </Providers>
    );
  });

  it("renders login modal", async () => {
    const user = userEvent.setup();

    render(
      <Providers>
        <Login />
      </Providers>
    );

    const button = screen.getByRole("button", { name: /Sign in/i });

    await user.click(button);

    const modal = screen.getByRole("dialog");

    expect(modal).toBeInTheDocument();
  });
});
