import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { Route, Routes, useLocation } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWeb3Modal } from '@web3modal/wagmi/react'

import HomePage from './pages'
import ProfilePage from './pages/profile'
import Header from './components/Header'
import { PresaleContextProvider } from './contexts/PresaleContext'
import { wagmiConfig, projectId, chains } from './components/Web3Provider'
import { pageview } from './utils/gtag'

// Create a client
const queryClient = new QueryClient()

// Create modal
createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    themeMode: 'dark', // or 'light'
    themeVariables: {
        '--w3m-accent': '#2563eb',
        '--w3m-border-radius-master': '4px',
    },
})

function App() {
    const location = useLocation()

    useEffect(() => {
        pageview(location.pathname + location.search)
    }, [location])

    return (
        <AuthProvider>
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <PresaleContextProvider>
                        <Toaster />
                        <Header />
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/presale" element={<ProfilePage />} />
                        </Routes>
                    </PresaleContextProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </AuthProvider>
    )
}

export default App
