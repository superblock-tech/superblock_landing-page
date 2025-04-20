import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

import CryptoPurchaseSteps from "../components/CryptoPurchaseSteps";
import Footer from "../components/Footer";
import HowToBuy from "../components/HowToBuy";
import Phace1 from "../components/Phace1";
import LoginDialog from "../components/LoginDialog";
import TokenPurchase from "../components/TokenPurchase";
import FlexStagesTable from "../components/FlexStagesTable";
import "@fontsource/montserrat"; // Defaults to weight 400
import "@fontsource/montserrat/400.css"; // Specify weight
import "@fontsource/montserrat/400-italic.css";

export default function ProfilePage() {
    const navigate = useNavigate();
    const {logout} = useContext(AuthContext);
    const {token} = useContext(AuthContext);

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [wallets, setWallets] = useState([]);

    const fetchWallets = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/wallet`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

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

    useEffect(() => {
        const start = new Date("2025-04-01T00:00:00Z").getTime();
        const end = new Date("2025-06-01T00:00:00Z").getTime();

        const update = () => {
            const now = new Date().getTime();
            const diff = Math.max(0, end - now);
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);
            setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });

            const totalDuration = end - start;
            const elapsed = now - start;
            const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
            setProgress(percentage);
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        fetchWallets();
    }, []);

    return (<section>
        <div className="container mx-auto px-6 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Panel */}
                <div
                    className="bg-gradient-to-r from-purple-200 to-blue-200 text-white rounded-2xl p-10 flex flex-col justify-between">
                    <h1 className="text-[30.219px] sm:text-[40.974px] leading-[42.219px] sm:leading-[79.974px] font-futura-bold font-bold text-transparent bg-clip-text bg-multi-color-gradient bg-size-800 animate-colorCycle text-left w-fit">
                        $SBX Token Presale<br/>Phase 1
                    </h1>
                    <p className="text-2xl font-semibold mt-6 text-black">
                        Founders Circle Presale. Invite only.
                    </p>
                    <div className="mt-10 flex flex-col gap-6">
                        <button
                            onClick={() => {
                                document.getElementById('buyNow').scrollIntoView()
                                window.scrollTo(0, window.scrollY - 80)
                            }}
                            className="w-full py-[8px] text-[24px] leading-[29.87px] font-[450] text-white bg-gradient-to-r from-[#1BA3FF] to-[#7B36B6] hover:from-[#7B36B6] hover:to-[#1BA3FF] transition-all duration-300 rounded-[12px]">
                            Access presale
                        </button>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={() => {
                                    document.getElementById('howToBuy').scrollIntoView()
                                    window.scrollTo(0, window.scrollY - 80)
                                }}
                                className="text-[#7B36B6] text-[16px] sm:text-[20px] font-[450] underline whitespace-nowrap">
                                How To Buy
                            </button>
                            <button
                                onClick={() => {
                                    document.getElementById('tokenDistribution').scrollIntoView()
                                    window.scrollTo(0, window.scrollY - 80)
                                }}
                                className="text-[#7B36B6] text-[16px] sm:text-[20px] font-[450] underline whitespace-nowrap">
                                Token Distribution
                            </button>
                        </div>
                    </div>
                </div>

                {/* Countdown */}
                <div
                    className="bg-gradient-to-r from-purple-500 to-blue-400 text-white rounded-2xl px-6 py-4 flex flex-col justify-between">
                    <h2 className="text-3xl font-bold mb-4 text-right tracking-wide">
                        Phase Ends In:
                    </h2>
                    <div className="grid grid-cols-4 gap-2 text-center mb-4">
                        {Object.entries(timeLeft).map(([unit, value]) => (
                            <div key={unit}>
                                <div className="text-7xl font-bold">
                                    {String(value).padStart(2, '0')}
                                </div>
                                <div className="text-xl uppercase mt-1 font-semibold">{unit}</div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full h-3 bg-white bg-opacity-30 rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-white bg-opacity-80 transition-all duration-1000"
                             style={{width: `${progress}%`}}></div>
                    </div>
                    <div className="text-xl font-medium space-y-1 text-right">
                        <p className="text-left">Phase 1 (Invite Only): <span
                            className="font-bold">1 $SBX = $0.220</span></p>
                        <p>Next: <span className="font-semibold">Phase 2 (Public Presale)</span></p>
                        <p>Launch Price: <span className="font-bold">$0.310</span></p>
                    </div>
                </div>

                {/* Stats */}
                <div
                    className="flex flex-col md:flex-row justify-between items-stretch md:items-stretch bg-gradient-to-r from-purple-500  to-blue-400 text-white p-6 rounded-2xl shadow-lg space-y-6 md:space-y-0 md:space-x-8">
                    <div className="flex flex-col">
                        <p className="text-xl">
                            USD Raised:&nbsp;
                        </p>
                        <p className="text-2xl font-bold">44.91</p>
                    </div>
                    <div className="border-l md:border-l-2 border-gray-700 h-0 md:h-16 w-full md:w-auto"/>
                    <div className="flex flex-col">
                        <p className="text-xl">
                            $SBX Tokens Allocated:&nbsp;
                        </p>
                        <p className="text-2xl font-bold">
                            14.67 / 10 000 000
                        </p>
                    </div>
                    <div className="border-l md:border-l-2 border-gray-700 h-0 md:h-16 w-full md:w-auto"/>
                    <div className="flex flex-col">
                        <p className="text-xl">
                            Holders:&nbsp;
                        </p>
                        <p className="text-2xl font-bold">3</p>
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

            <FlexStagesTable/>
            <CryptoPurchaseSteps/>
            <HowToBuy/>
            <Footer/>
        </div>
    </section>)
        ;
}
