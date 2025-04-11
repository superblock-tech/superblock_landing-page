import React, { useState } from "react";
import ProductCard from "./ProductCard";

export default function HowToBuy() {
    const [activeSlide, setActiveSlide] = useState({ index: 0, position: 0 });

    console.log(activeSlide);
    return (
        <section>
            <div className="container">
                <h1 className="text-[#7B36B6] text-[30px] lg:text-[55px] font-futura-600 leading-[35px] lg:leading-[64px] text-center sm:max-w-[1047px] mx-auto max-w-[303px]">
                    Using BTC, SOL, LTC, TRX, USDT-ERC20, and Other Cryptocurrencies
                </h1>

                <div className="mt-[56px] flex max-w-[1298px] mx-auto relative">
                    <div className="flex flex-col lg:gap-[50px] gap-[31px] flex-1">
                        {data.map((dt, i) => (
                            <ProductCard
                                dt={dt}
                                i={i}
                                key={i}
                                setActiveSlide={setActiveSlide}
                                activeSlide={activeSlide}
                                data={data}
                                separator={''}
                                numberPrefix={'Step'}
                                numberStyle={{fontSize: 'xx-large', fontWeight: 'bold', fontFamily: 'Futura PT Demi', fontWeightBold: 'bold' }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="text-center mt-10 mb-5">
                <h1 className="text-center text-gray-800 text-[36px] sm:text-[40px] font-bold lg:leading-[59px] leading-[36px] font-sans mb-[22px] sm:mb-[36px]">
                    Disclaimer
                </h1>
                <p className="text-gray-600 max-w-4xl mx-auto">
                    $SBX tokens will be distributed to the wallet address used during the purchase process. Tokens will be available for claiming or airdropped post-presale. Please safeguard your wallet credentials, as token recovery will not be possible if access is lost.
                </p>
            </div>
        </section>
    );
}

const data = [
    {
        title: "Prepare Your Wallet",
        icon: "/assets/images/mm_download.png",
        text: "MetaMask is ideal for desktop users, while Trust Wallet or MetaMask via Wallet Connect works seamlessly on mobile.",

    },
    {
        title: "Complete the Payment",
        icon: "/assets/images/steps/2.png",
        text: "Choose your preferred cryptocurrency and the number of $SBX tokens you wish to purchase, then click ‘Buy Now.’ A unique QR code and wallet address will be generated for payment. Once your transaction is confirmed on the blockchain, the purchased $SBX tokens will be allocated to your wallet, and your dashboard will reflect the updated balance. Keep your transaction ID as a backup.\n",
    },
    {
        title: "Claim Your Tokens",
        icon: "/assets/images/steps/3.png",
        text: "After the presale ends, claim your $SBX tokens on the website or receive them via an airdrop. Your dashboard will provide complete details of your holdings and token value.\n",
    },
];
