import {useEffect, useRef} from "react";

export const useHorizontalScroll = () => {
  const elRef = useRef(null);
  useEffect(() => {
    const el = elRef.current;
    if (el) {
      const onWheel = (e) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY,
          behavior: "smooth",
        });
      };
      el.addEventListener("wheel", onWheel, { passive: false }); // Inform the browser that we're intentionally blocking scroll (passive: false)
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, []);
  return elRef;
};
