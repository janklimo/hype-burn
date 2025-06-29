import { createPublicClient, defineChain, http } from 'viem';

const hyperliquid = defineChain({
  id: 999,
  name: 'Hyperliquid',
  nativeCurrency: {
    decimals: 18,
    name: 'Hyperliquid',
    symbol: 'HYPE',
  },
  rpcUrls: {
    default: { http: ['https://rpc.hyperliquid.xyz/evm'] },
  },
  blockExplorers: {
    default: {
      name: 'HyperliquidExplorer',
      url: 'https://app.hyperliquid.xyz/explorer/',
    },
  },
  testnet: false,
});

export const publicClient = createPublicClient({
  chain: hyperliquid,
  transport: http('https://rpc.hyperliquid.xyz/evm'),
});
