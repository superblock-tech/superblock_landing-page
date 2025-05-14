import React from 'react';
import {createConfig, http, WagmiProvider} from 'wagmi'
import { mainnet, sepolia, polygon, arbitrum } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from '@wagmi/connectors'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ConnectKitProvider} from "connectkit";

export const config = createConfig({
    chains: [mainnet, sepolia, polygon, arbitrum],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [polygon.id]: http(),
        [arbitrum.id]: http(),
    },
    connectors: [
        injected({ shimDisconnect: true }),
        metaMask({ shimDisconnect: true }),
        walletConnect({
            projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '',
            metadata: {
                name: '$SBXToken',
                description: '$SBX Token – Fueling DeFi, Tokenization & DAO Governance',
                url: 'https://sbxtoken.com',
                icons: ['https://sbxtoken.com/favicon.ico'],
            },
        }),
    ],
    autoConnect: true,
})

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
