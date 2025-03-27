import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { CopyIcon } from "../Icons";
import CollapsibleQR from "./CollapsibleQR";
import LoadingSkeletons from './LoadingSkeletons';

const TokenPurchase = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const [whitelistContent, setWhitelistContent] = useState({});
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedToken, setSelectedToken] = useState(null);
    const [tokenAmount, setTokenAmount] = useState("");
    const [sbxAmount, setSbxAmount] = useState("");
    const [showWallets, setShowWallets] = useState(false);


    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const handleBuyClick = () => {
        setShowWallets(true);
    };

    const handleBackToTokens = () => {
        setShowWallets(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const fetchWhitelistContent = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/getWhitelistContent`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.status === 401) {
                handleLogout();
                return;
            }

            const data = await response.json();
            setWhitelistContent(data);
        } catch (error) {
            toast.error("Error fetching whitelist content.");
            console.error("Error fetching whitelist content:", error);
        }
    };

    const fetchCryptoPrices = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/getPriceForCrypto`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.status === 401) {
                handleLogout();
                return;
            }

            const data = await response.json();
            setTokens(data);
            // Set initial selected token to ETH
            const ethToken = data.find((token) => token.name === "ETH");
            if (ethToken) {
                setSelectedToken(ethToken);
            }
        } catch (error) {
            toast.error("Error fetching crypto prices.");
            console.error("Error fetching crypto prices:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWhitelistContent();
        fetchCryptoPrices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Calculate token to SBX conversion
    const calculateSbxAmount = (tokenAmt) => {
        if (!selectedToken || !whitelistContent.sbxPrice || !tokenAmt) return "";
        const usdValue = tokenAmt * selectedToken.price;
        return (usdValue / whitelistContent.sbxPrice).toFixed(6);
    };

    // Calculate SBX to token conversion
    const calculateTokenAmount = (sbxAmt) => {
        if (!selectedToken || !whitelistContent.sbxPrice || !sbxAmt) return "";
        const usdValue = sbxAmt * whitelistContent.sbxPrice;
        return (usdValue / selectedToken.price).toFixed(6);
    };

    const handleTokenAmountChange = (e) => {
        const value = e.target.value;
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setTokenAmount(value);
            setSbxAmount(calculateSbxAmount(parseFloat(value)));
        }
    };

    const handleSbxAmountChange = (e) => {
        const value = e.target.value;
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setSbxAmount(value);
            setTokenAmount(calculateTokenAmount(parseFloat(value)));
        }
    };

    const getTokenEmoji = (tokenName) => {
        const emojis = {
            BTC: "₿",
            ETH: "⟠",
            BNB: "🟡",
            SOL: "◎",
            USDT: "💵",
        };
        return emojis[tokenName] || "🪙";
    };

    return (
        <div className="bg-[#1a1a1a] p-8 rounded-3xl mx-auto text-white w-[calc(100%-40px)] max-w-3xl border-2 shadow-2xl border-gray-400">
            {/* Header Stats */}
            {loading ? (
                <LoadingSkeletons.Stats />
            ) : (
                <div className="flex justify-between mb-12">
                    <div>
                        <div className="text-gray-400 text-sm">USDT Raised</div>
                        <div className="text-2xl font-bold">${whitelistContent.usdtRaised}</div>
                    </div>
                    <div>
                        <div className="text-gray-400 text-sm">Holders</div>
                        <div className="text-2xl font-bold">{whitelistContent.holders}</div>
                    </div>
                </div>
            )}


            <div className="mb-8">
                {/* Token Price Info */}
                {loading ? (
                    <LoadingSkeletons.TokenPrice />
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1 w-6 h-6"></div>
                            <span>1 SBX = </span>
                            <span className="text-blue-400">
                                ${whitelistContent.sbxPrice} USD
                            </span>
                        </div>

                        <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                style={{ width: `${whitelistContent.percentage}%` }}
                            ></div>
                        </div>
                        <div className="inline-block bg-[#2a2a2a] rounded-2xl p-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1 w-6 h-6"></div>
                                <span className="font-bold">
                                    {(
                                        whitelistContent.usdtRaised / whitelistContent.sbxPrice
                                    ).toFixed(2)}{" "}
                                    SBX
                                </span>
                            </div>
                            <div className="text-sm text-purple-400 ml-8">Tokens Sold</div>
                        </div>
                    </>
                )}
            </div>

            {/* Purchase Summary - Always visible when amounts are set */}
            {(tokenAmount || sbxAmount) && showWallets && (
                <div className="mb-8 p-4 bg-[#2a2a2a] rounded-xl">
                    <h3 className="text-lg mb-2">Purchase Summary</h3>
                    <div className="flex justify-between items-center">
                        <span>
                            {tokenAmount} {selectedToken?.symbol}
                        </span>
                        <span className="text-gray-400">=</span>
                        <span>{sbxAmount} SBX</span>
                    </div>
                </div>
            )}

            {/* Conditional rendering based on showWallets state */}
            {showWallets ? (
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl">Available {selectedToken?.name} Wallets</h2>
                        <button
                            onClick={handleBackToTokens}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            ← Change Token
                        </button>
                    </div>

                    {loading ? (
                        <LoadingSkeletons.Wallets />
                    ) : selectedToken?.wallets.length === 0 ? (
                        <div className="text-center p-4 bg-[#2a2a2a] rounded-xl">
                            No wallets available for {selectedToken?.name}
                        </div>
                    ) : (
                        selectedToken?.wallets.map((wallet) => (
                            <div
                                key={wallet.id}
                                className="bg-[#2a2a2a] rounded-lg p-4 mb-6 flex items-center"
                            >
                                <img
                                    src={`https://nomad-parners.online/storage/${wallet.icon}`}
                                    alt="wallet icon"
                                    className="w-12 h-12 rounded-full mr-4 object-cover"
                                    onError={(e) => {
                                        e.target.src = "assets/images/crypto-wallet.png";
                                    }}
                                />

                                <div className="flex-1">
                                    <h2 className="font-bold text-xl">{wallet.name}</h2>
                                    <p className="text-gray-400 text-sm break-all">
                                        {wallet.address}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleCopy(wallet.address)}
                                    className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 p-2 rounded-full mr-5"
                                >
                                    <CopyIcon className="w-5 h-5" />
                                </button>
                                <CollapsibleQR value={wallet.address} />
                            </div>
                        ))
                    )}


                </div>
            ) : (
                <>
                    {/* Step 1 - Token Selection */}
                    <div className="mb-8">
                        <h2 className="text-xl mb-4">Step 1 - Select the payment method</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {loading ? <LoadingSkeletons.TokenSelection /> : (<>{tokens?.map((token) => (
                                <button
                                    key={token.id}
                                    onClick={() => {
                                        setSelectedToken(token);
                                        if (tokenAmount) {
                                            setSbxAmount(calculateSbxAmount(parseFloat(tokenAmount)));
                                        }
                                    }}
                                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${selectedToken?.id === token.id
                                        ? "border-purple-500 bg-gradient-to-r from-purple-900/50 to-blue-900/50"
                                        : "border-gray-700 hover:border-gray-600"
                                        }`}
                                >
                                    <span className="text-2xl">{getTokenEmoji(token.name)}</span>
                                    <div className="text-left">
                                        <div className="font-bold">{token.name}</div>
                                        <div className="text-sm text-gray-400">${token.price}</div>
                                    </div>
                                </button>
                            ))}</>)}
                        </div>
                    </div>

                    {/* Step 2 - Amount Input */}

                    <div className="mb-8">
                        <h2 className="text-xl mb-4">
                            Step 2 - Enter the amount of tokens you would like to purchase
                        </h2>
                        <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 bg-[#2a2a2a] p-4 rounded-xl">
                            {/* First Input Group */}
                            <div className="flex items-center gap-2 w-full md:w-auto bg-[#222222] p-4 rounded-lg">
                                <input
                                    type="text"
                                    value={tokenAmount}
                                    onChange={handleTokenAmountChange}
                                    placeholder="0.00"
                                    className="bg-transparent border-none outline-none w-full md:w-32 text-xl"
                                />
                                <div className="flex items-center gap-2 min-w-fit">
                                    <span className="text-2xl">
                                        {selectedToken ? getTokenEmoji(selectedToken.name) : "🪙"}
                                    </span>
                                    <span>{selectedToken?.name || "Select Token"}</span>
                                </div>
                            </div>

                            {/* Equals Sign */}
                            <div className="text-white text-3xl">=</div>

                            {/* Second Input Group */}
                            <div className="flex items-center gap-2 w-full md:w-auto bg-[#222222] p-4 rounded-lg">
                                <input
                                    type="text"
                                    value={sbxAmount}
                                    onChange={handleSbxAmountChange}
                                    placeholder="0.00"
                                    className="bg-transparent border-none outline-none w-full text-xl"
                                />
                                <div className="flex items-center gap-2 min-w-fit">
                                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1 w-6 h-6"></div>
                                    <span>SBX</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Buy Button */}
                    <button
                        onClick={handleBuyClick}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all font-bold text-lg mb-4"
                        disabled={!selectedToken || !tokenAmount || !sbxAmount}
                    >
                        Buy Now
                    </button>
                </>
            )}
        </div>
    );
};

export default TokenPurchase;
