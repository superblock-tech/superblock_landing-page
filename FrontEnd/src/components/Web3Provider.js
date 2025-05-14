import React from 'react';
import {createConfig, http, WagmiProvider} from 'wagmi';
import {arbitrum, mainnet, polygon, sepolia} from "wagmi/chains";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ConnectKitProvider, getDefaultConfig} from 'connectkit';

const config = createConfig(
    getDefaultConfig({
        appName: 'SuperBlock',
        chains: [mainnet, sepolia, polygon, arbitrum],
        [mainnet.id]: http(),
        walletConnectProjectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID,
        autoConnect: true,
    })
);

const queryClient = new QueryClient();

export const Web3Provider = ({children}) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider debugMode>{children}</ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};
