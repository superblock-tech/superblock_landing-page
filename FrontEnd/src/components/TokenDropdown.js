import { useState } from "react";
import { ChevronDown } from "lucide-react";


const TokenDropdown = ({ networks,  getTokenEmoji, setTokenData }) => {
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
        setDropdownOpen(false);
    };

    return (
        (<>{networks?.map((network) => (
            <div className="relative inline-block text-left w-full">
                <button
                    onClick={() => setDropdownOpen(dropdownOpen ===  network.name ? false : network.name)}
                    className={`w-full flex items-center justify-between gap-3 p-4 rounded-xl border transition-all border-gray-700 hover:border-gray-600`}>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{"🪙"}</span>
                        <div className="text-left">
                            <div className="font-bold">{network.name}</div>
                        </div>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-400"/>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen === network.name && (
                    <div
                        className="absolute z-50 mt-2 w-full bg-gradient-to-r from-purple-500 to-blue-50 border border-gray-700 rounded-xl shadow-xl">
                        {network.cryptos.map((token) => (
                            <button
                                key={token.id}
                                onClick={() => handleSelect(token, network)}
                                className={`w-full flex items-center gap-3 p-4 text-left rounded-xl transition-all ${
                                    selectedToken?.id === token.id && selectedNetwork?.id === network.id
                                        ? "bg-purple-900/30"
                                        : "hover:bg-blue-50"
                                }`}
                            >
                                <span className="text-2xl">{getTokenEmoji(token.name)}</span>
                                <div className="text-left">
                                    <div className="font-bold">{token.name}</div>
                                    <div className="text-sm">${token.price}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        ))}</>)

    );
};

export default TokenDropdown;
