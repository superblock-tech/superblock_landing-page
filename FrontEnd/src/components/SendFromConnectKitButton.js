import {useAccount, useWalletClient} from 'wagmi'
import {erc20Abi, parseEther} from 'viem'
import React, {useState} from 'react'
import {mainnet, polygon, sepolia} from "wagmi/chains";
import toast from "react-hot-toast";

const SendEthButton = ({amount, sbxAmount, selectedToken, selectedNetwork}) => {
    const {address, chain, chainId} = useAccount()
    const {data: walletClient} = useWalletClient()
    const [isLoading, setIsLoading] = useState(false)

    const CONTRACT_CURRENCIES = ["USDT", "USDC"]

    const TOKENS = {
        MATIC: {
            USDC: {
                address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
                decimals: 6,
                chain: polygon
            },
            USDT: {
                address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
                decimals: 6,
                chain: polygon
            },
        },
        ERC20: {
            USDC: {
                address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                decimals: 6,
                chain: mainnet
            },
            USDT: {
                address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
                decimals: 6,
                chain: mainnet
            },

        },
    }

    const sendETH = async () => {
        if (!walletClient || !address) return

        // if (selectedToken.symbol !== chain.nativeCurrency.symbol) {
        //     toast.error("Select correct network of connected wallet");
        //     return;
        // }

        setIsLoading(true)
        const wallet = selectedToken.wallets[0].address

        try {
            if (CONTRACT_CURRENCIES.includes(selectedToken.symbol)) {

                await walletClient.writeContract({
                    address: TOKENS[selectedNetwork.address][selectedToken.symbol].address,
                    abi: erc20Abi,
                    functionName: 'transfer',
                    args: [
                        wallet,
                        BigInt(amount * (10 ** (TOKENS[selectedNetwork.address][selectedToken.symbol].decimals))),
                    ],
                    account: address,
                    chain: TOKENS[selectedNetwork.address][selectedToken.symbol].chain,
                })
            } else {
                await walletClient.sendTransaction({
                    to: wallet,
                    value: parseEther(amount.toString()),
                    account: address,
                    chains: [sepolia, mainnet, polygon],
                })
            }

            toast.success("Transaction initiated successfully!");
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
