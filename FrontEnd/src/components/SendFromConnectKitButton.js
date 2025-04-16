import { useAccount, useWalletClient } from 'wagmi'
import { parseEther } from 'viem'
import React, { useState } from 'react'
import {mainnet, sepolia} from "wagmi/chains";

function SendEthButton() {
    const { address } = useAccount()
    const { data: walletClient } = useWalletClient()
    const [isLoading, setIsLoading] = useState(false)

    const sendETH = async () => {
        if (!walletClient || !address) return
        setIsLoading(true)

        try {
            const tx = await walletClient.sendTransaction({
                to: '0x5566bB9410690e209d27CF9b8d36834C9C9Cf884',
                value: parseEther('0.001'), // 0.01 ETH
                account: address,
                chains: [sepolia],
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
