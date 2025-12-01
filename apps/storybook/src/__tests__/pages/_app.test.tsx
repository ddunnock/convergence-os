import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import type { AppProps } from "next/app";
import App from "../../pages/_app";

describe("App", () => {
  it("renders the page component", () => {
    const MockComponent = () => <div>Test Page</div>;
    const appProps = {
      Component: MockComponent,
      pageProps: {},
    } as unknown as AppProps;
    render(<App {...appProps} />);
    expect(screen.getByText("Test Page")).toBeInTheDocument();
  });

  it("passes pageProps to the component", () => {
    const MockComponent = ({ message }: { message: string }) => (
      <div>{message}</div>
    );
    const appProps = {
      Component: MockComponent,
      pageProps: { message: "Hello World" },
    } as unknown as AppProps;
    render(<App {...appProps} />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
