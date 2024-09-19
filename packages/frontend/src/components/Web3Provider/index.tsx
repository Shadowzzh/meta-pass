import type { ComponentProps } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { createConfig, WagmiProvider } from 'wagmi';

import { wagmiConfig } from '@/config';

const config = createConfig(getDefaultConfig(wagmiConfig));

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: ComponentProps<'div'>) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
