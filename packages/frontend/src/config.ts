import CONTRACT from '@contract/artifacts/contracts/TicketSystem.sol/TicketSystem.json';
import { getDefaultConfig } from 'connectkit';
import { http } from 'wagmi';
import { hardhat, sepolia } from 'wagmi/chains';

type DefaultConfigProps = Parameters<typeof getDefaultConfig>[0];

/** 合约地址 */
export const CONTRACT_ADDRESS =
  import.meta.env.VITE_BUILD_MODE === 'github'
    ? '0x50f91afc1331D876D66F1e26C35078605d2450e5'
    : '0x5fbdb2315678afecb367f032d93f642f64180aa3';

/** 合约 abi */
export const ABI = CONTRACT.abi;

/** wagmi 配置 */
export const wagmiConfig: DefaultConfigProps = (() => {
  let partialConfig: Partial<DefaultConfigProps> = {
    chains: [hardhat, sepolia],
    transports: {
      [hardhat.id]: http('http://127.0.0.1:8545'),
      [sepolia.id]: http(),
    },
  };

  if (import.meta.env.VITE_BUILD_MODE) {
    partialConfig = {
      chains: [sepolia],
      transports: {
        [sepolia.id]: http(),
      },
    };
  }

  return {
    ...partialConfig,
    walletConnectProjectId: 'a8d524a4a2fceccb4bbf13387a99c60c',
    appName: 'MetaPass',
    appDescription: 'Your App Description',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  };
})();
