import React from "react";

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
    return (
        <section>
            <div className="p-8 flex justify-center items-center">
                <div
                    className="bg-gradient-to-r from-purple-200 to-blue-200 max-w-6xl p-10 rounded-2xl space-y-12 bg-white bg-opacity-20 shadow-lg">
                    <div className="p-4 max-w-6xl">
                        <div className="flex font-bold border-b-2 border-purple-600 p-2 ">
                            <div className="w-1/6">Stage</div>
                            <div className="w-1/6 text-center">Distribution</div>
                            <div className="w-1/6 text-center">$SBX Tokens</div>
                            <div className="flex-[2]">Vesting Period</div>
                        </div>
                        {tokenData.map((row, index) => (
                            <div
                                key={index}
                                className={`flex border-b border-purple-300 p-3`}
                            >
                                <div className="w-1/6">{row.stage}</div>
                                <div className="w-1/6 text-center">{row.distribution}</div>
                                <div className="w-1/6 text-center">{row.tokens}</div>
                                <div className="flex-[2]">{row.vesting}</div>
                            </div>
                        ))}
                    </div>
                </div>
                </div>
        </section>

)
;
};

export default FlexStagesTable;
