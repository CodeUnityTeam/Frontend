import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/shared/ui/sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster closeButton />
    </QueryClientProvider>
  );
}
