import type { ComponentProps } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { hardhat, mainnet, sepolia } from 'wagmi/chains';

const config = createConfig(
  getDefaultConfig({
    chains: [hardhat],
    transports: { [mainnet.id]: http(), [sepolia.id]: http(), [hardhat.id]: http() },
    walletConnectProjectId: 'a8d524a4a2fceccb4bbf13387a99c60c',
    appName: 'MetaPass',
    appDescription: 'Your App Description',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: ComponentProps<'div'>) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          options={{
            language: 'zh-CN',
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
