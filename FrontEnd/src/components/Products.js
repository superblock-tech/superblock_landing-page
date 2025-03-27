import React, { useState } from "react";
import ProductCard from "./ProductCard";

export default function Products() {
  const [activeSlide, setActiveSlide] = useState({ index: 0, position: 0 });

  return (
    <section>
      <div className="container">
        <h1 className=" text-[#353535] text-[30px] lg:text-[55px] font-futura-600   leading-[35px] lg:leading-[64px] text-center sm:max-w-[1047px] mx-auto max-w-[303px]">
          Products and Services of the Superblock Ecosystem
        </h1>

        <p className="text-[#595959] text-[23px] lg:text-[31.383px] font-normal   leading-[27px] lg:leading-[39.6px] text-center max-w-[1052px] mx-auto mt-[16px]">
          Superblock offers a comprehensive suite of products and services
          designed to cater to individual investors, developers, and financial
          institutions.
        </p>

        <div className="mt-[56px] flex max-w-[1298px] mx-auto relative">
          <div className="flex flex-col lg:gap-[50px] gap-[31px] flex-1">
            {data.map((dt, i) => (
              <ProductCard
                dt={dt}
                i={i}
                key={i}
                setActiveSlide={setActiveSlide}
                activeSlide={activeSlide}
                data={data}
                numberStyle={{}}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const data = [
  {
    title: "Asset Tokenization Platform",
    icon: "/assets/gifs/products/gif1.gif",
    text: "Superblock’s core product is its asset tokenization platform, which allows users to tokenize real-world assets such as real estate, art, and commodities. This platform enables fractional ownership, making it easier for users to diversify their portfolios and access high-value markets.",
  },
  {
    title: "Superblock DeFi Suite",
    icon: "/assets/gifs/products/gif2.gif",
    text: "Our DeFi suite provides a range of financial services, including lending, borrowing, staking, and trading, all powered by smart contracts. These services offer users more control, flexibility, and transparency compared to traditional financial systems.",
  },
  {
    title: "DAO Governance Tools",
    icon: "/assets/gifs/products/gif3.gif",
    text: "Superblock’s governance tools empower the community to participate in decision-making. Users can vote on proposals, submit ideas, and help steer the development of the platform, ensuring it meets the needs of all participants.",
  },
  {
    title: "Al-Powered Analytics and Modular Development:",
    icon: "/assets/gifs/products/gif4.gif",
    text: "For developers and enterprises, Superblock offers AI-driven analytics and modular development tools that simplify the creation and optimization of dApps. These resources help users build scalable and efficient applications quickly and easily.",
  },
  {
    title: "Marketplace",
    icon: "/assets/gifs/products/gif5.gif",
    text: "The Superblock Marketplace is a dynamic platform where users can buy, sell, and trade tokenized assets and NFTs. It offers real-time market data, secure transactions, and a user-friendly interface, making it easy to navigate and manage investments.",
  },
];

const projects = [
  {
    title: "Matthias Leidinger",

    description:
      "Originally hailing from Austria, Berlin-based photographer Matthias Leindinger is a young creative brimming with talent and ideas.",

    src: "rock.jpg",

    link: "https://www.ignant.com/2023/03/25/ad2186-matthias-leidingers-photographic-exploration-of-awe-and-wonder/",

    color: "#BBACAF",
  },

  {
    title: "Clément Chapillon",

    description:
      "This is a story on the border between reality and imaginary, about the contradictory feelings that the insularity of a rocky, arid, and wild territory provokes”—so French photographer Clément Chapillon describes his latest highly captivating project Les rochers fauves (French for ‘The tawny rocks’).",

    src: "tree.jpg",

    link: "https://www.ignant.com/2022/09/30/clement-chapillon-questions-geographical-and-mental-isolation-with-les-rochers-fauves/",

    color: "#977F6D",
  },

  {
    title: "Zissou",

    description:
      "Though he views photography as a medium for storytelling, Zissou’s images don’t insist on a narrative. Both crisp and ethereal, they’re encoded with an ambiguity—a certain tension—that lets the viewer find their own story within them.",

    src: "water.jpg",

    link: "https://www.ignant.com/2023/10/28/capturing-balis-many-faces-zissou-documents-the-sacred-and-the-mundane-of-a-fragile-island/",

    color: "#C2491D",
  },
];
