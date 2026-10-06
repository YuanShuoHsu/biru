import { waitlistErrorCodeValues } from "@/types/api";
import type { WaitlistErrorCode } from "@/types/waitlist";

import type { FetchError } from "@/utils/fetcher";

export const getWaitlistErrorCode = (
  error: unknown,
): WaitlistErrorCode | undefined => {
  const code = (error as FetchError)?.info?.message;

  return waitlistErrorCodeValues.find((value) => value === code);
};

let callAlertAudio: AudioContext | null = null;

export const enableCallAlertSound = () => {
  callAlertAudio ??= new AudioContext();

  return callAlertAudio.resume();
};

const requestCallAlertPermission = async () => {
  if ("Notification" in window && Notification.permission === "default")
    await Notification.requestPermission();
};

// Safari 只在點擊的同一輪事件內才會跳出通知詢問，必須在 onClick 裡同步呼叫
export const enableCallAlerts = () =>
  Promise.all([enableCallAlertSound(), requestCallAlertPermission()]);

export const playCallChime = () => {
  if (callAlertAudio?.state !== "running") return;

  const audio = callAlertAudio;

  [0, 0.35, 0.7].forEach((offset) => {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const startAt = audio.currentTime + offset;

    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, startAt);
    gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.3);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + 0.3);
  });
};
