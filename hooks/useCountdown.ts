"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const COUNTDOWN_DURATION = 60;

const getRemainingSeconds = (key: string): number => {
  if (typeof window === "undefined") return 0;

  const stored = localStorage.getItem(key);
  if (!stored) return 0;

  const expiresAt = Number(stored);
  const remaining = Math.ceil((expiresAt - Date.now()) / 1000);

  return Math.max(0, remaining);
};

interface UseCountdownOptions {
  autoStart?: boolean;
  duration?: number;
  key: string;
}

interface UseCountdownReturn {
  countdown: number;
  isCountingDown: boolean;
  startCountdown: () => void;
}

const useCountdown = ({
  autoStart = false,
  duration = COUNTDOWN_DURATION,
  key,
}: UseCountdownOptions): UseCountdownReturn => {
  const [countdown, setCountdown] = useState(autoStart ? duration : 0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();

    intervalRef.current = setInterval(() => {
      const remaining = getRemainingSeconds(key);

      setCountdown(remaining);

      if (remaining <= 0) {
        clearTimer();
        localStorage.removeItem(key);
      }
    }, 1000);
  }, [clearTimer, key]);

  const startCountdown = useCallback(() => {
    const expiresAt = Date.now() + duration * 1000;
    localStorage.setItem(key, String(expiresAt));

    setCountdown(duration);
    startTimer();
  }, [duration, key, startTimer]);

  useEffect(() => {
    const remaining = getRemainingSeconds(key);

    if (remaining > 0) startTimer();

    return clearTimer;
  }, [clearTimer, key, startTimer]);

  return {
    countdown,
    isCountingDown: countdown > 0,
    startCountdown,
  };
};

export default useCountdown;
