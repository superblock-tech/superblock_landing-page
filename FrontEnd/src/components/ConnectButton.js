import React from 'react'
import {useAccount, useDisconnect} from 'wagmi'
import {useWeb3Modal} from '@web3modal/wagmi/react'

function ConnectButton() {
    const {address, isConnected} = useAccount()
    const {open} = useWeb3Modal()
    const {disconnect} = useDisconnect()

    if (isConnected) {
        return (
            <div className="flex items-center gap-2">
        <span className="text-sm flex gap-2">
            <button
                onClick={() => open()}
                className="px-4 py-2 bg-gray-700 text-white size-22 rounded-2xl hover:bg-gray-600">
                {address?.slice(0, 6)}...{address?.slice(-4)}
            </button>
            <button
                onClick={() => disconnect()}
                className="px-4 py-2 bg-red-400 text-white size-22 rounded-2xl hover:bg-red-500"
            >
                    Disconnect
                </button>
        </span>

            </div>
        )
    }

    return (
        <button
            onClick={() => open()}
            className="text-sm px-4 py-2 bg-indigo-500 text-white size-22 rounded-2xl hover:bg-indigo-600"
        >
            Connect Wallet
        </button>
    )
}

export default ConnectButton
