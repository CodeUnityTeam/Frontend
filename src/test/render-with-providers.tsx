import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router";

interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  initialEntry?: string;
  withRouter?: boolean;
}

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

export const renderWithProviders = (
  ui: ReactNode,
  {
    initialEntry = "/",
    withRouter = false,
    ...renderOptions
  }: RenderWithProvidersOptions = {},
) => {
  const queryClient = createTestQueryClient();
  const content = <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>;

  return {
    ...render(
      withRouter ? (
        <MemoryRouter initialEntries={[initialEntry]}>{content}</MemoryRouter>
      ) : (
        content
      ),
      renderOptions,
    ),
    queryClient,
  };
};
