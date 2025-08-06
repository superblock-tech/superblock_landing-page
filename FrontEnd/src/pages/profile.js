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
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [whitelistContent, setWhitelistContent] = useState(null);

    const fetchWhitelistContent = async () => {
        if (!whitelistContent) {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/whitelist`);

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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-12 gap-4 lg:gap-6">
                {/* Presale Info Card - Tall */}
                <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-2">
                    <div
                        className="relative h-full overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 border border-purple-100/50 rounded-2xl p-6 lg:p-8 shadow-lg shadow-purple-100/20">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div
                                className="absolute top-0 right-0 w-24 h-24 bg-purple-400 rounded-full -translate-y-12 translate-x-12"></div>
                            <div
                                className="absolute bottom-0 left-0 w-20 h-20 bg-blue-400 rounded-full translate-y-10 -translate-x-10"></div>
                        </div>

                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                                <div className="mb-8">
                                    <h1 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 mb-4 leading-tight">
                                        $SBX Token Presale
                                        <br/>
                                        Phase 2
                                    </h1>
                                    <div
                                        className="inline-block px-4 py-2 rounded-full text-md font-semibold bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 mb-2 border border-purple-200/40">
                                        Public Presale. Open to everyone.
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 gap-4 mb-8">
                                    <div
                                        className="bg-white/70 backdrop-blur-sm border border-blue-200/30 rounded-xl p-4 hover:bg-white/80 transition-colors duration-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Total
                                                    Raised</p>
                                                <p className="text-xl font-bold text-emerald-600">
                                                    ${Number(whitelistContent?.usdtRaised).toLocaleString('en-US')}
                                                </p>
                                            </div>
                                            <div
                                                className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-emerald-600" fill="currentColor"
                                                     viewBox="0 0 20 20">
                                                    <path
                                                        d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                                                    <path fillRule="evenodd"
                                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="bg-white/70 backdrop-blur-sm border border-blue-200/30 rounded-xl p-4 hover:bg-white/80 transition-colors duration-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Token
                                                    Allocation</p>
                                                <p className="text-lg font-bold text-blue-600">
                                                    {Number(whitelistContent?.sbxAllocated).toLocaleString('en-US')}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    of {Number(whitelistContent?.sbxTotal).toLocaleString('en-US')} total
                                                </p>
                                            </div>
                                            <div
                                                className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-blue-600" fill="currentColor"
                                                     viewBox="0 0 20 20">
                                                    <path
                                                        d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="bg-white/70 backdrop-blur-sm border border-blue-200/30 rounded-xl p-4 hover:bg-white/80 transition-colors duration-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Participants</p>
                                                <p className="text-2xl font-bold text-purple-600">{whitelistContent?.holders}</p>
                                            </div>
                                            <div
                                                className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-purple-600" fill="currentColor"
                                                     viewBox="0 0 20 20">
                                                    <path
                                                        d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Section */}
                            <div className="space-y-4">
                                <button
                                    onClick={() => {
                                        const element = document.getElementById('buyNow');
                                        if (element) {
                                            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                                            window.scrollTo({top: elementPosition - 80, behavior: 'smooth'});
                                        }
                                    }}
                                    className="w-full py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#1BA3FF] to-[#7B36B6] hover:from-[#7B36B6] hover:to-[#1BA3FF] transform hover:scale-[1.02] transition-all duration-300 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                                >
                                    Access Presale
                                </button>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => {
                                            const element = document.getElementById('howToBuy');
                                            if (element) {
                                                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                                                window.scrollTo({top: elementPosition - 80, behavior: 'smooth'});
                                            }
                                        }}
                                        className="flex items-center justify-center py-2 px-4 text-[#7B36B6] hover:text-white hover:bg-purple-600 text-sm font-medium border border-purple-200 rounded-lg transition-all duration-200"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        Guide
                                    </button>
                                    <button
                                        onClick={() => {
                                            const element = document.getElementById('tokenDistribution');
                                            if (element) {
                                                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                                                window.scrollTo({top: elementPosition - 80, behavior: 'smooth'});
                                            }
                                        }}
                                        className="flex items-center justify-center py-2 px-4 text-[#7B36B6] hover:text-white hover:bg-purple-600 text-sm font-medium border border-purple-200 rounded-lg transition-all duration-200"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-6a2 2 0 01-2-2z"/>
                                        </svg>
                                        Tokenomics
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Countdown Timer Card - Wide */}
                <div className="col-span-12 md:col-span-6 lg:col-span-8">
                    <div
                        className="relative h-full overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 text-white rounded-2xl p-6 lg:p-8 shadow-lg shadow-purple-500/30">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div
                                className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-y-16 -translate-x-16"></div>
                            <div
                                className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-y-12 translate-x-12"></div>
                        </div>

                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl lg:text-2xl font-bold mb-2 tracking-wide">Phase Ends In:</h2>
                                    <p className="text-white/80 text-md font-medium">Founders Circle Presale</p>
                                </div>
                                <div
                                    className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                                    <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Progress</p>
                                    <p className="text-lg font-bold">{progress.toFixed(1)}% Complete</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-3 lg:gap-4 text-center mb-6">
                                {Object.entries(timeLeft).map(([unit, value]) => (
                                    <div key={unit}
                                         className="bg-white/15 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-white/20">
                                        <div className="text-xl lg:text-3xl font-bold mb-1">
                                            {String(value).padStart(2, '0')}
                                        </div>
                                        <div className="text-xs uppercase font-semibold text-white/90 tracking-wide">
                                            {unit}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="relative w-full h-3 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-1000 rounded-full"
                                        style={{width: `${progress}%`}}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                        <p className="text-s, font-medium text-slate-100 uppercase tracking-wider mb-2">Current
                                            Phase</p>
                                        <p className="text-md font-bold text-purple-100 mb-1">{whitelistContent?.name}</p>
                                        <p className="text-lg font-bold text-emerald-100">1 $SBX =
                                            ${whitelistContent?.sbxPrice}</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                        <p className="text-sm font-medium text-slate-100 uppercase tracking-wider mb-2">Next
                                            Phase</p>
                                        <p className="text-md font-bold text-slate-100 mb-1">{whitelistContent?.nameNext}</p>
                                        <p className="text-lg font-bold text-orange-100">1 $SBX =
                                            ${whitelistContent?.sbxPriceNext}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-8">
                    <div
                        className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-100/50 rounded-2xl p-6 lg:p-8 shadow-lg shadow-emerald-100/20">
                        <div className="absolute inset-0 opacity-5">
                            <div
                                className="absolute top-0 right-0 w-24 h-24 bg-emerald-400 rounded-full -translate-y-12 translate-x-12"></div>
                            <div
                                className="absolute bottom-0 left-0 w-20 h-20 bg-teal-400 rounded-full translate-y-10 -translate-x-10"></div>
                        </div>

                        <div className="relative z-10 flex flex-col">
                            <div className="mb-6">
                                <h3 className="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-2">
                                    Token Economics
                                </h3>
                                <p className="text-sm text-slate-600 font-medium">Key metrics and tokenomics
                                    overview</p>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
                                <div
                                    className="bg-white/60 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-4 text-center">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Total
                                        Allocated</p>
                                    <p className="text-lg font-bold text-emerald-700">2.96M</p>
                                </div>

                                <div
                                    className="bg-white/60 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-4 text-center">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Burn
                                        Reserve</p>
                                    <p className="text-lg font-bold text-orange-600">7.04M</p>
                                </div>

                                <div
                                    className="bg-white/60 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-4 text-center">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Circulating
                                        Supply</p>
                                    <p className="text-lg font-bold text-blue-700">35.6M</p>
                                </div>

                                <div
                                    className="bg-white/60 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-4 text-center">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Market
                                        Cap</p>
                                    <p className="text-lg font-bold text-green-700">$50M</p>
                                </div>

                                <div
                                    className="bg-white/60 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-4 text-center col-span-2 lg:col-span-1">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Listing
                                        Price</p>
                                    <p className="text-lg font-bold text-purple-700">$1.41</p>
                                </div>
                            </div>
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

                {/*{!token && (<div*/}
                {/*    style={{*/}
                {/*        position: 'absolute',*/}
                {/*        top: 0,*/}
                {/*        left: 0,*/}
                {/*        width: '100%',*/}
                {/*        height: '100%',*/}
                {/*        display: 'flex',*/}
                {/*        justifyContent: 'center',*/}
                {/*        alignItems: 'center',*/}
                {/*        zIndex: 10,*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <LoginDialog isOpen={true}/>*/}
                {/*</div>)}*/}

            </div>

            <FlexStagesTable/>
            <CryptoPurchaseSteps/>
            <HowToBuy/>
            <Footer/>
        </div>
    </section>)
        ;
}
