import React from "react";
import {DownloadIcon} from "../Icons";

export default function Phace1() {
    return (
        <div className="w-full md:w-1/3 flex">
            <div
                className="
                bg-gradient-to-r
                from-purple-200
                to-blue-200
                text-white
                rounded-2xl
                p-4
                mt-6
                h-full
                w-full
                flex
                flex-col
                justify-center"
            >
                <div className="w-full">
                    <h1
                        className="
          bg-multi-color-gradient
          bg-size-800
          animate-colorCycle
          text-transparent
          bg-clip-text
          w-fit
          text-[30.219px]
          sm:text-[40.974px]
          font-futura-bold
          font-bold
          sm:leading-[79.974px]
          leading-[42.219px]
          text-left
        "
                    >
                        $SBX Token Presale
                        <br/>
                        Phase 1
                    </h1>
                </div>
                <h2 className="text-2xl text-black text-left mt-4">
                    Founders Circle Presale. Invite only.
                </h2>
                <div className="relative w-full my-2">
                    <button
                        className="mx-auto w-1/2 text-center
                        rounded-[12px] flex items-center
                        py-[6.58px] px-[20px] gap-[24px]
                        bg-gradient-to-r from-[#1BA3FF] to-[#7B36B6]
                        hover:from-[#7B36B6] hover:to-[#1BA3FF]
                        transition-all duration-300"

                        onClick={() => {
                            document.getElementById('buyNow').scrollIntoView()
                            window.scrollTo(0, window.scrollY - 80)
                        }
                        }
                    >
                        <span className="mx-auto text-white text-[16px] leading-[29.87px] font-[450]">
                            Buy Now
                        </span>
                    </button>
                </div>

                <div className="flex justify-center gap-4 my-2 w-full">
                    <button
                        className="text-center rounded-[12px] flex items-center py-[6.58px] px-[20px] gap-[24px]"
                        onClick={() => {
                            document.getElementById('howToBuy').scrollIntoView()
                            window.scrollTo(0, window.scrollY - 80)
                        }}
                    >
                        <span
                            className="text-[#7B36B6] sm:text-[20px] text-[16px] font-[450] sm:leading-[33.479px] leading-[26.681px] underline whitespace-nowrap">
                            How To Buy
                        </span>
                    </button>
                    <button
                        className="text-center rounded-[12px] flex items-center py-[6.58px] px-[20px] gap-[24px]"
                        onClick={() => {
                            document.getElementById('tokenDistribution').scrollIntoView()
                            window.scrollTo(0, window.scrollY - 80)
                        }}
                    >
                        <span
                            className="text-[#7B36B6] sm:text-[20px] text-[16px] font-[450] sm:leading-[33.479px] leading-[26.681px] underline whitespace-nowrap">
                            Token Distribution
                        </span>
                    </button>
                </div>

            </div>
        </div>


    );
}
