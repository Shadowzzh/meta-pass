import type { HardhatUserConfig } from 'hardhat/config';

import '@nomicfoundation/hardhat-toolbox';

import dotenv from 'dotenv';

dotenv.config();

/** sepolia 账户私钥 */
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: '0.8.20',

  networks: {
    sepolia: {
      url: 'https://rpc.sepolia.org',
      accounts: [SEPOLIA_PRIVATE_KEY as string],
      timeout: 60000 * 3, // 增加到 3 分钟
      gasPrice: 'auto', // 20 Gwei
    },
  },
};

export default config;
