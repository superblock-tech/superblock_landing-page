import React from "react";

export default function CuttingEdge() {
  return (
    <section className="mt-[67px] xl:mt-0 xl:mb-[80px] mb-[60px]">
      <div className="container">
        <div className="max-w-[1596px] mx-auto">
          <div
            className="2xl:px-[84px] xl:px-[50px] px-[26px] lg:py-[52px] py-[45px] sm:rounded-[60px] rounded-[20px] flex flex-col xl:flex-row justify-between items-center gap-[34px]"
            style={{
              background: "linear-gradient(107deg, #7B36B6 0%, #1BA3FF 100%)",
            }}
          >
            <div className="flex-1 xl:max-w-[931px]">
              <h2 className="text-white text-[30px] lg:text-[55px] font-futura-600   leading-[35px] lg:leading-[64px] text-center lg:text-left">
                Cutting-Edge Technology Behind the Superblock Ecosystem!
              </h2>
              <p className="text-white lg:leading-[39.6px] leading-[27.5px] lg:text-[31.383px] text-[23px] font-normal text-center lg:text-left lg:mt-[27px] mt-[23px]">
                The Superblock Ecosystem is powered by advanced technology that
                ensures security, efficiency, and scalability across all its
                services. Our platform is underpinned by a robust blockchain
                infrastructure that supports the tokenization of real-world
                assets and the seamless execution of decentralized finance
                (DeFi) services.
              </p>
            </div>

            <div className="lg:w-[357px] w-full">
              <img
                src="assets/images/img1.svg"
                className="lg:w-full w-[292px] mx-auto"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
