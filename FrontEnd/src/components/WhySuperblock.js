import React, { useState } from "react";

const sectionData = {
  Developers: [
    {
      title: "Rapid Development: ",
      text: "Superblock's modular components and plug-and-play SDKs make it easy for developers to build, deploy, and scale decentralized applications (dApps) quickly.",
    },
    {
      title: "Comprehensive Tooling: ",
      text: "Access to AI-powered analytics, robust APIs, and smart contract templates accelerates development and optimizes application performance.",
    },
    {
      title: "Community and Support: ",
      text: "Developers can engage with a vibrant community, participate in hackathons, and access extensive documentation and tutorials to aid in their projects.",
    },
    {
      title: "Revenue Opportunities: ",
      text: "By creating dApps or contributing to the ecosystem, developers can unlock new revenue streams through Superblock's incentivization programs.",
    },
  ],
  "Financial Institutions": [
    {
      title: "Enhanced Liquidity: ",
      text: "Tokenizing assets such as real estate, stocks, and bonds allows financial institutions to unlock liquidity, making it easier to trade and manage these assets.",
    },
    {
      title: "Transparency and Security: ",
      text: "Superblock's blockchain infrastructure ensures that all transactions are transparent and secure, meeting regulatory compliance and enhancing trust with clients.",
    },
    {
      title: "Regulatory Compliance and Efficiency: ",
      text: "By leveraging smart contracts and blockchain technology, Superblock cuts out intermediaries, streamlining operations and reducing costs. This also simplifies regulatory compliance by providing a clear, immutable audit trail of all transactions.",
    },
  ],
  "dApp Users": [
    {
      title: "Access to DeFi Services: ",
      text: "Superblock provides users with a range of decentralized finance (DeFi) services, including lending, borrowing, staking, and trading, all in a secure and transparent environment.",
    },
    {
      title: "Investment Diversification: ",
      text: "Users can easily diversify their portfolios by investing in tokenized assets, ranging from real estate to fine art and capital markets.",
    },
    {
      title: "Empowered Participation: ",
      text: "Through the DAO, users have a say in the governance of the Superblock Ecosystem, allowing them to vote on proposals and influence the platform's development.",
    },
    {
      title: "User-Friendly Experience: ",
      text: "Superblock's intuitive interface and real-time analytics make it easy for users to manage their assets, track investments, and participate in governance.",
    },
  ],
};

export default function WhySuperblock() {
  const [activeSection, setActiveSection] = useState("Developers");

  return (
    <section className="lg:pt-[76px] pt-[48px] pb-[92px] lg:pb-[24px] relative overflow-hidden bg-gradient-to-r from-[#7B36B6] to-[#1BA3FF]">
      <img
        className="absolute lg:-top-[85px] top-[180px] lg:right-0 -right-[225px]"
        src="assets/images/bg-shape1.svg"
        alt=""
      />
      <img
        className="absolute lg:-bottom-[85px] -bottom-[50px] lg:left-0 -left-[10px] lg:h-auto h-[207px]"
        src="assets/images/bg-shape2.svg"
        alt=""
      />
      <div className="container">
        <div className="max-w-[1516px] mx-auto">
          <h1 className="text-white text-[30px] lg:text-[55px] font-futura-600 leading-[35px] lg:leading-[64px] text-center">
            Why SUPERBLOCK
          </h1>

          <p className="text-[#DBDBDB] text-[23px] lg:text-[31.383px] font-normal leading-[27px] lg:leading-[39.6px] text-center max-w-[1461px] mx-auto mt-[16px] lg:mt-[23px] mb-[41px] lg:mb-[36px]">
            The Superblock Ecosystem offers tailored benefits for various user
            groups, ensuring that everyone, from individual developers to large
            financial institutions, can leverage the platform to meet their
            needs.
          </p>

          <div className="flex justify-between flex-col lg:flex-row relative gap-[50px]">
            <hr className="bg-white absolute lg:h-[1px] h-full lg:w-full w-[1px] lg:top-[45px] left-[25px] lg:left-0" />
            {["Developers", "Financial Institutions", "dApp Users"].map(
              (dt, i) => (
                <div
                  key={dt}
                  onClick={() => setActiveSection(dt)}
                  className={`w-fit relative rounded-[16px] p-[1px] cursor-pointer transition-all duration-300 ease-in-out ${
                    activeSection === dt
                      ? "bg-gradient-to-b from-[#C3C0C0] to-[#8a83d0]"
                      : ""
                  }`}
                >
                  <div
                    className={`rounded-[16px] h-full min-w-[247px] sm:min-w-[312px] w-fit flex lg:flex-col lg:gap-[21px] gap-[12px] items-center lg:items-start transition-all duration-300 ease-in-out ${
                      activeSection === dt
                        ? "bg-[#7E75D5] lg:p-[22px] p-[11px]"
                        : "lg:py-[22px] px-[11px] hover:bg-white/5"
                    }`}
                    style={
                      activeSection === dt
                        ? { boxShadow: "0px 2px 18px 0px rgba(0, 0, 0, 0.11)" }
                        : {}
                    }
                  >
                    <div
                      className="lg:w-[47px] w-[28px] lg:h-[47px] h-[28px] rounded-full flex justify-center items-center text-[14px] lg:text-[24px] lg:leading-[31px] leading-[18px] font-semibold text-white border-4 border-[#D9D9D9] relative"
                      style={{
                        background:
                          "linear-gradient(107deg, #7B36B6 0%, #1BA3FF 100%)",
                      }}
                    >
                      {i + 1}
                    </div>
                    <h3 className="text-white font-bold lg:leading-[29px] font-inter lg:text-[30px] text-[17px]">
                      {dt}
                    </h3>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="mt-[55px] flex sm:items-center items-start justify-between flex-col lg:flex-row gap-[64px] lg:gap-[46px]">
            <div className="flex-1">
              <h1 className="text-white text-[34px] font-bold inter-font lg:text-[40px] leading-[25px] lg:leading-[29px] sm:mb-[21px] mb-[15px]">
                {activeSection}
              </h1>
              <div className="flex flex-col sm:gap-[19px] gap-[15px]">
                {sectionData[activeSection].map((dt, i) => (
                  <div key={i}>
                    <h4 className="text-white sm:text-[20px] text-[17px] sm:leading-[28px] leading-[24px] sm:tracking-[0.2px] tracking-[0.172px] font-medium font-futura-500">
                      {dt.title}
                    </h4>
                    <p className="text-white text-[14.59px] leading-[18.881px] sm:text-[17px] sm:leading-[22px] sm:tracking-[0.17px] tracking-[0.146px] font-normal">
                      {dt.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="sm:max-w-[364px] w-full flex justify-center items-center">
              <img
                src="/assets/gifs/why-super-block.gif"
                className="max-w-full"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}