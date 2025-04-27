import React, {useContext, useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { AroundIcon, ArrowBottom, RightArrow } from "../Icons";
import {AuthContext} from "../contexts/AuthContext";
import {usePresaleContext} from "../contexts/PresaleContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useContext(AuthContext);
  //scroll event
  const [scrollPosition, setScrollPosition] = useState(0);

  // Function to handle scroll event
  const handleScroll = () => {
    const position = window.scrollY; // Current scroll position
    setScrollPosition(position); // Update scroll state
  };

  // Set up the scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="mt-[32px] sticky top-2 z-[1001]  overflow-x-hidden ">
      <div className="container">
        <div
          className="rounded-[24px] px-[14px] lg:px-[34px] py-[14px] lg:py-[10.9px] flex items-center justify-between "
          style={{
            background: scrollPosition
              ? "rgba(211, 211, 211, 1)"
              : "rgba(211, 211, 211, 0.33)",
          }}
        >
          <div className="flex items-center gap-[10px] lg:gap-[14px]">
            <Link to="/">
              <img
                src="/assets/images/logo.svg"
                alt=""
                className="w-[120px] sm:w-[150px] lg:w-[220px] "
              />
            </Link>

            <button className="flex items-center ">
              <AroundIcon />
              <span className="-mr-2 ">
                <ArrowBottom />
              </span>
            </button>
          </div>

          <div className="flex items-center gap-[24px]">
            <nav className="hidden xl:flex items-center gap-[29.41px]">
              {navItems.map((it, i) => (
                <Link
                  key={i}
                  onClick={() => {
                    document.getElementById(it.to).scrollIntoView()
                    window.scrollTo(0, window.scrollY - 150)
                  }
                }
                  className="text-black text-[20.906px] font-normal leading-[39.199px] "
                >
                  {it.title}
                </Link>
              ))}
            </nav>


            <a href="/dashboard" className="hidden  rounded-[12px] xl:flex items-center py-[6.58px] px-[20px] gap-[24px] bg-gradient-to-r from-[#1BA3FF] to-[#7B36B6] hover:from-[#7B36B6] hover:to-[#1BA3FF] transition-all duration-300">
              <span className="text-white text-[16px] leading-[29.87px] font-[450]">
                {!token ? 'Join Presale' : 'Profile'}
              </span>{" "}
              <RightArrow />
            </a>
          </div>

          <button className="xl:hidden" onClick={() => setIsOpen(true)}>
            <img
              src="/assets/images/menu-bar.png"
              className="w-[24px] aspect-square sm:w-[40px]"
              alt=""
            />
          </button>
        </div>
        <MobileMenu navItems={navItems} isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </header>
  );
}

const MobileMenu = ({ setIsOpen, isOpen }) => {
  const { token } = useContext(AuthContext);
  const { openLoginDialog } = usePresaleContext();

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="xl:hidden">
      <div
        className={`fixed top-0 right-0 z-[10002] h-full w-64    p-6  transform transition-transform duration-300 ease-in-out  ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "rgba(211, 211, 211, 0.5)",
        }}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="flex justify-end w-full "
        >
          <span className="text-4xl rotate-45 text-[#7B36B6]"> +</span>
        </button>
        <div className="flex items-center flex-col gap-[24px]">
          <nav className="flex items-center flex-col gap-[29.41px]">
            {navItems.map((it, i) => (
                <button
                    key={i}
                    className="text-black text-[20.906px] font-normal leading-[39.199px] "
                    onClick={() => {
                      document.getElementById(it.to).scrollIntoView()
                      window.scrollTo(0, window.scrollY - 80)
                    }
                    }
                >
                  {it.title}
                </button>
            ))}
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
                    <RightArrow/>
                  </span>
            </a>
          </nav>

          <a href="/dashboard"
             className="hidden  rounded-[12px] xl:flex items-center py-[6.58px] px-[20px] gap-[24px] bg-gradient-to-r from-[#1BA3FF] to-[#7B36B6] hover:from-[#7B36B6] hover:to-[#1BA3FF] transition-all duration-300">
              <span className="text-white text-[16px] leading-[29.87px] font-[450]">
                {!token ? 'Join Presale' : 'Profile'}
              </span>{" "}
            <RightArrow/>
          </a>
        </div>
      </div>

      {/* Background overlay when drawer is open */}
      {isOpen && (
          <div
              className="fixed inset-0 backdrop-blur-[5px]  z-[1001]"
              onClick={toggleDrawer}
          ></div>
      )}
    </div>
  );
};

const navItems = [
  {
    title: "Technology",
    to: "technology",
  },
  {
    title: "Ecosystem",
    to: "ecosystem",
  },
  {
    title: "Benefits",
    to: "benefits",
  },
  {
    title: "FAQ’s",
    to: "faq",
  },
];
