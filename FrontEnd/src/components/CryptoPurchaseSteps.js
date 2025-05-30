import React from "react";

export default function CryptoPurchaseSteps() {
    return (
        <section>
            <h1 className="mt-10 text-[#7B36B6] text-[30px] lg:text-[55px] font-futura-600 leading-[35px] lg:leading-[64px] text-center sm:max-w-[1047px] mx-auto max-w-[303px]">
                How to Buy $SBX Tokens
            </h1>
            <p className=" text-[#686868] text-[12px] lg:text-[24px] font-futura-600 leading-[12px] lg:leading-[36px] text-center sm:max-w-[1047px] mx-auto max-w-[303px]">
                You must connect your own custody wallet, as $SBX tokens will be allocated to the connected wallet after
                completing the transaction, and airdropped after the presale concludes.
            </p>
            <h2 className=" text-[#686868] text-[20px] lg:text-[30px] font-futura-600 leading-[35px] lg:leading-[64px] text-center sm:max-w-[1047px] mx-auto max-w-[303px]">
                Using ETH, BNB, USDT, USDC, or BUSD
            </h2>

            <div className="p-8 flex justify-center items-center">
                <div
                    className="bg-gradient-to-r from-purple-200 to-blue-200 max-w-6xl p-10 rounded-2xl space-y-12 bg-white bg-opacity-20 shadow-lg">
                    {[
                        {
                            title: "Step 1: Set Up Your Wallet",
                            description: "To get started, install MetaMask on your desktop browser or use a Wallet Connect-compatible option like Trust Wallet on mobile. For desktop transactions, MetaMask provides the smoothest experience. Mobile users can connect MetaMask or Trust Wallet through Wallet Connect.",
                            icons: ["MetaMask", "TrustWallet"],
                            image: null,
                            reverse: true
                        },
                        {
                            title: "Step 2 - Purchase Process",
                            description: "Select your preferred cryptocurrency, specify the amount of $SBX tokens you'd like to buy, and click ‘Buy Now.’ Confirm the transaction through your wallet, where you’ll also see the associated gas fees. Note: For USDT/USDC purchases, you might need to complete two approvals: one to authorize the contract and another for the actual payment.",
                            image: <img
                                className="sm:max-w-full"
                                src="/assets/images/steps/2.png"
                                alt=""
                            />,

                            reverse: false
                        },
                        {
                            title: "Step 3: Token Distribution",
                            description: "After the presale concludes, you can claim your $SBX tokens on our website or wait for them to be airdropped directly to your wallet. Track your investment and token value in the dashboard by connecting your wallet.",
                            image: <img
                                className="sm:max-w-full"
                                src="/assets/images/steps/3.png"
                                alt=""
                            />,

                            reverse: true
                        }
                    ].map((step, index) => (
                        <Step key={index} {...step} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function Step({title, description, icons, image, reverse}) {
    return (
        <div
            className={`flex flex-col md:flex-row ${reverse ? 'md:flex-row-reverse' : ''} items-center space-y-6 md:space-y-0 md:space-x-6 py-6 border-b border-gray-300`}>

            <div className="flex-shrink-0 w-full md:w-1/3 flex justify-center">
                {image}
                {!image && (
                    <div className="flex space-x-4">
                        {icons.includes("MetaMask") && <WalletButton name="MetaMask" link={'https://metamask.io/'}/>}
                        {icons.includes("TrustWallet") && <WalletButton name="TrustWallet" link={'https://trustwallet.com/'}/>}
                    </div>
                )}
            </div>

            <div className="w-full md:w-2/3 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="text-gray-700 mb-4">{description}</p>
            </div>
        </div>

    );
}

function WalletButton({name, link}) {
    return (
        <a
            href={link}
            target="_blank"
            className=" rounded-[12px] bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF] hover:from-blue-200 hover:to-purple-200 text-white px-4 py-2 rounded flex items-center space-x-2"
        >
            <img style={{width: '200px'}} src={'/assets/images/' + name + '.png'}></img>
        </a>
    );
}
