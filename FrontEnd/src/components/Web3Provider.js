import React, {useEffect, useState} from 'react';
import {createConfig, http, WagmiProvider} from 'wagmi';
import {arbitrum, mainnet, polygon, sepolia} from "wagmi/chains";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ConnectKitProvider, getDefaultConfig} from 'connectkit';


const queryClient = new QueryClient()

export const Web3Provider = ({ children }) => {
    const [config, setConfig] = useState(null)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const checkEthereum = async () => {
                if (window.ethereum) {
                    const conf = createConfig(
                        getDefaultConfig({
                            chains: [mainnet, polygon, sepolia, arbitrum],
                            [mainnet.id]: http(),
                            walletConnectProjectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID,
                            appName: '$SBXToken',
                            autoConnect: true,
                        })
                    )
                    setConfig(conf)
                } else {
                    console.warn('window.ethereum не найден (Trust Wallet, Metamask и т.п.)')
                }
            }

            checkEthereum()
        }
    }, [])

    if (!config) return null

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider debugMode>{children}</ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
