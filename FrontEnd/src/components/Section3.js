import React from "react";
import { useHorizontalScroll } from "../hooks/getHorizentalScroll";

export default function Section3() {
  const scrollRef = useHorizontalScroll();
  return (
    <section className="overflow-hidden xl:pb-[130px] pb-[125px]">
      <div className="pl-[22px] sm:pl-[48px] xl:pl-[78px] overflow-hidden mx-auto max-w-[1920px]">
        <div
          className="overflow-x-auto scrollbar-hide  xl:pl-[84px] "
          ref={scrollRef}
        >
          <div className="flex flex-nowrap ">
            {data.map((dt, i) => (
              <div
                key={i}
                className={` flex justify-between gap-[41px] ${
                  i !== 0 && "pl-[41px]"
                }`}
              >
                <div
                  className={` ${
                    dt.textClassName ? dt.textClassName : "w-[260px]"
                  }`}
                >
                  <img src={dt.icon} alt="" />
                  <h3 className="text-black font-bold font-inter text-[24px] leading-[29px] py-[12px]">
                    {dt.title}
                  </h3>
                  <p className="text-black font-normal tracking-[0.18px] leading-[21.926px] text-18px">
                    {dt.text}
                  </p>
                </div>
                {i + 1 !== data.length && (
                  <div className="h-full w-[1px] bg-gradient-to-b from-[#1BA3FF] to-[#7B36B6]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const data = [
  {
    icon: "assets/images/rwa.svg",
    title: "Real-World Asset (RWA) Tokenization",
    text: "Convert high-value real-world assets into digital tokens, enabling fractional ownership and increased liquidity.",
  },
  {
    icon: "assets/images/defi.svg",
    title: "Decentralized Finance (DeFi)",
    text: "Access a range of financial instruments powered by secure and transparent smart contracts",
    textClassName: "w-[238px]",
  },
  {
    icon: "assets/images/dao.svg",
    title: "Decentralized Governance (DAO)",
    text: "Participate in community-driven decision-making processes.",
    textClassName: "w-[239px]",
  },
  {
    icon: "assets/images/pap.svg",
    title: "Plug-and-Play Blockchain Modules",
    text: "Quickly develop innovative blockchain applications with our modular approach.",
    textClassName: "w-[236px]",
  },
  {
    icon: "assets/images/ai-p.svg",
    title: "Al-Powered Insights",
    text: "Leverage Al for actionable insights and optimized investment strategies.",
    textClassName: "w-[216px]",
  },
];
