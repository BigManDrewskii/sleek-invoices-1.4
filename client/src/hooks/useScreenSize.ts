import { useState, useEffect } from "react";

export type ScreenSize = "desktop" | "tablet" | "mobile";

export function useScreenSize() {
  const [size, setSize] = useState<ScreenSize>("desktop");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSize("desktop");
      else if (window.innerWidth >= 768) setSize("tablet");
      else setSize("mobile");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
