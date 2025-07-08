import React from 'react';
import {createConfig, http, WagmiProvider} from 'wagmi';
import {arbitrum, mainnet, polygon, sepolia} from "wagmi/chains";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ConnectKitProvider} from 'connectkit';
import {injected, walletConnect} from '@wagmi/connectors'


const config = createConfig({
    chains: [mainnet, polygon, sepolia, arbitrum],
    connectors: [
        injected(),
        walletConnect({
            projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID,
            metadata: {
                name: '$SBXToken',
                description: 'SBX Token Application',
                url: window.location.origin,
                icons: [`${window.location.origin}/favicon.ico`]
            },
        }),
    ],
    transports: {
        [mainnet.id]: http(),
        [polygon.id]: http(),
        [sepolia.id]: http(),
        [arbitrum.id]: http(),
    },
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
