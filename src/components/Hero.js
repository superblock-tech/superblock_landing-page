import React from "react";
import { DownloadIcon, RightArrow } from "../Icons";

export default function Hero() {
  return (
    <section className="overflow-hidden">
      <div className="max-w-[1920px] mx-auto">
        <div className="pl-[22px] sm:pl-[48px] xl:pl-[78px]">
          <div className="flex flex-col-reverse xl:flex-row xl:gap-x-[20px] justify-between xl:items-center">
            <div className="xl:max-w-[657px]  w-full">
              <h1 className="bg-custom-gradient1  text-transparent bg-clip-text w-fit text-[42.219px] sm:text-[73.974px] font-futura-bold font-bold sm:leading-[79.974px] leading-[42.219px]">
                Unlock the Future <br className="xl:block hidden" /> of
                Investment with Superblock
              </h1>

              <p className="text-[#414141] lg:text-[31.383px] text-[22.598px]  lg:leading-[39.6px] leading-[28.514px] font-normal sm:mt-[33px] mt-[27px] sm:mb-[38px] mb-[25px] font-futura-normal">
                Empower your investments through RWA{" "}
                <br className="hidden xl:block" /> tokenization, DeFi solutions,
                and modular blockchain development.
              </p>

              <div className="flex items-center gap-[26px] sm:gap-[33px] overflow-x-scroll pr-[22px] scrollbar-hide">
                <button className=" rounded-[12px] flex items-center py-[6.58px] px-[20px] gap-[21px] bg-gradient-to-r from-[#1BA3FF] to-[#7B36B6] hover:from-[#7B36B6] hover:to-[#1BA3FF] transition-all duration-300">
                  <span className="text-white text-[16px] leading-[29.87px] font-[450] whitespace-nowrap">
                    Join Presale
                  </span>{" "}
                  <RightArrow />
                </button>

                <button className="flex items-center gap-3">
                  <DownloadIcon />{" "}
                  <span className="text-[#7B36B6] sm:text-[20px] text-[16px] font-[450] sm:leading-[33.479px] leading-[26.681px] underline whitespace-nowrap">
                    Download Whitepaper
                  </span>
                </button>
                <button className="flex items-center gap-3">
                  <DownloadIcon />{" "}
                  <span className="text-[#7B36B6] sm:text-[20px] text-[16px] font-[450] sm:leading-[33.479px] leading-[26.681px] underline whitespace-nowrap">
                    Download Deck
                  </span>
                </button>
              </div>
            </div>

            <div className=" flex justify-end items-end relative -right-[32px] sm:right-0 z-10">
              <img src="assets/images/hero.svg" className="w-full " alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
