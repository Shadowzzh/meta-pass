import { ConnectKitButton } from 'connectkit';
import { useAccount, useReadContract } from 'wagmi';

import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { cn } from '@/utils/cn';

const CONTRACT_ADDRESS = '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9';
const CONTRACT_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const;

function App() {
  const { address } = useAccount();
  console.log('🚀 ~ App ~ address:', address);

  const { data: ticketCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getTicketCount',
  });
  console.log('🚀 ~ App ~ ticketCount:', ticketCount);

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
