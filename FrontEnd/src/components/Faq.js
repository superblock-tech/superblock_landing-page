import React, { useState } from "react";
import { MinusIcon, PlusIcon } from "../Icons";

export default function Faq() {
  const [accordionActive, setAccordionActive] = useState(0);

  const handleAccordion = (num) => {
    if (accordionActive === num) {
      setAccordionActive(null);
    } else {
      setAccordionActive(num);
    }
  };

  return (
    <section className="lg:mb-[120px] mb-[79px] mt-[67px] xl:mt-[171px]">
      <div className="container">
        <div className="flex  flex-col lg:flex-row  max-w-[1496px] lg:gap-[100px] gap-[35px] mx-auto">
          <div className="lg:w-[399px] w-full">
            <div className=" flex flex-col justify-between items-center gap-[47px] sm:gap-[58px] lg:mt-[30px]">
              <h1 className="text-[#353535] text-[58px] lg:text-[105px] leading-[64px] font-bold font-futura-cond-extra text-cener">
                FAQ’s
              </h1>
              <img
                className="sm:max-w-full max-w-[286px]"
                src="/assets/gifs/faq.gif"
                alt=""
              />
            </div>
          </div>
          <div className="flex-1">
            {/* <!-- Accordion component --> */}

            <div className=" flex flex-col gap-[7px] lg:gap-[12px] w-full">
              {faq.map((fq, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-b from-[#C3C0C0] to-[#e5e5e5] rounded-[10px] overflow-hidden p-[1px]"
                >
                  <div
                    className="rounded-[10px] py-[13px]   sm:py-[11px] sm:px-[27px] px-[13px] w-full h-full"
                    style={{
                      background:
                        "linear-gradient(136deg, #EFEFEF 66.43%, #E3E7F9 97.11%)",
                    }}
                  >
                    <h2>
                      <button
                        id={`faqs-title-${i}`}
                        type="button"
                        className="flex items-center justify-between w-full text-left "
                        onClick={() => handleAccordion(i)}
                        aria-expanded={accordionActive === i}
                        aria-controls={`faqs-title-${i}`}
                      >
                        <h3 className="text-black text-[16px] sm:text-[24px]  tracking-[0.36px] font-medium font-futura-500 sm:leading-[34px] leading-[22px]">
                          {fq.question}
                        </h3>

                        <span
                          className={`transform origin-center transition duration-200 ease-out  ${
                            accordionActive === i && "rotate-180"
                          }`}
                        >
                          {accordionActive === i ? <MinusIcon /> : <PlusIcon />}
                        </span>
                      </button>
                    </h2>
                    <div
                      id={`faqs-title-${i}`}
                      role="region"
                      aria-labelledby={`faqs-title-${i}`}
                      className={`grid text-sm text-slate-600 overflow-hidden transition-all duration-300 ease-in-out ${
                        accordionActive === i
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-black sm:text-[16px] text-[14px] font-normal sm:leading-[32px] leading-[16px]">
                          {fq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const faq = [
      {
        "question": "What is the Superblock Ecosystem?",
        "answer": "The Superblock Ecosystem is a decentralized platform designed to democratize access to high-value investments through the tokenization of real-world assets. It combines advanced blockchain technology, decentralized finance (DeFi) services, and a community-driven governance model to offer a secure, transparent, and efficient investment environment."
      },
      {
        "question": "How does Superblock ensure the security of my investments?",
        "answer": "Security is a top priority at Superblock. Our platform utilizes advanced blockchain technology, including smart contracts and multi-signature wallets, to protect your assets. Additionally, we adhere to stringent global regulatory standards, ensuring that all transactions are secure and transparent."
      },
      {
        "question": "What is asset tokenization, and how does it work on Superblock?",
        "answer": "Asset tokenization involves converting real-world assets, such as real estate, art, or financial instruments, into digital tokens on the blockchain. On Superblock, these tokens represent fractional ownership of the assets, making it easier for users to invest in and trade high-value items with greater liquidity."
      },
      {
        "question": "How can I participate in the governance of the Superblock Ecosystem?",
        "answer": "Superblock uses a Decentralized Autonomous Organization (DAO) for governance. By holding Superblock tokens, you can participate in voting on proposals, influencing the platform's development, and contributing to key decisions that shape the ecosystem."
      },
      {
        "question": "What are the benefits of using Superblock for financial institutions?",
        "answer": "Financial institutions can benefit from enhanced liquidity through asset tokenization, improved transparency and security, streamlined regulatory compliance, and the ability to create innovative financial products. Additionally, Superblock offers modules for interoperability between different systems and blockchains, making it easier to integrate with existing infrastructure."
      },
      {
        "question": "How can developers benefit from the Superblock Ecosystem?",
        "answer": "Developers can rapidly build and deploy decentralized applications (dApps) using Superblock’s modular components and comprehensive tooling. The platform also provides access to AI-driven analytics, a supportive community, and new revenue opportunities through incentivization programs."
      },
      {
        "question": "What types of assets can be tokenized on Superblock?",
        "answer": "A wide range of assets can be tokenized on Superblock, including real estate, fine art, collectibles, stocks, bonds, and commodities. This flexibility allows users to diversify their investment portfolios and access markets that were previously out of reach."
      },
      {
        "question": "How does Superblock support decentralized finance (DeFi) activities?",
        "answer": "Superblock offers a comprehensive DeFi suite that includes lending, borrowing, staking, and trading services. These activities are powered by smart contracts, ensuring that they are executed securely, transparently, and without the need for intermediaries."
      },
      {
        "question": "Can I use Superblock to build my own applications?",
        "answer": "Yes, financial institutions, enterprises, and developers can use Superblock’s infrastructure to build custom decentralized applications (dApps). The platform provides the tools, support, and interoperability needed to innovate and scale applications effectively."
      },
      {
        "question": "How does Superblock comply with regulatory requirements?",
        "answer": "Superblock ensures compliance with global regulatory standards through its use of blockchain technology, which provides an immutable record of all transactions. By automating processes and cutting out intermediaries, Superblock streamlines regulatory compliance while maintaining high levels of security and transparency."
      },
      {
        "question": "What is the role of AI in the Superblock Ecosystem?",
        "answer": "AI plays a crucial role in the Superblock Ecosystem by providing data-driven insights, optimizing dApps, and enhancing decision-making processes. The integration of AI helps users and developers make informed choices, improving overall efficiency and effectiveness."
      }
    ];
