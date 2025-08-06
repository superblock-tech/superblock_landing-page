import {AuthContext} from "../contexts/AuthContext";
import React, {useCallback, useContext, useEffect, useState,} from "react";
import toast from "react-hot-toast";
import {CopyIcon} from "../Icons";
import CollapsibleQR from "./CollapsibleQR";
import LoadingSkeletons from "./LoadingSkeletons";
import TokenDropdown from "./TokenDropdown";
import SendEthButton from "./SendFromConnectKitButton";
import {useAccount} from 'wagmi'
import {event} from "../utils/gtag";
import ConnectButton from "./ConnectButton";

const TokenPurchase = (whitelist) => {
    // console.log("Render TokenPurchase whitelist", whitelist);
    // const navigate = useNavigate();
    const {logout} = useContext(AuthContext);
    const {address, chain} = useAccount();
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedToken, setSelectedToken] = useState(null);
    const [selectedNetwork, setSelectedNetwork] = useState(null);
    const [tokenAmount, setTokenAmount] = useState("");
    const [customAddress, setCustomAddress] = useState("");
    const [sbxAmount, setSbxAmount] = useState("");
    const [showWallets, setShowWallets] = useState(false);
    const {token} = useContext(AuthContext);
    const [presaleTransactions, setPresaleTransactions] = useState([]);
    const [presaleTransactionsSum, setPresaleTransactionsSum] = useState(0);
    const inAppNetworks = ["ERC20", "MATIC", "SOL"];
    const {login} = useContext(AuthContext);
    const chainRelation = {
        MATIC: "Polygon",
        ERC20: "Ethereum",
        SOL: "Solana",
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const handleBuyClick = () => {
        setShowWallets(true);
        event({
            action: "show_payment_qr",
            category: "presale",
            label: "show_payment_qr_for",
            value: selectedToken?.name.toLowerCase(),
        });
    };

    const handleBackToTokens = () => {
        setShowWallets(false);
    };

    const handleLogout = () => {
        logout();
    };

    const fetchPresaleTransactionsByWallet = async () => {
        try {
            if (!token) {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({"code": address}),
                });

                if (!response.ok) {
                    throw new Error("Login failed");
                }

                const data = await response.json();

                console.log(data)
                const bearerToken = data.token;

                login(bearerToken);
            } else {

            }
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/transactions`,
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
            // toast.error("Error fetching presale transactions content.");
            // console.error("Error fetching presale transactions content:", error);
        }
    };

    const updatePrimaryWallet = async (wallet, isPrimary) => {
        if (wallet && selectedToken) {
            try {
                await fetch(`${process.env.REACT_APP_API_URL}/wallet`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        wallet: wallet,
                        is_primary: isPrimary,
                        crypto_id: selectedToken.id,
                        crypto_network_id: selectedNetwork.id,
                    }),
                    method: "POST",
                });
            } catch (error) {
                toast.error("Error updating primary wallet.");
            }
        } else {
            // console.log("No connected wallets.");
        }
    };

    const fetchCryptoPrices = async () => {
        if (tokens.length === 0) {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/crypto/prices`,
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
                const ethAddress = data.find((address) => address.address === "ERC20");
                if (ethAddress) {
                    setSelectedToken(
                        ethAddress.cryptos.find((token) => token.symbol === "ETH")
                    );
                    setSelectedNetwork(ethAddress);
                }
            } catch (error) {
                toast.error("Error fetching crypto prices.");
                console.error("Error fetching crypto prices:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const setToken = ({token, network}) => {
        setSelectedToken(token);
        setSelectedNetwork(network);
    };

    useEffect(() => {
        fetchCryptoPrices();
    }, [tokens]);

    useEffect(() => {
        fetchPresaleTransactionsByWallet();
        updatePrimaryWallet(address, true);
    }, [address]);

    useEffect(() => {
        fetchPresaleTransactionsByWallet();
    }, [token]);

    useEffect(() => {
        setPresaleTransactionsSum(
            presaleTransactions.reduce(
                (acc, tx) => acc + (parseFloat(tx.sbx_price) || 0),
                0
            )
        );
    }, [presaleTransactions]);

    // Calculate token to SBX conversion
    const calculateSbxAmount = (tokenAmt) => {
        if (!selectedToken || !whitelist.whitelistContent.sbxPrice) return "";
        const usdValue = tokenAmt * selectedToken?.price;
        const result = (usdValue / whitelist.whitelistContent.sbxPrice).toFixed(6);
        return result >= Number(process.env.REACT_APP_MIN_TOKENS_AMOUNT) &&
        result <= Number(process.env.REACT_APP_MAX_TOKENS_AMOUNT)
            ? result
            : 0;
    };

    // Calculate SBX to token conversion
    const calculateTokenAmount = (sbxAmt) => {
        if (!selectedToken || !whitelist.whitelistContent.sbxPrice || !sbxAmt)
            return "";
        const usdValue = sbxAmt * whitelist.whitelistContent.sbxPrice;
        return sbxAmt >= Number(process.env.REACT_APP_MIN_TOKENS_AMOUNT) &&
        sbxAmt <= Number(process.env.REACT_APP_MAX_TOKENS_AMOUNT)
            ? (usdValue / selectedToken?.price).toFixed(6)
            : 0;
    };

    const handleTokenAmountChange = (e) => {
        const value = e.target.value?.replace(/,/g, "");
        if (!value === "" || /^\d*\.?\d*$/.test(value)) {
            setTokenAmount(value);
            setSbxAmount(calculateSbxAmount(parseFloat(value)));
        }
    };

    // const prepareQRLink = (wallet, amount) => {
    //   console.log("wallet.address", wallet.address)
    //   return (
    //     wallet.crypto.prefix +
    //     ':' +
    //     wallet.address +
    //     '?amount=' +
    //     amount +
    //     '&label=' +
    //     wallet.name +
    //     '&message=Buy $SBX Tokens'
    //   )
    // }

    const prepareQRLink = useCallback((wallet, amount) => {
        // console.log("wallet.address", wallet.address);
        return (
            wallet.crypto.prefix +
            ":" +
            wallet.address +
            "?amount=" +
            amount +
            "&label=" +
            wallet.name +
            "&message=Buy $SBX Tokens"
        );
    }, []);

    const handleSbxAmountChange = (e) => {
        const value = e.target.value?.replace(/,/g, "");
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setSbxAmount(value);
            setTokenAmount(calculateTokenAmount(parseFloat(value)));
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setCustomAddress(text);
        } catch (err) {
            console.error("Clipboard read error:", err);
        }
    };

    return (
        <div
            id="buyNow"
            className="bg-gradient-to-r from-purple-200 to-blue-200 p-8 rounded-3xl mx-auto text-black w-[calc(100%-40px)] max-w-6xl border-1 shadow-2xl border-gray-400"
        >
            {/*{(tokenAmount || sbxAmount) && showWallets && (*/}
            {/*    <div className="mb-8 p-4 bg-gradient-to-r from-purple-200 to-blue-200 rounded-xl">*/}
            {/*        <h3 className="text-lg mb-2">Purchase Summary</h3>*/}
            {/*        <div className="flex justify-between items-center">*/}
            {/*            <span>*/}
            {/*                {tokenAmount} {selectedToken?.symbol}*/}
            {/*            </span>*/}
            {/*            <span className="text-gray-400">=</span>*/}
            {/*            <span>{sbxAmount} SBX</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}

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

                    {!address && (
                        <>
                            <div className="w-full bg-white p-4 rounded-lg mb-4">
                                <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-2">
                                    <input
                                        type="text"
                                        value={customAddress}
                                        onChange={(e) => setCustomAddress(e.target.value)}
                                        placeholder={`Paste your sending wallet ${selectedToken.name} address`}
                                        className="bg-transparent border-none outline-none w-full sm:flex-1 text-xl text-center sm:text-left"
                                    />
                                    <div
                                        className="flex justify-between gap-2 w-[230px]"
                                        // style={{ width: '200px' }}
                                    >
                                        <button
                                            onClick={handlePaste}
                                            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all font-bold text-sm text-white"
                                        >
                                            Paste
                                        </button>
                                        <button
                                            onClick={() => updatePrimaryWallet(customAddress, false)}
                                            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all font-bold text-sm text-white"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

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
                                className="bg-white rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-center"
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
                                    className="flex items-center justify-center bg-white hover:bg-gray-700 p-2 rounded-full mx-5"
                                >
                                    <CopyIcon className="w-5 h-5"/>
                                </button>
                                <CollapsibleQR
                                    value={prepareQRLink(wallet, tokenAmount)}
                                    address={wallet.address}
                                />
                            </div>
                        ))
                    )}


                </div>
            ) : (
                <div
                    //     style={
                    //     !token
                    //         ? {pointerEvents: 'none', filter: 'blur(4px)'}
                    //         : {}
                    // }
                >
                    {/* Step 1 - Token Selection */}
                    <div className="mb-8">
                        <h2 className="text-xl">Step 1 - Connect your wallet</h2>
                        <h2 className="text-lg mb-4">In order to buy $SBX you need to connect your wallet.</h2>
                        {(
                            <div className="flex items-center gap-4 mt-3 mb-3">
                                <ConnectButton/>

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
                        <h2 className="text-xl pb-2">Step 2 - Select the payment method</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {loading ? (
                                <LoadingSkeletons.TokenSelection/>
                            ) : (
                                <TokenDropdown
                                    networks={tokens}
                                    setTokenData={setToken}
                                    setTokenAmount={setTokenAmount}
                                    setSbxAmount={setSbxAmount}
                                />
                            )}
                        </div>
                    </div>

                    {/* Step 2 - Slider */}
                    <div className="mb-8 ">
                        <h2 className="text-xl">
                            Step 3 - Select the amount of tokens to purchase
                        </h2>
                        {selectedNetwork && selectedToken ? (
                            <div
                                className="bg-gradient-to-r from-purple-200 to-blue-200 pb-3 px-0.5 rounded-xl flex flex-col gap-2">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    Min{" "}
                      {Number(
                          process.env.REACT_APP_MIN_TOKENS_AMOUNT
                      )?.toLocaleString("en-US")}{" "}
                      $SBX
                  </span>
                                    <span>
                    Max{" "}
                                        {Number(
                                            process.env.REACT_APP_MAX_TOKENS_AMOUNT
                                        )?.toLocaleString("en-US")}{" "}
                                        $SBX
                  </span>
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
                        ) : (
                            ""
                        )}

                        <div
                            className="flex flex-col md:flex-row items-center md:justify-between gap-4 bg-gradient-to-r from-purple-200 to-blue-200 rounded-xl">
                            {/* First Input Group */}
                            <div className="flex items-center gap-2 bg-[#FFFFFF] p-4 rounded-lg w-full md:w-96">
                                <input
                                    type="text"
                                    value={Number(tokenAmount).toLocaleString("en-US")}
                                    onChange={handleTokenAmountChange}
                                    placeholder="0.00"
                                    className="bg-transparent border-none outline-none w-full text-xl"
                                />
                                <div className="flex items-center gap-2 min-w-fit">
                                    {selectedToken && (
                                        <img
                                            className="w-6"
                                            src={`/assets/images/crypto/color/${selectedToken?.icon}.svg`}
                                            alt={selectedToken?.icon}
                                        />
                                    )}
                                    <span>
                    {selectedNetwork && selectedToken
                        ? `${selectedNetwork.name} ${selectedToken.name}`
                        : "Select Token"}
                  </span>
                                </div>
                            </div>

                            {/* Equals Sign */}
                            <div className="text-black text-3xl">=</div>

                            {/* Second Input Group */}
                            <div className="flex items-center gap-2 bg-[#FFFFFF] p-4 rounded-lg w-full md:w-96">
                                <input
                                    type="text"
                                    value={Number(sbxAmount).toLocaleString("en-US")}
                                    onChange={handleSbxAmountChange}
                                    placeholder="0.00"
                                    className="bg-transparent border-none outline-none w-full text-xl"
                                />
                                <div className="flex items-center gap-2 min-w-fit">
                                    <div
                                        className="bg-gradient-to-r from-purple-100 to-purple-300 rounded-full p-1 w-6 h-6">
                                        <img
                                            className="w-full h-full object-contain"
                                            src={`/favicon.ico`}
                                            alt="sbxtoken"
                                        />
                                    </div>
                                    <span>SBX</span>
                                </div>
                            </div>
                        </div>
                    </div>

                        {address &&
                        inAppNetworks.includes(selectedNetwork?.address) &&
                        (chainRelation[selectedNetwork?.address] === chain.name ||
                            chainRelation[selectedNetwork?.address] === "Solana") ? (
                            <SendEthButton
                                amount={tokenAmount}
                                sbxAmount={sbxAmount}
                                selectedNetwork={selectedNetwork}
                                selectedToken={selectedToken}
                                updatePrimaryWallet={updatePrimaryWallet}
                            />
                        ) : (
                            <button
                                onClick={handleBuyClick}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all font-bold text-lg mb-4"
                                disabled={!selectedToken || !tokenAmount || !sbxAmount}
                            >
                                Buy Now
                            </button>
                        )}

                    <div
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 lg:mb-8 p-4 sm:p-6 bg-gradient-to-r from-slate-50 to-blue-50 border border-blue-100/50 rounded-xl shadow-sm">
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-1">
                                Transactions List
                            </h2>
                            <p className="text-sm text-slate-600 font-medium">
                                Recent presale transactions and allocations
                            </p>
                        </div>

                        <div className="flex flex-col sm:items-end gap-1">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Total Allocated
        </span>
                            <div className="flex items-center gap-2">
            <span className="text-xl lg:text-2xl font-bold text-purple-700">
                {Number(presaleTransactionsSum.toFixed(6))?.toLocaleString("en-US")}
            </span>
                                <span
                                    className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">
                $SBX
            </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        {/* Mobile Card Layout */}
                        <div className="block lg:hidden space-y-4">
                            {presaleTransactions.map((wallet) => (
                                <div
                                    key={wallet.id}
                                    className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border border-blue-100/50 rounded-xl shadow-lg shadow-blue-100/20 p-4 sm:p-6"
                                >
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-5">
                                        <div
                                            className="absolute top-0 right-0 w-16 h-16 bg-blue-400 rounded-full -translate-y-8 translate-x-8"></div>
                                        <div
                                            className="absolute bottom-0 left-0 w-12 h-12 bg-purple-400 rounded-full translate-y-6 -translate-x-6"></div>
                                    </div>

                                    <div className="relative z-10 space-y-4">
                                        {/* Header with Status */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span
                                                        className="text-xs font-medium text-slate-500 uppercase tracking-wide">Wallet Address</span>
                                                    <button
                                                        onClick={() => handleCopy(wallet.wallet_address)}
                                                        className="inline-flex items-center justify-center w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors duration-200"
                                                    >
                                                        <CopyIcon className="w-3 h-3 text-slate-600"/>
                                                    </button>
                                                </div>
                                                <p className="text-sm font-mono text-slate-800 break-all leading-relaxed">
                                                    {wallet.wallet_address}
                                                </p>
                                            </div>
                                            <div className="ml-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  wallet.transaction_confirmation === 'Confirmed'
                      ? 'bg-green-100 text-green-700'
                      : wallet.transaction_confirmation === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
              }`}>
                {wallet.transaction_confirmation}
              </span>
                                            </div>
                                        </div>

                                        {/* Transaction Details Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                            <span
                                className="text-xs font-medium text-slate-500 uppercase tracking-wide">$SBX Allocated</span>
                                                <p className="text-lg font-bold text-purple-700">
                                                    {parseFloat(wallet.sbx_price).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                            <span
                                className="text-xs font-medium text-slate-500 uppercase tracking-wide">USDT Amount</span>
                                                <p className="text-lg font-bold text-green-700">
                                                    ${parseFloat(wallet.usdt_amount).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                            <span
                                className="text-xs font-medium text-slate-500 uppercase tracking-wide">Token Amount</span>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {parseFloat(wallet.amount).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <span
                                                    className="text-xs font-medium text-slate-500 uppercase tracking-wide">Payment</span>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {wallet?.crypto?.name}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Network and Transaction */}
                                        <div className="pt-3 border-t border-slate-200/60">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="space-y-1">
                              <span
                                  className="text-xs font-medium text-slate-500 uppercase tracking-wide">Network</span>
                                                    <p className="text-sm font-semibold text-blue-700">
                                                        {wallet?.crypto_network?.name}
                                                    </p>
                                                </div>
                                                <div className="text-right space-y-1">
                                                    <span
                                                        className="text-xs font-medium text-slate-500 uppercase tracking-wide">Date</span>
                                                    <p className="text-sm font-medium text-slate-700">
                                                        {new Date(wallet.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span
                                                        className="text-xs font-medium text-slate-500 uppercase tracking-wide">Transaction Hash</span>
                                                    <button
                                                        onClick={() => handleCopy(wallet.txn_id)}
                                                        className="inline-flex items-center justify-center w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors duration-200"
                                                    >
                                                        <CopyIcon className="w-3 h-3 text-slate-600"/>
                                                    </button>
                                                </div>
                                                <p className="text-xs font-mono text-slate-600 break-all leading-relaxed">
                                                    {wallet.txn_id}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table Layout */}
                        <div className="hidden lg:block overflow-x-auto">
                            <div
                                className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border border-blue-100/50 rounded-2xl shadow-xl shadow-blue-100/20">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-5">
                                    <div
                                        className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full -translate-y-16 translate-x-16"></div>
                                    <div
                                        className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400 rounded-full translate-y-12 -translate-x-12"></div>
                                </div>

                                <div className="relative z-10 overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                        <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                                            <th className="px-4 xl:px-6 py-4 text-left text-sm xl:text-base font-semibold uppercase tracking-wide">
                                                Address
                                            </th>
                                            <th className="px-4 xl:px-6 py-4 text-left text-sm xl:text-base font-semibold uppercase tracking-wide">
                                                $SBX Allocated
                                            </th>
                                            <th className="px-4 xl:px-6 py-4 text-left text-sm xl:text-base font-semibold uppercase tracking-wide">
                                                USDT Amount
                                            </th>
                                            <th className="px-4 xl:px-6 py-4 text-left text-sm xl:text-base font-semibold uppercase tracking-wide">
                                                Token Amount
                                            </th>
                                            <th className="px-4 xl:px-6 py-4 text-left text-sm xl:text-base font-semibold uppercase tracking-wide">
                                                Payment Token
                                            </th>
                                            <th className="px-4 xl:px-6 py-4 text-left text-sm xl:text-base font-semibold uppercase tracking-wide">
                                                Network
                                            </th>
                                            <th className="px-4 xl:px-6 py-4 text-left text-sm xl:text-base font-semibold uppercase tracking-wide">
                                                Status
                                            </th>
                                            <th className="px-4 xl:px-6 py-4 text-left text-sm xl:text-base font-semibold uppercase tracking-wide">
                                                Transaction Hash
                                            </th>
                                            <th className="px-4 xl:px-6 py-4 text-left text-sm xl:text-base font-semibold uppercase tracking-wide">
                                                Date/Time
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white/60 backdrop-blur-sm">
                                        {presaleTransactions.map((wallet, index) => (
                                            <tr
                                                key={wallet.id}
                                                className={`border-b border-purple-200/50 hover:bg-white/40 transition-colors duration-200 ${
                                                    index === presaleTransactions.length - 1 ? 'border-b-0' : ''
                                                }`}
                                            >
                                                <td className="px-4 xl:px-6 py-4">
                                                    {wallet.wallet_address && <div className="flex items-center gap-2">
                                                        <p className="text-sm font-mono text-slate-800 leading-relaxed"
                                                           title={wallet.wallet_address}>
                                                            {`${wallet.wallet_address?.slice(0, 6)}...${wallet.wallet_address?.slice(-4)}`}
                                                        </p>
                                                        <button
                                                            onClick={() => handleCopy(wallet.wallet_address)}
                                                            className="inline-flex items-center justify-center w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors duration-200 flex-shrink-0"
                                                        >
                                                            <CopyIcon className="w-4 h-4 text-slate-600"/>
                                                        </button>
                                                    </div>}
                                                </td>
                                                <td className="px-4 xl:px-6 py-4">
                                                    <span className="font-bold text-purple-700 text-sm xl:text-base">
                                                        {parseFloat(wallet.sbx_price).toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-4 xl:px-6 py-4">
                                                    <span className="font-bold text-green-700 text-sm xl:text-base">
                                                        ${parseFloat(wallet.usdt_amount).toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-4 xl:px-6 py-4">
                                                    <span className="font-semibold text-slate-800 text-sm xl:text-base">
                                                        {parseFloat(wallet.amount).toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-4 xl:px-6 py-4">
                                                    <span
                                                        className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs xl:text-sm font-semibold">
                                                        {wallet?.crypto?.name}
                                                    </span>
                                                </td>
                                                <td className="px-4 xl:px-6 py-4">
                                                    <span
                                                        className="inline-block bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs xl:text-sm font-semibold">
                                                        {wallet?.crypto_network?.name}
                                                    </span>
                                                </td>
                                                <td className="px-4 xl:px-6 py-4">
                                                    {wallet.transaction_confirmation &&
                                                        <span title={wallet.transaction_confirmation}
                                                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                                                  wallet.transaction_confirmation?.slice(0, 9) === 'Confirmed'
                                                                      ? 'bg-green-100 text-green-700'
                                                                      : wallet.transaction_confirmation?.slice(0, 8) === 'manually'
                                                                          ? 'bg-yellow-100 text-yellow-700'
                                                                          : 'bg-red-100 text-red-700'
                                                              }`}>
                                                        {wallet.transaction_confirmation?.slice(0, 9)}
                                                    </span>}
                                                </td>
                                                <td className="px-4 xl:px-6 py-4">
                                                    {wallet.txn_id && <div className="flex items-center gap-2">
                                                        <p className="text-sm font-mono text-slate-800 leading-relaxed"
                                                           title={wallet.txn_id}>
                                                            {`${wallet.txn_id?.slice(0, 6)}...${wallet.txn_id?.slice(-4)}`}
                                                        </p>
                                                        <button
                                                            onClick={() => handleCopy(wallet.txn_id)}
                                                            className="inline-flex items-center justify-center w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors duration-200 flex-shrink-0"
                                                        >
                                                            <CopyIcon className="w-4 h-4 text-slate-600"/>
                                                        </button>
                                                    </div>}
                                                </td>
                                                <td className="px-4 xl:px-6 py-4">
                                                    <div className="text-sm xl:text-base font-medium text-slate-700">
                                                        <div>{new Date(wallet.created_at).toLocaleDateString()}</div>
                                                        <div className="text-xs text-slate-500">
                                                            {new Date(wallet.created_at).toLocaleTimeString()}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Empty State */}
                        {presaleTransactions.length === 0 && (
                            <div className="text-center py-12 lg:py-16">
                                <div
                                    className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">No transactions found</h3>
                                <p className="text-slate-600">Presale transactions will appear here once they are
                                    processed.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// export default TokenPurchase
export default React.memo(TokenPurchase);
