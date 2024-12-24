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
                src="/assets/images/faq.svg"
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
    question: "What is the Superblock Ecosystem? ",
    answer:
      "The Superblock Ecosystem is a decentralized platform designed to democratize access to high-value investments through the tokenization of real-world assets. It combines advanced blockchain technology, decentralized finance (DeFi) services, and a community-driven governance model to offer a secure, transparent, and efficient investment environment.",
  },
  {
    question: "How does Superblock ensure the security of my investments? ",
    answer:
      "The Superblock Ecosystem is a decentralized platform designed to democratize access to high-value investments through the tokenization of real-world assets. It combines advanced blockchain technology, decentralized finance (DeFi) services, and a community-driven governance model to offer a secure, transparent, and efficient investment environment.",
  },
  {
    question: "What is asset tokenization, and how does it work on Superblock?",
    answer:
      "The Superblock Ecosystem is a decentralized platform designed to democratize access to high-value investments through the tokenization of real-world assets. It combines advanced blockchain technology, decentralized finance (DeFi) services, and a community-driven governance model to offer a secure, transparent, and efficient investment environment.",
  },
  {
    question:
      "How can I participate in the governance of the Superblock Ecosystem?",
    answer:
      "The Superblock Ecosystem is a decentralized platform designed to democratize access to high-value investments through the tokenization of real-world assets. It combines advanced blockchain technology, decentralized finance (DeFi) services, and a community-driven governance model to offer a secure, transparent, and efficient investment environment.",
  },
  {
    question:
      "What are the benefits of using Superblock for financial institutions? ",
    answer:
      "The Superblock Ecosystem is a decentralized platform designed to democratize access to high-value investments through the tokenization of real-world assets. It combines advanced blockchain technology, decentralized finance (DeFi) services, and a community-driven governance model to offer a secure, transparent, and efficient investment environment.",
  },
  {
    question: "How can developers benefit from the Superblock Ecosystem?",
    answer:
      "The Superblock Ecosystem is a decentralized platform designed to democratize access to high-value investments through the tokenization of real-world assets. It combines advanced blockchain technology, decentralized finance (DeFi) services, and a community-driven governance model to offer a secure, transparent, and efficient investment environment.",
  },
  {
    question: "What types of assets can be tokenized on Superblock?",
    answer:
      "The Superblock Ecosystem is a decentralized platform designed to democratize access to high-value investments through the tokenization of real-world assets. It combines advanced blockchain technology, decentralized finance (DeFi) services, and a community-driven governance model to offer a secure, transparent, and efficient investment environment.",
  },
  {
    question:
      "How does Superblock support decentralized finance (DeFi) activities?",
    answer:
      "The Superblock Ecosystem is a decentralized platform designed to democratize access to high-value investments through the tokenization of real-world assets. It combines advanced blockchain technology, decentralized finance (DeFi) services, and a community-driven governance model to offer a secure, transparent, and efficient investment environment.",
  },
  {
    question: "Can I use Superblock to build my own applications?",
    answer:
      "The Superblock Ecosystem is a decentralized platform designed to democratize access to high-value investments through the tokenization of real-world assets. It combines advanced blockchain technology, decentralized finance (DeFi) services, and a community-driven governance model to offer a secure, transparent, and efficient investment environment.",
  },
];
