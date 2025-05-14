import React from 'react';
import {createConfig, http, WagmiProvider} from 'wagmi';
import {arbitrum, mainnet, polygon, sepolia} from "wagmi/chains";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ConnectKitProvider} from 'connectkit';
import {injected, walletConnect} from '@wagmi/connectors'


const config = createConfig(
    {
        appName: '$SBXToken',
        chains: [mainnet, polygon, sepolia, arbitrum],
        transports: {
            [mainnet.id]: http(),
            [polygon.id]: http(),
            [sepolia.id]: http(),
            [arbitrum.id]: http(),
        },
        projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID,
        connectors: [
            injected({
                shimDisconnect: true
            }),
        ],
        ssr: false,
        autoConnect: true,
    }
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
