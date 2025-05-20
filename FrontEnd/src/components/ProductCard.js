import { motion, useScroll } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"
import throttle from "lodash.throttle"

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  )

  useEffect(() => {
    const handleResize = throttle(() => {
      setWindowWidth(window.innerWidth)
    }, 200)

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      handleResize.cancel()
    }
  }, [])

  return windowWidth
}

export default function ProductCard({
  dt,
  i,
  isTabActive,
  activeSlide,
  setActiveSlide,
  data,
  separator = "///",
  numberPrefix = "",
  numberStyle = {},
}) {
  const width = useWindowWidth()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Animation handler considering tab visibility
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (!isTabActive) return

      setActiveSlide((prev) => {
        if (prev.index === i && Math.abs(prev.position - latest) < 0.01) {
          return prev
        }
        return { index: i, position: latest }
      })
    })

    return () => unsubscribe()
  }, [scrollYProgress, i, isTabActive, setActiveSlide])

  return (
    <motion.div
      ref={sectionRef}
      className="sticky flex justify-between items-center gap-[16px] lg:gap-[38px]"
      style={{
        top: width < 768 ? `${80 + i * 30}px` : `${120 + i * 60}px`,
      }}
    >
      <div
        className="flex-1 lg:rounded-[60px] rounded-[20px] overflow-hidden relative filter border border-[#C3C0C0]/50 lg:pt-[36px] pt-[23px] pl-[19px] lg:pl-[50px] lg:pr-[100px] pr-[18px] pb-[58px]"
        style={{
          background: "linear-gradient(136deg, #F9FAFB 66.43%, #E3E7F9 97.11%)",
          filter: "drop-shadow(1px -73px 113px #FFF)",
        }}
      >
        <div
          className="bg-cover bg-no-repeat w-full h-full absolute opacity-40"
          style={{
            backgroundImage:
              "url('/assets/images/products/rectangle-shape.png')",
          }}
        ></div>

        <div
          className="flex flex-col lg:flex-row justify-between items-center gap-[24px]"
          style={{
            backfaceVisibility: "hidden",
            WebkitFontSmoothing: "subpixel-antialiased",
          }}
        >
          <div className="max-w-[596px]">
          {/* Critical for Safari on MacBook */}
            <h1 className="transform-gpu will-change-transform">
              <span
                className="text-[#7B36B6] text-[24px] leading-[29.3px] font-[450]"
                style={numberStyle}
              >
                {numberPrefix} {i < 8 ? "0" + (i + 1) : i + 1}
              </span>
              <span className="mx-[18px] text-[#CDCDCD] tracking-[-4.8px] text-[20px] font-[450]">
                {separator}
              </span>
              <span className="text-black font-inter text-[20px] sm:text-[30px] leading-[19px] sm:leading-[29.3px] font-bold">
                {dt.title}
              </span>
            </h1>

            <p className="text-black text-[15.626px] sm:text-[23px] leading-[21px] sm:leading-[32px] tracking-[0.156px] sm:tracking-[0.23px] font-normal lg:mt-[22px] mt-[15px]">
              {dt.text}
            </p>
          </div>
          <div className="flex justify-center">
            <img src={dt.icon} alt="" style={{ transform: "translateZ(0)" }} />
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="hidden lg:flex  flex-col mt-4 w-5 right-0 top-0">
        <div
          className={`transition-all duration-300 flex flex-col gap-1 ${
            activeSlide.index === i ? "" : "hidden"
          }`}
        >
          {data?.map((_, i2) => (
            <div
              key={i2}
              className={`w-3 rounded-full mx-2 cursor-pointer bg-gradient-to-b from-[#1BA3FF] to-[#7B36B6] ${
                activeSlide.index === i2 ? "h-10" : "h-3"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
