import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home", () => {
  it("renders the product headline", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", {
        name: /AI-powered proposal workflows built for marketing agencies/i,
      }),
    ).toBeInTheDocument();
  });
});
