import React from "react";
import {useHorizontalScroll} from "../hooks/getHorizentalScroll";

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
        <section>
            <h1 id="tokenDistribution"
                className="mt-10 text-[#7B36B6] text-[30px] lg:text-[55px] font-futura-600 leading-[35px] lg:leading-[64px] text-center sm:max-w-[1047px] mx-auto max-w-[303px]">
                $SBX Token Distribution
            </h1>
            <p className=" text-[#686868] text-[12px] lg:text-[24px] font-futura-600 leading-[12px] lg:leading-[36px] text-center sm:max-w-[1047px] mx-auto max-w-[303px]">
                Tokenomics:
                The total supply of $SBX tokens is capped at 1,000,000,000. Of this, 100,000,000 $SBX tokens are
                allocated for the presale, split evenly across 10 phases with 10 million tokens per phase. Any unsold
                tokens from a phase will be returned to the treasury to ensure that circulating supply reflects actual
                market demand.
                If the soft cap is not reached, participants will receive a full refund, excluding any network
                transaction fees. After the presale and token airdrop, the community will vote through the DAO on
                whether to retain or permanently burn any unsold tokens
            </p>
            <div className="p-8 flex justify-center items-center">
                <div
                    className="bg-gradient-to-r from-purple-200 to-blue-200 p-4 sm:p-6 lg:p-10 rounded-2xl shadow-lg w-full max-w-sm md:max-w-lg lg:max-w-6xl mx-auto space-y-12 bg-white bg-opacity-20">
                    <div className="overflow-x-auto">
                        <div className="min-w-[800px]">
                            <div className="flex font-bold border-b-2 border-purple-600 p-2 whitespace-nowrap">
                                <div className="w-1/6">Stage</div>
                                <div className="w-1/6 text-center">Distribution</div>
                                <div className="w-1/6 text-center">$SBX Tokens</div>
                                <div className="w-1/2">Vesting Period</div>
                            </div>
                            {tokenData.map((row, index) => (
                                <div
                                    key={index}
                                    className="flex border-b border-purple-300 p-3"
                                >
                                    <div className="w-1/6">{row.stage}</div>
                                    <div className="w-1/6 text-center">{row.distribution}</div>
                                    <div className="w-1/6 text-center">{row.tokens}</div>
                                    <div className="w-1/2">{row.vesting}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default FlexStagesTable;
