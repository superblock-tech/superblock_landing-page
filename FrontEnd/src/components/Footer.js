import React from "react";
import { ArrowRightBlack } from "../Icons";

export default function Footer() {
  return (
    <footer className="lg:pt-[254px] pt-[77px] lg:-mt-[223px] -mt-[108px] bg-no-repeat bg-cover bg-center w-full h-auto relative overflow-hidden">
      <img
        src="assets/images/clip-path-group.svg"
        alt=""
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
      <div className="container relative mt-4">
        <img
          src="assets/images/x.svg"
          className="sm:w-fit mx-auto w-[72px]"
          alt=""
          loading="lazy"
        />

        <p className="text-center text-[#7B36B6] lg:text-[60px] text-[30px] lg:leading-[62px] leading-[28px] lg:my-[14px] py-[20px] max-w-[1069px] mx-auto font-semibold">
          Follow us on X for updates and be the first to know about our exciting
          journey.
        </p>

        <a
            href="https://x.com/superblockhq"
          className="text-black lg:text-[19px] text-[14px]  px-[24px] lg:py-[8px] py-[6px] rounded-[14px] flex justify-center items-center lg:gap-[13px] gap-[9px] w-fit mx-auto  font-semibold h-[48px]"
          style={{
            background:
              "linear-gradient(106deg, rgba(27, 163, 255, 0.30) 0%, rgba(123, 54, 182, 0.30) 100%)",
          }}
        >
          Follow Us Now <ArrowRightBlack />
        </a>

        <div className="lg:mt-[96px] mt-[48px] sm:py-[21px] py-[14px] flex justify-between flex-col lg:flex-row border-t border-[#494949] items-center">
          <p className="text-[#424141] text-[16px] font-normal tracking-[0.16px] leading-[22px]">
            © {new Date().getFullYear()} SuperBlock. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
