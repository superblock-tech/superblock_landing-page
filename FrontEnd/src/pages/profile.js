import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import {RightArrow} from "../Icons";
import toast from "react-hot-toast";
import {ConnectKitButton} from "connectkit";

import CryptoPurchaseSteps from "../components/CryptoPurchaseSteps";
import Footer from "../components/Footer";
import HowToBuy from "../components/HowToBuy";
import Phace1 from "../components/Phace1";
import LoginDialog from "../components/LoginDialog";
import TokenPurchase from "../components/TokenPurchase";
import FlexStagesTable from "../components/FlexStagesTable";
import "@fontsource/montserrat"; // Defaults to weight 400
import "@fontsource/montserrat/400.css"; // Specify weight
import "@fontsource/montserrat/400-italic.css"; // Specify weight and style

export default function ProfilePage() {
    const navigate = useNavigate();
    const {logout} = useContext(AuthContext);
    const {token} = useContext(AuthContext);

    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        logout();
    };

    const fetchWallets = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/wallet`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            // // Check if user is unauthorized
            // if (response.status === 401) {
            //     // handleLogout()
            //     return;
            // }

            const data = await response.json();
            setWallets(data);

        } catch (error) {
            navigate("/");
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
    const calculateTimeLeft = () => {
        const difference = +new Date("2025-06-01T01:00:00") - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                d: Math.floor(difference / (1000 * 60 * 60 * 24)),
                h: Math.floor((difference / (1000 * 60 * 60)) % 24),
                m: Math.floor((difference / 1000 / 60) % 60),
                s: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchWallets();
    }, []);

    return (<section>
        <div class="container">
            <div className="p-6 flex flex-col md:flex-row justify-center items-center gap-8">
                <Phace1/>
                <div class=" w-full md:w-1/3 ">
                    <div
                        className=" bg-gradient-to-r from-purple-500  to-blue-400 text-white rounded-2xl p-4 py-3  mt-6"
                    >
                        <h2 style={{
                            fontFamily: 'Montserrat',
                            fontWeight: 700,
                            textAlign: 'right',
                            fontSize: '1.5rem'
                        }}>Phase Ends In:</h2>
                        <div
                            className="flex justify-center bg-gradient-to-r from-purple-500  to-blue-400 text-white rounded-2xl p-4 py-8 mt-4">
                            {Object.entries(timeLeft).map(([unit, value], index) => (
                                <div key={unit} className="text-center px-5">
                            <span className="text-5xl font-bold text-white"
                                  style={{fontFamily: 'Montserrat', fontWeight: 700}}>
                                {String(value).padStart(2, "0")}
                                <span className=" uppercase text-white" style={{fontSize: '2rem'}}>{unit}</span>
                            </span>

                                </div>
                            ))}
                        </div>
                        {/* Header Stats */}
                        <div className={token ? 'flex justify-between mb-6' : 'flex justify-end mb-6'}>
                            {token &&
                                <div>
                                    {/* Header Stats */}
                                    {(<div>
                                        <div>
                                            <div className="text-xl">USDT Raised</div>
                                            <div className="text-2xl font-bold">18.92</div>
                                            <div className="text-xl">Transactions</div>
                                            <div className="text-2xl font-bold">5</div>
                                        </div>
                                    </div>)}

                                </div>
                            }
                            <div style={{fontFamily: 'Montserrat', fontWeight: 700, fontSize: '1.5rem'}}
                                 className="text-right">
                                <div className="text-xl">USD Raised:&nbsp;
                                    <span className="text-2xl font-bold">44.91</span>
                                </div>

                                <div className="text-xl">$SBX Tokens Allocated:&nbsp;
                                    <span className="text-2xl font-bold">14.67 / 10 000 000</span>
                                </div>
                                <div className="text-xl">Holders:&nbsp;
                                    <span className="text-2xl font-bold">3</span>
                                </div>
                            </div>


                        </div>
                        {token &&

                            <div className="flex items-center gap-4 mt-8 mb-8">
                                <ConnectKitButton/>

                                <button
                                    onClick={handleLogout}
                                    className="rounded-[12px] flex items-center py-[6.58px] px-[20px] gap-[24px]
                     bg-gradient-to-r from-[#1BA3FF] to-[#7B36B6]
                     hover:from-[#7B36B6] hover:to-[#1BA3FF]
                     transition-all duration-300"
                                >
          <span className="text-white text-[16px] leading-[29.87px] font-[450]">
            Logout
          </span>
                                    <RightArrow/>
                                </button>

                            </div>
                        }
                    </div>
                </div>
            </div>
            <div class="container">
                <div className="p-6 flex flex-col md:flex-row justify-center items-stretch gap-8">
                    <div
                        className="flex flex-col md:flex-row justify-between items-stretch md:items-stretch bg-gradient-to-r from-purple-500  to-blue-400 text-white p-6 rounded-2xl shadow-lg space-y-6 md:space-y-0 md:space-x-8">
                        <div className="flex flex-col">
                            <p className="text-xl md:text-2xl font-semibold">Phase 1 (Invite Only): </p>
                            <p className="text-xl md:text-2xl font-semibold">1 $SBX = $0.220</p>
                        </div>
                        <div className="border-l md:border-l-2 border-gray-700 h-0 md:h-16 w-full md:w-auto"/>
                        <div className="flex flex-col">
                            <p className="text-xl md:text-2xl font-semibold">Next: Phase 2 (Public Presale)</p>
                            <p className="text-xl md:text-2xl font-semibold">Public Presale Launch Price = $0.310</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div
            className="bg-cover bg-no-repeat min-h-screen flex flex-col items-center mt-10"
            style={{backgroundImage: "url('assets/images/bg.png')"}}
        >
            <div style={{position: 'relative'}} className="w-full relative ">
                <div>
                    <TokenPurchase/>
                </div>

                {!token && (<div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10,
                    }}
                >
                    <LoginDialog isOpen={true}/>
                </div>)}

            </div>

            <CryptoPurchaseSteps/>
            <FlexStagesTable/>
            {/* Connect Wallet Button */}
            <HowToBuy/>
            <Footer/>
        </div>
    </section>);
}
