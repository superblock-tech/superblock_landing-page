import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import {CopyIcon, RightArrow} from "../Icons";
import toast from "react-hot-toast";
import {ConnectKitButton} from "connectkit";
import CryptoPurchaseSteps from "../components/CryptoPurchaseSteps";
import Footer from "../components/Footer";
import HowToBuy from "../components/HowToBuy";
import Phace1 from "../components/Phace1";

export default function ProfilePage() {
    const navigate = useNavigate();
    const {logout} = useContext(AuthContext);

    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const fetchWallets = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/wallet`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            // Check if user is unauthorized
            if (response.status === 401) {
                handleLogout()
                return;
            }

            const data = await response.json();
            setWallets(data);

        } catch (error) {
            toast.error("Error fetching wallets.");
            console.error("Error fetching wallets:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    useEffect(() => {
        fetchWallets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section>
            <div class="container">
                <div className="p-6 flex flex-col md:flex-row justify-center items-center gap-8">
                    <Phace1/>
                    <div className="w-full md:w-1/2 justify-center bg-gray-200 text-gray-500 rounded-lg p-10">
                        {/*<h1 className="text-4xl text-black mb-6">Superblock Wallets</h1>*/}

                        {/* Wallets List */}
                        <div className="mt-10 w-full max-w-2xl mx-auto px-4 justify-center">
                            {/* Loading animation */}
                            {loading ? (
                                <div className="flex items-center justify-center mt-6">
                                    {/* Simple Tailwind spinner */}
                                    <div
                                        className="w-8 h-8 border-4 border-blue-400 border-t-transparent border-solid rounded-full animate-spin"></div>
                                </div>
                            ) : wallets.length === 0 ? (
                                /* If no wallets found after loading */
                                <p className="text-center text-gray-700">No wallets found.</p>
                            ) : (
                                /* Render wallets */
                                wallets.map((wallet) => (
                                    <div
                                        key={wallet.id}
                                        className="bg-white rounded-lg shadow-lg p-4 mb-6 flex items-center"
                                    >
                                        {/* Wallet icon */}
                                        <img
                                            src={`https://nomad-parners.online/storage/${wallet.icon}`}
                                            alt="wallet icon"
                                            className="w-12 h-12 rounded-full mr-4 object-cover"
                                            onError={(e) => {
                                                // fallback if icon doesn't load
                                                e.target.src = "assets/images/crypto-wallet.png";
                                            }}
                                        />

                                        {/* Wallet info */}
                                        <div className="flex-1">
                                            <h2 className="font-bold text-xl">{wallet.name}</h2>
                                            <p className="text-gray-600 text-sm break-all">{wallet.address}</p>
                                        </div>

                                        {/* Copy to clipboard button */}
                                        <button
                                            onClick={() => handleCopy(wallet.address)}
                                            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                                        >
                                            <CopyIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        <ConnectKitButton/>
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="rounded-[12px] flex items-center py-[6.58px] px-[20px] gap-[24px]
                   bg-gradient-to-r from-[#1BA3FF] to-[#7B36B6]
                   hover:from-[#7B36B6] hover:to-[#1BA3FF]
                   transition-all duration-300 mt-8 mb-8"
                        >
        <span className="text-white text-[16px] leading-[29.87px] font-[450]">
          Logout
        </span>
                            <RightArrow/>
                        </button>
                    </div>
                </div>
            </div>
            <div
                className="bg-cover bg-no-repeat min-h-screen flex flex-col items-center mt-10"
                style={{backgroundImage: "url('assets/images/bg.png')"}}
            >

                {/* Connect Wallet Button */}

                <CryptoPurchaseSteps/>
                <HowToBuy/>
                <Footer/>
            </div>
        </section>
    );
}
