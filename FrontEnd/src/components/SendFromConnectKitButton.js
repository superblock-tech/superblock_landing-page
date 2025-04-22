import { useAccount, useWalletClient } from 'wagmi'
import { parseEther } from 'viem'
import React, { useState } from 'react'
import {mainnet, sepolia} from "wagmi/chains";
import toast from "react-hot-toast";
import * as wallet from "framer-motion/m";

const SendEthButton= ({ amount, sbxAmount, selectedToken, selectedNetwork }) => {
    const { address, chain, chainId } = useAccount()
    const { data: walletClient } = useWalletClient()
    const [isLoading, setIsLoading] = useState(false)

    const storeLocalPresaleTransaction = async (txn_id) => {

            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/transactions`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        method: "POST",
                        body: JSON.stringify(
                            {
                                chain_id: chainId,
                                chain_name: chain.name,
                                txn_id: txn_id,
                                sbx_price: sbxAmount,
                                amount: amount,
                                crypto_id: selectedToken?.id,
                                crypto_network_id: selectedNetwork?.id,
                                wallet_address: address
                            }),
                    }
                );

                if (response.status === 401) {
                    return;
                }

                const data = await response.json();

                console.log(data)
            } catch (error) {
                toast.error("Error.");
                console.error("Error:", error);
            }

    };

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
            storeLocalPresaleTransaction(tx).then(() => {
                window.location.reload()
            })

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
