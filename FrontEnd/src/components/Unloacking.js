import React from "react";
import { useHorizontalScroll } from "../hooks/getHorizentalScroll";

export default function Unloacking() {
  const scrollRef = useHorizontalScroll();
  return (
    <section className="mt-[102px] lg:mb-[70px] mb-[82px] overflow-hidden">
      <div className="container">
        <div className="2xl:px-[124px]">
          <h1 className=" text-[#353535] text-[30px] lg:text-[55px] font-futura-600   leading-[35px] lg:leading-[64px]  sm:max-w-[1061px]  ">
            Unlocking the Potential of the Superblock Ecosystem The Superblock
          </h1>

          <p className="text-[#595959] text-[23px] lg:text-[31.383px] font-normal   leading-[27px] lg:leading-[39.6px]   lg:mt-[30px] mt-[22px]">
            Ecosystem offers a diverse range of use cases, catering to various
            industries and user needs: 
          </p>

          <div className="mt-[78px] xl:grid lg:grid-cols-3 gap-y-[33px] lg:grid-rows-3 hidden">
            {data.map((dt, i) => (
              <div
                key={i}
                className={`${dt.className} pr-[33px] w-[570px] lg:w-auto flex-1`}
              >
                <div className="flex flex-col justify-between w-full h-full gap-[10px]">
                  <div
                    className={`pr-[30px] pb-[23px] ${
                      i === 5 || i === 6 || i === 7 ? "" : "hidden"
                    } ${i === 5 || i === 2 || i === 4 ? " pl-[20px]" : ""} `}
                  >
                    {" "}
                    <div className="bg-gradient-to-r from-[#1BA3FF] to-[#7B36B6] h-[1px] w-full "></div>
                  </div>
                  <div className=" w-full h-full flex items-center justify-between gap-[33px]">
                    <div className="flex-1">
                      <div className="flex items-center gap-[10px]">
                        <div
                          className="border border-[#C3C0C0] w-[78px] h-[78px] aspect-squar rounded-[22px] flex justify-center items-center"
                          style={{
                            background:
                              "linear-gradient(136deg, rgba(123, 54, 182, 0.16) 66.43%, rgba(27, 163, 255, 0.32) 97.11%)",
                          }}
                        >
                          <img className="max-w-full" src={dt.icon} alt="" />
                        </div>

                        <h3 className="font-inter text-black font-bold leading-[29.3px] text-[20px]">
                          {dt.title}
                        </h3>
                      </div>

                      <p className="text-black font-normal tracking-[0.18px] text-[18px] leading-[21px] mt-[15px] mb-[15px]">
                        {dt.text}
                      </p>
                    </div>
                    <div className="flex justify-center items-center h-full">
                      <div
                        className={`pb-[15px] w-[1px] h-full ${
                          i === 2 || i === 4 || i === 7 ? "hidden" : ""
                        } `}
                      >
                        {" "}
                        <div className="bg-gradient-to-b from-[#1BA3FF] to-[#7B36B6] w-[1px] h-full "></div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`pr-[30px] ${
                      i === 0 || i === 1 || i === 2 ? "" : "hidden"
                    } ${i === 0 || i === 2 || i === 4 ? " pl-[20px]" : ""}  `}
                  >
                    {" "}
                    <div className="bg-gradient-to-r from-[#1BA3FF] to-[#7B36B6] h-[1px] w-full "></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="overflow-scroll scrollbar-hide mt-[50px] "
            ref={scrollRef}
          >
            <div className="flex xl:hidden">
              {data.map((dt, i) => (
                <div
                  key={i}
                  className={` flex justify-between gap-[33px] ${
                    i !== 0 && "pl-[33px]"
                  }`}
                >
                  <div
                    className={` ${dt.className ? dt.className : "w-[350px]"}`}
                  >
                    <div className="flex items-center gap-[15.56px]">
                      <div
                        className="border border-[#C3C0C0] w-[63px] h-[63px] aspect-squar rounded-[22px] flex justify-center items-center"
                        style={{
                          background:
                            "linear-gradient(136deg, rgba(123, 54, 182, 0.16) 66.43%, rgba(27, 163, 255, 0.32) 97.11%)",
                        }}
                      >
                        <img className="w-[36px]" src={dt.icon} alt="" />
                      </div>
                      <h3 className="text-black font-bold font-inter text-[16px] leading-[23px] py-[12px]">
                        {dt.title}
                      </h3>
                    </div>

                    <p className="text-black font-normal tracking-[0.147px] leading-[17.955px] text-14px mt-[12px]">
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
      </div>
    </section>
  );
}

const data = [
  {
    title: "Real Estate Investment",
    icon: "/assets/images/unloack/img1.svg",
    text: "Superblock enables the tokenization of real estate, allowing investors to purchase fractions of properties worldwide. This makes real estate investment accessible to more people and provides liquidity to a traditionally illiquid market.",
  },
  {
    title: "Art and Collectibles",
    icon: "/assets/images/unloack/img2.svg",
    text: "Through Superblock, users can invest in high-value art and collectibles by acquiring tokens that represent fractional ownership. This democratizes access to exclusive markets and brings liquidity to valuable, often static, assets.",
  },
  {
    title: "Tokenization of Capital Markets",
    icon: "/assets/images/unloack/img3.svg",
    text: "Superblock is revolutionizing capital markets by enabling the tokenization of financial assets such as stocks, bonds, and commodities. This process enhances liquidity, transparency, and accessibility, making it easier for investors to trade and manage their portfolios in real-time.",
  },
  {
    title: "Decentralized Finance (DeFi)",
    icon: "/assets/images/unloack/img4.svg",
    text: "Users can engage in a variety of DeFi activities, from lending and borrowing to staking and trading. Superblock's DeFi suite provides a secure, transparent, and efficient alternative to traditional financial services.",
  },
  {
    title: "Institutional Application Development",
    icon: "/assets/images/unloack/img5.svg",
    text: "Financial institutions and enterprises can leverage Superblock's infrastructure to build their own decentralized applications (dApps). Whether it's creating custom financial products, launching digital marketplaces, or enhancing existing services with blockchain technology, Superblock offers the tools and support needed to innovate.",
    className: "w-[700px] col-span-2",
  },
  {
    title: "Crowdfunding and Fundraising",
    icon: "/assets/images/unloack/img6.svg",
    text: "Entrepreneurs and startups can use Superblock to raise capital by issuing tokens that represent shares in their projects. This decentralized approach to fundraising attracts a global pool of investors, ensuring transparency and broad participation.",
  },
  {
    title: "Supply Chain Management",
    icon: "/assets/images/unloack/img7.svg",
    text: "Superblock's tokenization technology can be applied to track and verify the authenticity of goods throughout the supply chain. This is particularly valuable in industries where provenance and authenticity are critical, such as luxury goods and pharmaceuticals. ",
  },
  {
    title: "Decentralized Governance",
    icon: "/assets/images/unloack/img8.svg",
    text: "Superblock's DAO allows users to actively participate in the platform's governance, voting on key decisions and contributing to the ecosystem's evolution. This ensures that the platform remains aligned with the needs and interests of its community.",
  },
];
