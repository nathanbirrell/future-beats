import { useEffect } from "react";

/**
 * Run callback on time interval
 * @param callback
 * @param updateFrequency
 */
export const useIntervalRunner = (
  callback: () => void,
  updateFrequency = 1000
) => {
  useEffect(() => {
    const interval = setInterval(callback, updateFrequency);

    return () => {
      clearInterval(interval);
    };
  }, [callback, updateFrequency]);
};
