import React from 'react';
import { WagmiProvider, createConfig,http } from 'wagmi';
import {mainnet, sepolia} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

const config = createConfig(
  getDefaultConfig({
    appName: 'Superblock',
    chains: [mainnet, sepolia],
    [mainnet.id]: http(
      `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
    ),
    walletConnectProjectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID,
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider debugMode>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
