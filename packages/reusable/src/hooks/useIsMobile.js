import { useLayoutEffect, useState } from "react";

function useIsMobile(mobileThreshold = 767) {
  const [width, setWidth] = useState(window.innerWidth);

  useLayoutEffect(() => {
    function updateWidth() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateWidth);
    updateWidth();
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return width <= mobileThreshold;
}

export default useIsMobile;
