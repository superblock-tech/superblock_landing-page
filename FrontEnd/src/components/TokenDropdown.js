import { useState } from "react";
import { ChevronDown } from "lucide-react";


const TokenDropdown = ({ networks, setTokenData, setTokenAmount, setSbxAmount }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedToken, setSelectedToken] = useState({});
    const [selectedNetwork, setSelectedNetwork] = useState({});

    const handleSelect = (token, network) => {
        if (typeof setTokenData === 'function') {
            setTokenData({token, network});
        } else {
            console.log(typeof setTokenData)
        }
        setSelectedToken(token);
        setSelectedNetwork(network);
        setTokenAmount(0)
        setSbxAmount(0)
        setDropdownOpen(false);
    };

    return (
        (<>{networks?.map((network) => (
            <div className="relative inline-block text-left w-full" key={network.id}>
                <button
                    onClick={() => {
                        if (network.cryptos.length === 1) {
                            handleSelect(network.cryptos[0], network)
                        } else {
                            setDropdownOpen(dropdownOpen === network.name ? false : network.name)
                        }
                    }}
                    className={`
            w-full group relative overflow-hidden
            flex items-center justify-between gap-3 p-4 lg:p-5
            rounded-xl lg:rounded-2xl border-2 transition-all duration-300
            ${selectedNetwork?.id === network.id
                        ? "border-purple-400 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 shadow-lg shadow-purple-200/50"
                        : "border-slate-200 hover:border-purple-300 bg-white hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 hover:shadow-md"
                    }
            transform hover:scale-[1.02] active:scale-[0.98]
        `}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div
                            className="absolute top-0 right-0 w-16 h-16 bg-purple-400 rounded-full -translate-y-8 translate-x-8"></div>
                        <div
                            className="absolute bottom-0 left-0 w-12 h-12 bg-blue-400 rounded-full translate-y-6 -translate-x-6"></div>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-4 relative z-10">
                        {/* Icon Container with Enhanced Styling */}
                        <div className={`
                relative p-2 rounded-xl transition-all duration-300
                ${selectedNetwork?.id === network.id
                            ? "bg-white shadow-md ring-2 ring-purple-200"
                            : "bg-slate-50 group-hover:bg-white group-hover:shadow-sm"
                        }
            `}>
                            <img
                                className="w-8 h-8 lg:w-10 lg:h-10 transition-transform duration-300 group-hover:scale-110"
                                src={`/assets/images/crypto/color/${selectedToken && selectedNetwork?.id === network.id ? selectedToken.icon : network.icon}.svg`}
                                alt={selectedToken ? selectedToken.icon : network.icon}
                            />

                            {/* Selection Indicator */}
                            {selectedNetwork?.id === network.id && (
                                <div
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="text-left flex-1 min-w-0">
                            <div className={`
                    font-bold text-base lg:text-lg transition-colors duration-300
                    ${selectedNetwork?.id === network.id
                                ? "text-purple-700"
                                : "text-slate-800 group-hover:text-purple-600"
                            }
                `}>
                                {network.description}
                            </div>
                            <div className={`
                    text-sm lg:text-base font-medium transition-colors duration-300 truncate
                    ${selectedNetwork?.id === network.id
                                ? "text-purple-600"
                                : "text-slate-600 group-hover:text-slate-700"
                            }
                `}>
                                {network.name}
                                {selectedNetwork?.id === network.id && selectedToken?.name && (
                                    <span
                                        className="ml-2 inline-block bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                            {selectedToken.name}
                        </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dropdown Arrow */}
                    {network.cryptos.length > 1 && (
                        <div className="relative z-10 flex items-center">
                            <div className={`
                    p-2 rounded-lg transition-all duration-300
                    ${selectedNetwork?.id === network.id
                                ? "bg-purple-100"
                                : "bg-slate-100 group-hover:bg-slate-200"
                            }
                `}>
                                <ChevronDown className={`
                        w-4 h-4 lg:w-5 lg:h-5 transition-all duration-300
                        ${dropdownOpen === network.name ? "rotate-180" : "rotate-0"}
                        ${selectedNetwork?.id === network.id
                                    ? "text-purple-600"
                                    : "text-slate-600 group-hover:text-slate-700"
                                }
                    `}/>
                            </div>
                        </div>
                    )}
                </button>

                {/* Enhanced Dropdown Menu */}
                {dropdownOpen === network.name && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setDropdownOpen(false)}
                        />

                        {/* Dropdown */}
                        <div
                            className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-xl lg:rounded-2xl shadow-2xl shadow-slate-900/20 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                            {/* Dropdown Header */}
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3">
                                <h4 className="text-white font-semibold text-sm lg:text-base">
                                    Select Payment Token
                                </h4>
                            </div>

                            {/* Dropdown Options */}
                            <div className="max-h-64 overflow-y-auto">
                                {network.cryptos.map((token, index) => (
                                    <button
                                        key={token.id}
                                        onClick={() => handleSelect(token, network)}
                                        className={`
                                w-full flex items-center gap-3 lg:gap-4 p-3 lg:p-4 text-left 
                                transition-all duration-200 group/item
                                ${selectedToken?.id === token.id && selectedNetwork?.id === network.id
                                            ? "bg-purple-50 border-l-4 border-purple-500"
                                            : "hover:bg-slate-50 border-l-4 border-transparent hover:border-purple-300"
                                        }
                                ${index !== network.cryptos.length - 1 ? "border-b border-slate-100" : ""}
                            `}
                                    >
                                        {/* Token Icon */}
                                        <div className={`
                                relative p-2 rounded-lg transition-all duration-200
                                ${selectedToken?.id === token.id && selectedNetwork?.id === network.id
                                            ? "bg-white shadow-sm ring-1 ring-purple-200"
                                            : "bg-slate-50 group-hover/item:bg-white group-hover/item:shadow-sm"
                                        }
                            `}>
                                            <img
                                                className="w-6 h-6 lg:w-8 lg:h-8 transition-transform duration-200 group-hover/item:scale-110"
                                                src={`/assets/images/crypto/color/${token.icon}.svg`}
                                                alt={token.icon}
                                            />

                                            {/* Selection Indicator */}
                                            {selectedToken?.id === token.id && selectedNetwork?.id === network.id && (
                                                <div
                                                    className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white flex items-center justify-center">
                                                    <svg className="w-1.5 h-1.5 text-white" fill="currentColor"
                                                         viewBox="0 0 20 20">
                                                        <path fillRule="evenodd"
                                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                              clipRule="evenodd"/>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Token Info */}
                                        <div className="text-left flex-1 min-w-0">
                                            <div className={`
                                    font-semibold text-sm lg:text-base transition-colors duration-200
                                    ${selectedToken?.id === token.id && selectedNetwork?.id === network.id
                                                ? "text-purple-700"
                                                : "text-slate-800 group-hover/item:text-purple-600"
                                            }
                                `}>
                                                {token.name}
                                            </div>
                                            {token.symbol && (
                                                <div className={`
                                        text-xs lg:text-sm font-medium transition-colors duration-200
                                        ${selectedToken?.id === token.id && selectedNetwork?.id === network.id
                                                    ? "text-purple-600"
                                                    : "text-slate-500 group-hover/item:text-slate-600"
                                                }
                                    `}>
                                                    {token.symbol}
                                                </div>
                                            )}
                                        </div>

                                        {/* Arrow Indicator */}
                                        <div className={`
                                opacity-0 group-hover/item:opacity-100 transition-opacity duration-200
                                ${selectedToken?.id === token.id && selectedNetwork?.id === network.id ? "opacity-100" : ""}
                            `}>
                                            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        ))}</>)

    );
};

export default TokenDropdown;
