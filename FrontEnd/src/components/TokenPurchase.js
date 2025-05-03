import {AuthContext} from "../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import toast from "react-hot-toast";
import {CopyIcon} from "../Icons";
import CollapsibleQR from "./CollapsibleQR";
import LoadingSkeletons from './LoadingSkeletons';
import TokenDropdown from "./TokenDropdown";
import SendEthButton from "./SendFromConnectKitButton";
import { useAccount } from 'wagmi'
import {ConnectKitButton} from "connectkit";


const TokenPurchase = () => {
    // const navigate = useNavigate();
    const {logout} = useContext(AuthContext);
    const {address} = useAccount()
    const [whitelistContent, setWhitelistContent] = useState({});
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedToken, setSelectedToken] = useState(null);
    const [selectedNetwork, setSelectedNetwork] = useState(null);
    const [tokenAmount, setTokenAmount] = useState("");
    const [sbxAmount, setSbxAmount] = useState("");
    const [showWallets, setShowWallets] = useState(false);
    const {token} = useContext(AuthContext);
    const [presaleTransactions, setPresaleTransactions] = useState([]);
    const [presaleTransactionsSum, setPresaleTransactionsSum] = useState(0);


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
                return;
            }

            const data = await response.json();
            setWhitelistContent(data);
        } catch (error) {
            toast.error("Error fetching whitelist content.");
            console.error("Error fetching whitelist content:", error);
        }
    };
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
    };

    const fetchPresaleTransactionsByWallet = async (wallet) => {
        if (wallet) {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/transactions/${wallet}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (response.status === 401) {
                    return;
                }

                const data = await response.json();
                setPresaleTransactions(data);
            } catch (error) {
                toast.error("Error fetching presale transactions content.");
                console.error("Error fetching presale transactions content:", error);
            }
        } else {
            console.log("No connected wallets.");
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
            const ethAddress = data.find((address) => address.name === "ETH");
            if (ethAddress) {
                setSelectedToken(
                    ethAddress.cryptos.find((token) => token.name === "ETH")
                )
                setSelectedNetwork(ethAddress)
            }

        } catch (error) {
            toast.error("Error fetching crypto prices.");
            console.error("Error fetching crypto prices:", error);
        } finally {
            setLoading(false);
        }
    };

    const setToken = ({token, network}) => {
        setSelectedToken(token)
        setSelectedNetwork(network)
    };

    useEffect(() => {
        fetchWhitelistContent();
        fetchCryptoPrices();
    }, []);

    useEffect( () => {
        fetchPresaleTransactionsByWallet(address);
    }, [address])

    useEffect(() => {
        setPresaleTransactionsSum(presaleTransactions.reduce((acc, tx) => acc + (parseFloat(tx.sbx_price) || 0), 0));
    }, [presaleTransactions])

    // Calculate token to SBX conversion
    const calculateSbxAmount = (tokenAmt) => {
        if (!selectedToken || !whitelistContent.sbxPrice || !tokenAmt) return "";
        const usdValue = tokenAmt * selectedToken?.price;
        console.log(selectedToken)
        return (usdValue / whitelistContent.sbxPrice).toFixed(6);
    };

    // Calculate SBX to token conversion
    const calculateTokenAmount = (sbxAmt) => {
        console.log(whitelistContent)
        if (!selectedToken || !whitelistContent.sbxPrice || !sbxAmt) return "";
        const usdValue = sbxAmt * whitelistContent.sbxPrice;
        return (usdValue / selectedToken?.price).toFixed(6);
    };

    const handleTokenAmountChange = (e) => {
        const value = e.target.value;
        if (!value === "" || /^\d*\.?\d*$/.test(value)) {
            setTokenAmount(value);
            setSbxAmount(calculateSbxAmount(parseFloat(value)));
        }
    };

    const prepareQRLink = (wallet, amount) => {

        console.log(wallet)
        return wallet.crypto.prefix + ':' + wallet.address + '?amount=' + amount + '&label=' + wallet.name + '&message=Buy $SBX Tokens'
    }

    const handleSbxAmountChange = (e) => {
        const value = e.target.value;
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setSbxAmount(value);
            setTokenAmount(calculateTokenAmount(parseFloat(value)));
        }
    };

    return (
        <div
            id="buyNow"
            className="bg-gradient-to-r from-purple-200 to-blue-200 p-8 rounded-3xl mx-auto text-black w-[calc(100%-40px)] max-w-6xl border-2 shadow-2xl border-gray-400"
        >

            {/* Purchase Summary - Always visible when amounts are set */}
            {(tokenAmount || sbxAmount) && showWallets && (
                <div className="mb-8 p-4 bg-gradient-to-r from-purple-200 to-blue-200 rounded-xl">
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
                        <LoadingSkeletons.Wallets/>
                    ) : selectedToken?.wallets.length === 0 ? (
                        <div className="text-center p-4 bg-white rounded-xl">
                            No wallets available for {selectedToken?.name}
                        </div>
                    ) : (
                        selectedToken?.wallets.map((wallet) => (
                            <div
                                key={wallet.id}
                                className="bg-white rounded-lg p-4 mb-6 flex items-center"
                            >
                                <img
                                    src={`/assets/images/crypto/color/${wallet.icon}`}
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
                                    className="flex items-center justify-center bg-white hover:bg-gray-700 p-2 rounded-full mr-5"
                                >
                                    <CopyIcon className="w-5 h-5"/>
                                </button>
                                <CollapsibleQR value={prepareQRLink(wallet, tokenAmount)}/>
                            </div>
                        ))
                    )}


                </div>
            ) : (
                <div style={
                    !token
                        ? {pointerEvents: 'none', filter: 'blur(4px)'}
                        : {}
                }>
                    {/* Step 1 - Token Selection */}
                    <div className="mb-8">
                        <h2 className="text-xl">Step 1 - Connect your wallet</h2>
                        <h2 className="text-lg mb-4">In order to buy $SBX you need to connect your wallet.</h2>
                        {token && (
                            <div className="flex items-center gap-4 mt-8 mb-8">
                                <ConnectKitButton/>

                                {/*                  <button*/}
                                {/*                      onClick={handleLogout}*/}
                                {/*                      className="rounded-[12px] flex items-center py-[6.58px] px-[20px] gap-[24px]*/}
                                {/*bg-gradient-to-r from-[#1BA3FF] to-[#7B36B6]*/}
                                {/*hover:from-[#7B36B6] hover:to-[#1BA3FF]*/}
                                {/*transition-all duration-300"*/}
                                {/*                  >*/}
                                {/*                          <span*/}
                                {/*                              className="text-white text-[16px] leading-[29.87px] font-[450]">Logout</span>*/}
                                {/*                      <RightArrow/>*/}
                                {/*                  </button>*/}
                            </div>
                        )}
                        <h2 className="text-xl">Step 2 - Select the payment method</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {loading ? <LoadingSkeletons.TokenSelection/> :
                                <TokenDropdown
                                    networks={tokens}
                                    setTokenData={setToken}
                                    setTokenAmount={setTokenAmount}
                                    setSbxAmount={setSbxAmount}
                                />
                            }
                        </div>
                    </div>

                    {/* Step 2 - Slider */}
                    <div className="mb-8">
                        <h2 className="text-xl">
                            Step 3 - Select the amount of tokens to purchase
                        </h2>
                        {selectedNetwork && selectedToken ? (
                            <div
                                className="bg-gradient-to-r from-purple-200 to-blue-200 p-6 rounded-xl flex flex-col gap-6">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>Min {Number(process.env.REACT_APP_MIN_TOKENS_AMOUNT)?.toLocaleString('en-US')} $SBX</span>
                                    <span>Max {Number(process.env.REACT_APP_MAX_TOKENS_AMOUNT)?.toLocaleString('en-US')} $SBX</span>
                                </div>
                                <input
                                    disabled={!selectedNetwork || !selectedToken}
                                    type="range"
                                    min={Number(process.env.REACT_APP_MIN_TOKENS_AMOUNT)}
                                    max={Number(process.env.REACT_APP_MAX_TOKENS_AMOUNT)}
                                    value={sbxAmount}
                                    onChange={(e) => handleSbxAmountChange(e)}
                                    className={`
                                                w-full h-4 appearance-none cursor-pointer rounded-lg disabled:opacity-50 
                                                [&::-webkit-slider-thumb]:appearance-none 
                                                [&::-webkit-slider-thumb]:w-6 
                                                [&::-webkit-slider-thumb]:h-6 
                                                [&::-webkit-slider-thumb]:bg-white 
                                                [&::-webkit-slider-thumb]:rounded-full 
                                                [&::-webkit-slider-thumb]:shadow-md 
                                                [&::-webkit-slider-thumb]:border 
                                                [&::-webkit-slider-thumb]:border-gray-300 
                                                [&::-moz-range-thumb]:w-6 
                                                [&::-moz-range-thumb]:h-6 
                                                [&::-moz-range-thumb]:bg-white 
                                                [&::-moz-range-thumb]:rounded-full 
                                                [&::-moz-range-thumb]:border 
                                                [&::-moz-range-thumb]:border-gray-300 
                                                bg-gradient-to-r from-purple-500 to-blue-500
                                    `}
                                />
                            </div>
                        ) : ''}

                        <div
                            className="flex flex-col md:flex-row items-center md:justify-between gap-4bg-gradient-to-r from-purple-200 to-blue-200 p-4 rounded-xl">
                            {/* First Input Group */}
                            <div className="flex items-center gap-2 w-full md:w-auto bg-[#FFFFFF] p-4 rounded-lg">
                                <input
                                    type="text"
                                    value={tokenAmount}
                                    onChange={handleTokenAmountChange}
                                    placeholder="0.00"
                                    className="bg-transparent border-none outline-none w-full md:w-32 text-xl"
                                />
                                <div className="flex items-center gap-2 min-w-fit">
                                    {
                                        selectedToken &&
                                        (
                                            <img
                                                className="w-6"
                                                src={`/assets/images/crypto/color/${selectedToken?.icon}.svg`}
                                                alt={selectedToken?.icon}
                                            />

                                        )
                                    }
                                    <span>{selectedNetwork && selectedToken ? selectedNetwork?.name + ' ' + selectedToken?.name : "Select Token"}</span>
                                </div>
                            </div>

                            {/* Equals Sign */}
                            <div className="text-black text-3xl"></div>

                            {/* Second Input Group */}
                            <div className="flex items-center gap-2 w-full md:w-auto bg-[#FFFFFF] p-4 rounded-lg">
                                <input
                                    min={process.env.REACT_APP_MIN_TOKENS_AMOUNT}
                                    max={process.env.REACT_APP_MAX_TOKENS_AMOUNT}
                                    type="text"
                                    value={sbxAmount}
                                    onChange={handleSbxAmountChange}
                                    placeholder="0.00"
                                    className="bg-transparent border-none outline-none w-full text-xl"
                                />
                                <div className="flex items-center gap-2 min-w-fit">
                                    <div
                                        className="bg-gradient-to-r from-purple-100 to-purple-300 rounded-full p-1 w-6 h-6">
                                        <img
                                            className="w-fit"
                                            src={`/favicon.ico`}
                                            alt="sbxtoken"
                                        />
                                    </div>
                                    <span>SBX</span>
                                </div>
                            </div>
                        </div>

                    </div>


                    {address && selectedToken?.name === 'ETH' ? (
                        <SendEthButton amount={tokenAmount} sbxAmount={sbxAmount} selectedNetwork={selectedNetwork}
                                       selectedToken={selectedToken}/>
                    ) : (
                        <button
                            onClick={handleBuyClick}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all font-bold text-lg mb-4"
                            disabled={!selectedToken || !tokenAmount || !sbxAmount}
                        >
                            Buy Now
                        </button>
                    )
                    }


                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl">Transactions List</h2>
                        <span className="text-xl font-bold">Allocated: $SBX {presaleTransactionsSum.toFixed(6)}</span>
                    </div>

                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-x-auto">
                        <thead className="hidden md:table-header-group">
                        <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
                            <th className="px-4 py-2 text-left">Address</th>
                            <th className="px-4 py-2 text-left">$SBX Allocated</th>
                            <th className="px-4 py-2 text-left">USDT Amount</th>
                            <th className="px-4 py-2 text-left">Token Amount</th>
                            <th className="px-4 py-2 text-left">Payment Token</th>
                            <th className="px-4 py-2 text-left">Network</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Hash</th>
                        </tr>
                        </thead>
                        <tbody>
                        {presaleTransactions.map(wallet => (
                            <tr key={wallet.id} className="border-t border-gray-200 text-sm md:table-row">
                                {/* Mobile Card Layout (each row displayed as a card) */}
                                <td className="block md:table-cell px-4 py-2 font-bold text-gray-600 md:hidden">Address:</td>
                                <td className="block md:table-cell px-4 py-2 break-all">{wallet.wallet_address}</td>

                                <td className="block md:table-cell px-4 py-2 font-bold text-gray-600 md:hidden">$SBX
                                    Allocated:
                                </td>
                                <td className="block md:table-cell px-4 py-2 break-all">{parseFloat(wallet.sbx_price).toFixed(6)}</td>

                                <td className="block md:table-cell px-4 py-2 font-bold text-gray-600 md:hidden">USDT
                                    Amount:
                                </td>
                                <td className="block md:table-cell px-4 py-2 break-all">{parseFloat(wallet.usdt_amount).toFixed(6)}</td>

                                <td className="block md:table-cell px-4 py-2 font-bold text-gray-600 md:hidden">Token
                                    Amount:
                                </td>
                                <td className="block md:table-cell px-4 py-2 break-all">{parseFloat(wallet.amount).toFixed(6)}</td>


                                <td className="block md:table-cell px-4 py-2 font-bold text-gray-600 md:hidden">Payment
                                    Token:
                                </td>
                                <td className="block md:table-cell px-4 py-2">{wallet?.crypto?.name}</td>

                                <td className="block md:table-cell px-4 py-2 font-bold text-gray-600 md:hidden">Network:</td>
                                <td className="block md:table-cell px-4 py-2">{wallet?.crypto_network?.name}</td>

                                <td className="block md:table-cell px-4 py-2 font-bold text-gray-600 md:hidden">Status:</td>
                                <td className="block md:table-cell px-4 py-2 text-green-600 font-medium">{wallet.transaction_confirmation}</td>

                                <td className="block md:table-cell px-4 py-2 font-bold text-gray-600 md:hidden">Hash:</td>
                                <td className="block md:table-cell px-4 py-2 break-all flex items-center gap-2">
                                    <span>{wallet.txn_id}</span>
                                    <button
                                        onClick={() => handleCopy(wallet.txn_id)}
                                        className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 p-1 rounded-full"
                                    >
                                        <CopyIcon className="w-4 h-4"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>


                </div>
            )}
        </div>
    );
};

export default TokenPurchase;
