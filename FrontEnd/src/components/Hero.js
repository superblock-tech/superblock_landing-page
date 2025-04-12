import React, { Suspense } from "react";
import { DownloadIcon, RightArrow } from "../Icons";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import SpinningModel from "./SpinningModel";
import { usePresaleContext } from "../contexts/PresaleContext";

export default function Hero() {
  const { openLoginDialog } = usePresaleContext();

  return (
    <section className="overflow-hidden">
      <div className="max-w-[1920px] mx-auto">
        <div className="pl-[22px] sm:pl-[48px] xl:pl-[78px]">
          <div className="flex flex-col-reverse xl:flex-row xl:gap-x-[20px] justify-between xl:items-center">
            <div className="xl:max-w-[657px]  w-full">
            <h1
                className="
                  bg-multi-color-gradient
                  bg-size-800           /* ensures the gradient is 200% wide */
                  animate-colorCycle     /* smoothly slides the gradient */
                  text-transparent
                  bg-clip-text
                  w-fit
                  text-[42.219px]
                  sm:text-[73.974px]
                  font-futura-bold
                  font-bold
                  sm:leading-[79.974px]
                  leading-[42.219px]
                "
              >
                Unlock the Future
                of Investment with Superblock
              </h1>

              <p className="text-[#414141] lg:text-[31.383px] text-[22.598px]  lg:leading-[39.6px] leading-[28.514px] font-normal sm:mt-[33px] mt-[27px] sm:mb-[38px] mb-[25px] font-futura-normal">
                Empower your investments through RWA{" "}
                <br className="hidden xl:block" /> tokenization, DeFi solutions,
                and modular blockchain development.
              </p>

              <div className="flex items-center gap-[26px] sm:gap-[33px] overflow-x-scroll pr-[22px] scrollbar-hide">
                <a href="/dashboard"
                  className="rounded-[12px] xl:flex items-center py-[6.58px] px-[20px] gap-[24px]
                  bg-gradient-to-r from-[#1BA3FF] to-[#7B36B6]
                  hover:from-[#7B36B6] hover:to-[#1BA3FF]
                  transition-all duration-300"

                >
                  <span className="text-white text-[16px] leading-[29.87px] font-[450]">
                    Join Presale
                  </span>
                  <span className="hidden xl:flex">
                    <RightArrow />
                  </span>
                </a>

                <a href="/assets/documents/SUPERBLOCK%20-%20Whitepaper%20v2.6.pdf" target="_blank" className="flex items-center gap-3">
                  <DownloadIcon />{" "}
                  <span className="text-[#7B36B6] sm:text-[20px] text-[16px] font-[450] sm:leading-[33.479px] leading-[26.681px] underline whitespace-nowrap">
                    Download Whitepaper
                  </span>
                </a>
                {/*<button className="flex items-center gap-3">*/}
                {/*  <DownloadIcon />{" "}*/}
                {/*  <span className="text-[#7B36B6] sm:text-[20px] text-[16px] font-[450] sm:leading-[33.479px] leading-[26.681px] underline whitespace-nowrap">*/}
                {/*    Download Deck*/}
                {/*  </span>*/}
                {/*</button>*/}
              </div>
            </div>

            <div className=" flex justify-end items-end relative -right-[32px] sm:right-0 z-10">
              <div className="w-full ">
                <img
                  src="assets/images/lens-overlay.svg"
                  className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
                  alt=""
                />
                <img
                  src="assets/images/hero_1.svg"
                  className="w-full "
                  alt=""
                />
              </div>
              <div className="absolute top-[-10%] left-[-26%] w-full h-full">
                <Canvas camera={{ position: [0, 0, 530] }}>
                  <Environment preset="studio" />
                  <Suspense fallback={null}>
                    <SpinningModel />
                  </Suspense>
                </Canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
