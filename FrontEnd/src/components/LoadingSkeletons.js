import React from 'react';

const LoadingSkeletons = {
    Stats: () => (
        <div className="flex justify-between mb-12">
            <div>
                <div className="text-gray-400 text-sm">USDT Raised</div>
                <div className="h-8 w-32 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div>
                <div className="text-gray-400 text-sm">Holders</div>
                <div className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
            </div>
        </div>
    ),

    TokenPrice: () => (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-gray-700 rounded-full p-1 w-6 h-6 animate-pulse"></div>
                <span>1 SBX = </span>
                <div className="h-6 w-24 bg-gray-700 rounded animate-pulse"></div>
            </div>

            <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
                <div className="absolute top-0 left-0 h-full w-1/3 bg-gray-600 animate-pulse"></div>
            </div>

            <div className="inline-block bg-[#2a2a2a] rounded-2xl p-4">
                <div className="flex items-center gap-2">
                    <div className="bg-gray-700 rounded-full p-1 w-6 h-6 animate-pulse"></div>
                    <div className="h-6 w-32 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="text-sm text-purple-400 ml-8">Tokens Sold</div>
            </div>
        </div>
    ),

    TokenSelection: () => (
        <>
            {[1, 2, 3, 4, 5].map((index) => (
                <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-700 animate-pulse"
                >
                    <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-5 w-16 bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 w-20 bg-gray-700 rounded"></div>
                    </div>
                </div>
            ))}
        </>

    ),

    Wallets: () => (
        <>
            {[1, 2].map((index) => (
                <div
                    key={index}
                    className="bg-[#2a2a2a] rounded-lg p-4 mb-6 flex items-center animate-pulse"
                >
                    <div className="w-12 h-12 bg-gray-700 rounded-full mr-4"></div>
                    <div className="flex-1">
                        <div className="h-6 w-32 bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 w-64 bg-gray-700 rounded"></div>
                    </div>
                    <div className="w-10 h-10 bg-gray-700 rounded-full mr-5"></div>
                    <div className="w-16 h-16 bg-gray-700 rounded"></div>
                </div>
            ))}
        </>
    )
};

export default LoadingSkeletons;