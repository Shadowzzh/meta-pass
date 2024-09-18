import CONTRACT from '@contract/artifacts/contracts/TicketSystem.sol/TicketSystem.json';

/** 合约地址 */
export const CONTRACT_ADDRESS =
  import.meta.env.VITE_BUILD_MODE === 'github'
    ? '0x50f91afc1331D876D66F1e26C35078605d2450e5'
    : '0x5fbdb2315678afecb367f032d93f642f64180aa3';
/** 合约 abi */
export const ABI = CONTRACT.abi;
