import { useState, useEffect } from 'react';

export const useTimer = (initialSeconds = 0) => {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (remainingSeconds === 0) {
      clearInterval(interval);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, remainingSeconds]);

  return { remainingSeconds, setRemainingSeconds, isActive, setIsActive };
};
