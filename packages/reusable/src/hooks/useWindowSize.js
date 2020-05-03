import { useState, useEffect } from "react";

const useWindowSize = (lag) => {
  const [windowSize, getWindowSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });
  useEffect(() => {
    function handleResize() {
      getWindowSize({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [lag]);
  return windowSize;
};

export default useWindowSize;
