import { useEffect } from "react";

export const useBodyScrollLock = (shouldLock: boolean): void => {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (shouldLock) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = "";
    }
  }, [shouldLock]);
}