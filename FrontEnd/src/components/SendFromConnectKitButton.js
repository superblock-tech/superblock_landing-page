import { useAccount, useWalletClient } from 'wagmi'
import { parseEther } from 'viem'
import React, { useState } from 'react'
import {mainnet, sepolia} from "wagmi/chains";

const SendEthButton= ({ amount }) => {
    const { address } = useAccount()
    const { data: walletClient } = useWalletClient()
    const [isLoading, setIsLoading] = useState(false)

    const sendETH = async () => {
        if (!walletClient || !address) return
        setIsLoading(true)

        try {
            const tx = await walletClient.sendTransaction({
                to: process.env.REACT_APP_WALLETCONNECT_DEFAULT_WALLET,
                value: parseEther(amount),
                account: address,
                chains: [sepolia, mainnet],
            })

            console.log('tx sent', tx)
        } catch (err) {
            console.error('Transaction error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={sendETH}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all font-bold text-lg mb-4"
            disabled={isLoading}
        >
            {isLoading ? 'Sending...' : 'Buy Now'}

        </button>
    )
}

export default SendEthButton
