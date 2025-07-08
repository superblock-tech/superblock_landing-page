import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

import CryptoPurchaseSteps from "../components/CryptoPurchaseSteps";
import Footer from "../components/Footer";
import HowToBuy from "../components/HowToBuy";
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
    const [whitelistContent, setWhitelistContent] = useState(null);

    const fetchWhitelistContent = async () => {
        if (!whitelistContent) {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/whitelist`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (response.status === 401) {
                    return;
                }

                const content = await response.json();
                setWhitelistContent(content.data);
            } catch (error) {
                toast.error("Error fetching whitelist content.");
                console.error("Error fetching whitelist content:", error);
            }
        }
    };

    useEffect(() => {
        fetchWhitelistContent();
    }, []);

    useEffect(() => {

        if (!whitelistContent?.startedAt || !whitelistContent?.finishedAt) return;

        const start = whitelistContent.startedAt * 1000;
        const end = whitelistContent.finishedAt * 1000;

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
            const percentage = Math.min(100, Math.max(0, (whitelistContent.sbxAllocated / whitelistContent.sbxTotal) * 100));
            setProgress(percentage);
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [whitelistContent]);




    return (<section>
        <div className="container mx-auto px-6 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Panel */}
                <div
                    className="bg-gradient-to-r from-purple-200 to-blue-200 text-white rounded-3xl p-10 flex flex-col justify-between">
                    <h1 className="text-[30.219px] sm:text-[40.974px] leading-[42.219px] sm:leading-[50px] font-futura-bold font-bold text-transparent bg-clip-text bg-multi-color-gradient bg-size-800 animate-colorCycle text-left w-fit">
                        $SBX Token Presale
                        <br/>
                        Phase 1
                    </h1>
                    <p className="text-2xl font-semibold mt-3 text-[#7b36b6]">
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
                    className="bg-gradient-to-r from-purple-500 to-blue-400 text-white  rounded-3xl p-10 flex flex-col justify-between">
                    <h2 className="text-3xl font-bold mb-4 text-right tracking-wide">
                        Phase Ends In:
                    </h2>
                    <div className="grid grid-cols-4 gap-2 text-center mb-6">
                        {Object.entries(timeLeft).map(([unit, value]) => (
                            <div key={unit} className="bg-white bg-opacity-20 rounded-lg p-2">
                                <div className="text-xl md:text-3xl lg:text-5xl font-bold">
                                    {String(value).padStart(2, '0')}
                                </div>
                                <div className="text-xs md:text-sm lg:text-sm uppercase mt-1 font-semibold">{unit}</div>
                            </div>
                        ))}
                    </div>

                    <div className="relative w-full h-6 bg-white bg-opacity-30 rounded-full overflow-hidden mb-5">
                        <div
                            className="h-full bg-white bg-opacity-80 transition-all duration-1000"
                            style={{width: `${progress}%`}}
                        />
                        <span
                            className="absolute inset-0 flex items-center justify-center text-lg md:text-base font-bold text-[#7b36b6]">
                            {progress.toFixed(2) + '% $SBX Allocated'}
                        </span>
                    </div>
                    <div className="text-xl font-medium space-y-1 text-right">
                        <p className="underline">{whitelistContent?.name}</p>
                        <p><span className="font-bold">1 $SBX = ${whitelistContent?.sbxPrice}</span></p>
                        <p className="underline">Next&nbsp;
                            <span>{whitelistContent?.nameNext}</span>
                        </p>
                        <p>
                            <span className="font-bold">1 $SBX = ${whitelistContent?.sbxPriceNext}</span>
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div
                    className="bg-gradient-to-r from-purple-200 to-blue-200 rounded-3xl p-10 flex flex-col justify-center text-[#7b36b6]">
                    <div className="flex flex-col gap-10 text-center">
                        <div>
                            <p className="text-lg mb-1 tracking-wide">Total USDT Amount Raised</p>
                            <p className="text-xl lg:text-3xl font-extrabold">{Number(whitelistContent?.usdtRaised).toLocaleString('en-US')}</p>
                        </div>
                        <div>
                            <p className="text-lg mb-1 tracking-wide">
                                {whitelistContent?.name?.split(' - ')[0]}
                                <span className="mx-2">—</span>
                                $SBX Allocated
                            </p>
                            <p className="text-xl lg:text-3xl font-extrabold">
                            { Number(whitelistContent?.sbxAllocated).toLocaleString('en-US') }
                                <span className="mx-2">/</span>
                                { Number(whitelistContent?.sbxTotal).toLocaleString('en-US') }
                            </p>
                        </div>
                        <div>
                            <p className="text-lg mb-1 tracking-wide">Total Holders</p>
                            <p className="text-xl lg:text-3xl font-extrabold">{ whitelistContent?.holders }</p>
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
                    <TokenPurchase whitelistContent={whitelistContent}/>
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
