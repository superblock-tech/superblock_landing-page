import React from "react";

export default function KeyFeatures() {
    return (
        <section className="my-[100px]">
            <div className="container">
                <div
                    className="max-w-[1596px] mx-auto lg:rounded-[60px] rounded-[20px] sm:py-[39px] py-[21px] pl-[12px] sm:pl-[69px] sm:pr-[57px] pr-[12px] overflow-hidden"
                    style={{
                        background: "linear-gradient(107deg, #7B36B6 0%, #1BA3FF 100%)",
                    }}
                >
                    <div className=" text-white grid 2xl:grid-cols-10 grid-cols-1 md:gap-[62px] gap-[18px] relative">
                        {/* Left section */}
                        <div
                            className="w-full 2xl:col-span-6 gri bg-white/10 min-h-[282px] sm:min-h-[462px] lg:rounded-[50px] rounded-[20px] flex justify-center items-center flex-col">
                            <div className="p-6 rounded-lg grid">
                                <h1 className="text-center 2xl:text-left text-[#faf4ff] text-[36px] sm:text-[40px] font-bold lg:leading-[59px] leading-[36px] font-sans mb-[22px] sm:mb-[36px]">
                                    Key Features of $SBX Tokens
                                </h1>

                                <div className="grid 2xl:grid-cols-10">
                                    <div
                                        className="w-full 2xl:col-span-5 p-2"
                                    >
                                        <h3 className="text-xl font-semibold mt-4">Governance Participation</h3>
                                        <p>$SBX holders gain voting rights within the Superblock DAO, allowing them to
                                            influence
                                            platform
                                            decisions,
                                            including upgrades, proposals, and strategic partnerships.</p>
                                        <h3 className="text-xl font-semibold mt-4">Payment for Modules</h3>
                                        <p>$SBX tokens are the primary medium for accessing Superblock’s plug-and-play
                                            modules,
                                            including
                                            tokenization, compliance, and interoperability tools.</p>
                                        <h3 className="text-xl font-semibold mt-4">Access to Early-Bird Opportunities</h3>
                                        <p>Token holders gain exclusive access to early-bird investment opportunities in
                                            tokenized assets
                                            and
                                            reduced
                                            fees within the ecosystem.</p>
                                    </div>
                                    <div
                                        className="w-full 2xl:col-span-5 p-2"
                                    >
                                        <h3 className="text-xl font-semibold mt-4">Staking Rewards</h3>
                                        <p>By staking $SBX tokens, users contribute to the ecosystem’s stability and
                                            security
                                            while earning
                                            attractive
                                            staking rewards.</p>
                                        <h3 className="text-xl font-semibold mt-4">Transaction Fees</h3>
                                        <p>Use $SBX tokens to cover transaction fees on the platform, enabling
                                            cost-efficient
                                            operations
                                            across
                                            various services.</p>
                                        <h3 className="text-xl font-semibold mt-4">Unlock Premium Features</h3>
                                        <p>Holders can unlock advanced modules, premium analytics, and other exclusive
                                            benefits
                                            to enhance
                                            their
                                            experience within the ecosystem.</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Right section */}
                        <div
                            className="text-white 2xl:col-span-4 w-full lg:rounded-[50px] rounded-[20px] py-[23px] px-[23px] relative"
                        >
                            <h1 className="text-center 2xl:text-left text-[#faf4ff] text-[36px] sm:text-[40px] font-bold lg:leading-[59px] leading-[36px] font-sans mb-[22px] sm:mb-[36px]">
                                Incentives and Benefits
                            </h1>
                            <h3 className="text-xl font-semibold mt-4">Staking Rewards:</h3>
                            <p>Token holders earn passive income by staking $SBX tokens, with rewards designed to
                                incentivize
                                long-term
                                participation.</p>
                            <h3 className="text-xl font-semibold mt-4">Early Access:</h3>
                            <p>Gain priority access to tokenized assets and discounted rates as a token holder.</p>
                            <h3 className="text-xl font-semibold mt-4">Ecosystem Growth:</h3>
                            <p>Foundation/Treasury tokens support continuous development, liquidity, and strategic
                                partnerships,
                                ensuring
                                long-term sustainability.</p>

                            <img
                                src="assets/images/key-features.png"
                                className="w-[160px] absolute right-0"
                                alt=""
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
