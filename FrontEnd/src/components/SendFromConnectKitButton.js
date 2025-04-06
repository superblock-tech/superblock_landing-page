import { useAccount, useWalletClient } from 'wagmi'
import { parseEther } from 'viem'
import React, { useState } from 'react'

function SendEthButton() {
    const { address } = useAccount()
    const { data: walletClient } = useWalletClient()
    const [isLoading, setIsLoading] = useState(false)

    const sendETH = async () => {
        if (!walletClient || !address) return
        setIsLoading(true)

        try {
            const tx = await walletClient.sendTransaction({
                to: '0xC8CD2BE653759aed7B0996315821AAe71e1FEAdF',
                value: parseEther('0.01'), // 0.01 ETH
                account: address,
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
