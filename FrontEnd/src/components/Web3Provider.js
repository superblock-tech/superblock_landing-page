import { createConfig, http } from 'wagmi'
import { mainnet, polygon, arbitrum, sepolia } from 'wagmi/chains'
import { walletConnect, injected } from 'wagmi/connectors'

export const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID

if (!projectId) {
    throw new Error('REACT_APP_WALLETCONNECT_PROJECT_ID is not defined')
}

export const chains = [mainnet, polygon, arbitrum, sepolia]

export const wagmiConfig = createConfig({
    chains,
    connectors: [
        walletConnect({ projectId }),
        injected(),
    ],
    transports: {
        [mainnet.id]: http(),
        [polygon.id]: http(),
        [arbitrum.id]: http(),
        [sepolia.id]: http(),
    },
})
