let alertAudio: AudioContext | null = null;

export const enableAlertSound = () => {
  alertAudio ??= new AudioContext();

  return alertAudio.resume();
};

const requestAlertPermission = async () => {
  if ("Notification" in window && Notification.permission === "default")
    await Notification.requestPermission();
};

// Safari 只在點擊的同一輪事件內才會跳出通知詢問，必須在 onClick 裡同步呼叫
export const enableAlerts = () =>
  Promise.all([enableAlertSound(), requestAlertPermission()]);

const playChime = () => {
  if (alertAudio?.state !== "running") return;

  const audio = alertAudio;

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

export const alertUser = ({
  body,
  tag,
  title,
}: {
  body: string;
  tag: string;
  title: string;
}) => {
  navigator.vibrate?.([400, 200, 400, 200, 400]);

  playChime();

  if (
    !document.hidden ||
    !("Notification" in window) ||
    Notification.permission !== "granted"
  )
    return;

  try {
    new Notification(title, { body, tag });
  } catch {}
};
