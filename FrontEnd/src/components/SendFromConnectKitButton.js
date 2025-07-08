import {http, useAccount, useWalletClient} from 'wagmi'
import {createPublicClient, encodeFunctionData, erc20Abi, parseEther} from 'viem'
import React, {useState} from 'react'
import {mainnet, polygon, sepolia} from "wagmi/chains";
import toast from "react-hot-toast";
import {event} from "../utils/gtag";
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

const SendEthButton = ({amount, sbxAmount, selectedToken, selectedNetwork, updatePrimaryWallet}) => {
    const {address, chain, chainId} = useAccount()
    const {data: walletClient} = useWalletClient()
    const [isLoading, setIsLoading] = useState(false)

    const CONTRACT_CURRENCIES = ["USDT", "USDC"]

    const TOKENS = {
        MATIC: {
            USDC: {
                address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
                decimals: 6,
                chain: polygon,
                function: 'extendedTransaction'

            },
            USDT: {
                address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
                decimals: 6,
                chain: polygon,
                function: 'contract'
            },
        },
        ERC20: {
            USDC: {
                address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                decimals: 6,
                chain: mainnet,
                function: 'extendedTransaction'
            },
            USDT: {
                address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
                decimals: 6,
                chain: mainnet,
                function: 'contract'
            },

        },
    }

    const sendETH = async () => {
        if (!walletClient || !address) return

        event({
            action: 'create_in_app_transfer',
            category: 'presale',
            label: 'create_in_app_transfer_for',
            value: selectedToken?.name.toLowerCase()
        })

        setIsLoading(true)
        const wallet = selectedToken.wallets[0].address

        try {
            if (CONTRACT_CURRENCIES.includes(selectedToken.symbol)) {

                if (TOKENS[selectedNetwork.address][selectedToken.symbol].function === 'contract') {
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
                }

                if (TOKENS[selectedNetwork.address][selectedToken.symbol].function === 'extendedTransaction') {

                    const publicClient = createPublicClient({
                        chain: TOKENS[selectedNetwork.address][selectedToken.symbol].chain,
                        transport: http(),
                    });


                    const balance = await publicClient.readContract({
                        address: TOKENS[selectedNetwork.address][selectedToken.symbol].address,
                        abi: erc20Abi,
                        functionName: 'balanceOf',
                        args: [address],
                    });


                    if (balance < BigInt(amount * (10 ** (TOKENS[selectedNetwork.address][selectedToken.symbol].decimals)))) {
                        toast.error("Insufficient balance. Your balance: " + balance);
                        return null;
                    }

                    const data = encodeFunctionData({
                        abi: [
                            {
                                type: 'function',
                                name: 'transfer',
                                stateMutability: 'nonpayable',
                                inputs: [
                                    {name: 'to', type: 'address'},
                                    {name: 'amount', type: 'uint256'}
                                ],
                                outputs: [{name: '', type: 'bool'}],
                            },
                        ],
                        functionName: 'transfer',
                        args: [wallet, BigInt(amount * (10 ** (TOKENS[selectedNetwork.address][selectedToken.symbol].decimals)))],
                    });

                    await walletClient.sendTransaction({
                        to: TOKENS[selectedNetwork.address][selectedToken.symbol].address,
                        data,
                        address,
                    });
                }

            } else if(selectedToken.symbol === 'SOL') {
                const provider = window.solana;
                if (!provider?.isPhantom) {
                    toast.error("Phantom Wallet not found!");
                }

                const resp = await provider.connect();

                if (resp) {
                    const sender = new PublicKey(resp.publicKey.toString());
                    if (sender) {
                        updatePrimaryWallet(resp.publicKey.toString(), false)
                        const recipient = new PublicKey(wallet);
                        const connection = new Connection(`https://summer-lively-energy.solana-mainnet.quiknode.pro/${process.env.REACT_APP_SOLANA_KEY}/`, "confirmed");

                        const transaction = new Transaction().add(
                            SystemProgram.transfer({
                                fromPubkey: sender,
                                toPubkey: recipient,
                                lamports: amount * 1e9,
                            })
                        );

                        transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
                        transaction.feePayer = sender;

                        const signed = await provider.signTransaction(transaction);
                        const signature = await connection.sendRawTransaction(signed.serialize());
                        await connection.confirmTransaction(signature);

                    }
                } else {
                    toast.error("Phantom Wallet not connected!");
                }
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
