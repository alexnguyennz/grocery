import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import HeaderDepartments from "@/components/header/header-departments";
import { MantineProvider } from "@mantine/core";

const Providers = ({ children }: { children: JSX.Element }) => {
  return <MantineProvider>{children}</MantineProvider>;
};
describe("Header", () => {
  it("renders browse button", () => {
    render(
      <Providers>
        <HeaderDepartments />
      </Providers>
    );

    const button = screen.getByRole("button", {
      name: /browse/i,
    });

    expect(button).toBeInTheDocument();
  });

  it("renders departments menu", async () => {
    const user = userEvent.setup();

    render(
      <Providers>
        <HeaderDepartments />
      </Providers>
    );

    const button = screen.getByRole("button", {
      name: /browse/i,
    });

    await user.click(button);

    const departmentItem = screen.getByText("Fruit & Veg");

    expect(departmentItem).toBeInTheDocument();
  });
});
