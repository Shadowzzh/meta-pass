import { ConnectKitButton } from 'connectkit';
import { useAccount, useReadContract } from 'wagmi';

import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { cn } from '@/utils/cn';

const CONTRACT_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_unlockTime',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'when',
        type: 'uint256',
      },
    ],
    name: 'Withdrawal',
    type: 'event',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address payable',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unlockTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

function App() {
  const { address } = useAccount();
  console.log('🚀 ~ App ~ address:', address);

  const result = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'owner',
  });

  console.log('🚀 ~ App ~ ticketCount:', result.data);

  return (
    <div className={cn('h-screen w-screen')}>
      <div className=" absolute top-5 right-5 z-50">
        <ConnectKitButton />
      </div>
      <AuroraBackground>1</AuroraBackground>
    </div>
  );
}

export default App;
