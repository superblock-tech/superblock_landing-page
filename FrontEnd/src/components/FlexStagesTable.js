import React from "react";
import {useHorizontalScroll} from "../hooks/getHorizontalScroll";

const tokenData = [
    {
        stage: "Market Maker / Exchange Liquidity",
        distribution: "5%",
        tokens: "50,000,000",
        vesting: "If tokens are minted at TGE, they will be 100% unlocked. If not, they will be distributed as per agreement upon minting.",
    },
    {
        stage: "Pre-sale",
        distribution: "10%",
        tokens: "100,000,000",
        vesting:
            "The 12-month cliff and subsequent linear vesting apply only after the tokens are minted. If they are not minted yet, vesting will start from the minting date, not TGE.",
    },
    {
        stage: (
            <>
                <div>Public sale A</div>
                <small>*Will unlock after completion of phase 1 milestones, with DAO and Board approval</small>
            </>
        ),
        distribution: "10%",
        tokens: "100,000,000",
        vesting:
            "The 12-month cliff and subsequent linear vesting apply only after the tokens are minted. If they are not minted yet, vesting will start from the minting date, not TGE.",
    },
    {
        stage: (
            <>
                <div>Public sale B</div>
                <small>*Will unlock after completion of phase 2 milestones, with DAO and Board approval</small>
            </>
        ),
        distribution: "10%",
        tokens: "100,000,000",
        vesting:
            "The 12-month cliff and subsequent linear vesting apply only after the tokens are minted. If they are not minted yet, vesting will start from the minting date, not TGE.",
    },
    {
        stage: (
            <>
                <div>Foundation/Treasury (Un-minted Reserves)</div>
                <ul className="list-disc pl-5 text-sm mt-1">
                    <li>Ecosystem Development / Growth</li>
                    <li>Rewards / Incentives</li>
                    <li>Liquidity/Exchange Listings</li>
                    <li>Ecosystem Adaption / Promotion</li>
                    <li>Team / Company Reserve</li>
                    <li>Advisors / Partnerships</li>
                    <li>SBX Labs / R&D</li>
                    <li>Community Grants / Bug Bounty Program</li>
                </ul>
            </>
        ),
        distribution: "65%",
        tokens: "650,000,000",
        vesting:
            "Instead of unlocking at TGE, tokens will be minted gradually (2%–2.5% per month) based on DAO proposals and approvals. The vesting schedule will apply only once minting begins.",
    },
];

const FlexStagesTable = () => {
    const scrollRef = useHorizontalScroll();
    return (
        <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="text-center mb-12 lg:mb-16">
                    <h1 id="tokenDistribution"
                        className="text-3xl sm:text-4xl lg:text-5xl xl:text-[55px] font-bold leading-tight lg:leading-[64px] text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 mb-6 lg:mb-8">
                        $SBX Token Distribution
                    </h1>

                    <div className="max-w-5xl mx-auto space-y-4 lg:space-y-6">
                        <p className="text-slate-600 text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed lg:leading-loose font-medium">
                            The total supply of $SBX tokens is capped at <span
                            className="font-bold text-purple-700">1,000,000,000</span>. Of this, <span
                            className="font-bold text-purple-700">100,000,000 $SBX tokens (10% of total supply)</span> are
                            allocated for the presale, split evenly across 10 phases with 10,000,000 tokens per phase
                            (1% of total supply).
                        </p>

                        <p className="text-slate-600 text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed lg:leading-loose font-medium">
                            Any unsold tokens from a phase will be returned to the treasury to ensure that circulating
                            supply reflects actual market demand. If the soft cap is not reached, participants will
                            receive a <span className="font-bold text-blue-700">full refund</span>, excluding any
                            network transaction fees.
                        </p>

                        <p className="text-slate-600 text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed lg:leading-loose font-medium">
                            After the presale and token airdrop, the community will vote through the <span
                            className="font-bold text-indigo-700">DAO</span> on whether to retain or permanently burn
                            any unsold tokens.
                        </p>
                    </div>
                </div>

                {/* Distribution Table */}
                <div className="flex justify-center">
                    <div className="w-full max-w-6xl">
                        <div
                            className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 border border-purple-100/50 rounded-2xl lg:rounded-3xl shadow-xl shadow-purple-100/20">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div
                                    className="absolute top-0 right-0 w-32 h-32 bg-purple-400 rounded-full -translate-y-16 translate-x-16"></div>
                                <div
                                    className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 rounded-full translate-y-12 -translate-x-12"></div>
                            </div>

                            <div className="relative z-10 p-4 sm:p-6 lg:p-8 xl:p-10">
                                {/* Mobile Card Layout */}
                                <div className="block lg:hidden space-y-4">
                                    {tokenData.map((row, index) => (
                                        <div
                                            key={index}
                                            className="bg-white/60 backdrop-blur-sm border border-purple-200/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                                        >
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="font-bold text-purple-700 text-lg">{row.stage}</h3>
                                                <span
                                                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                                            {row.distribution}
                                        </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600 font-medium">Tokens:</span>
                                                    <span className="font-bold text-slate-800">{row.tokens}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-600 font-medium">Vesting:</span>
                                                    <p className="text-slate-800 font-medium mt-1">{row.vesting}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table Layout */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <div className="min-w-full">
                                        {/* Table Header */}
                                        <div
                                            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-xl">
                                            <div className="flex font-bold text-base xl:text-lg p-4 xl:p-6">
                                                <div className="w-1/6">Stage</div>
                                                <div className="w-1/6 text-center">Distribution</div>
                                                <div className="w-1/6 text-center">$SBX Tokens</div>
                                                <div className="w-1/2">Vesting Period</div>
                                            </div>
                                        </div>

                                        {/* Table Body */}
                                        <div className="bg-white/60 backdrop-blur-sm rounded-b-xl">
                                            {tokenData.map((row, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex border-b border-purple-200/50 p-4 xl:p-6 text-sm xl:text-base hover:bg-white/40 transition-colors duration-200 ${
                                                        index === tokenData.length - 1 ? 'border-b-0 rounded-b-xl' : ''
                                                    }`}
                                                >
                                                    <div
                                                        className="w-1/6 font-semibold text-purple-700">{row.stage}</div>
                                                    <div className="w-1/6 text-center">
                                                <span
                                                    className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs xl:text-sm font-semibold">
                                                    {row.distribution}
                                                </span>
                                                    </div>
                                                    <div
                                                        className="w-1/6 text-center font-bold text-slate-800">{row.tokens}</div>
                                                    <div
                                                        className="w-1/2 text-slate-700 font-medium leading-relaxed">{row.vesting}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info Section */}
                <div className="mt-6 lg:mt-8 text-center">
                    <div
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"/>
                        </svg>
                        All percentages are calculated based on the total supply of 1B tokens
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FlexStagesTable;
