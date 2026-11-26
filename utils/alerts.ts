import type { components } from "@/types/api";

import { fetcher } from "@/utils/fetcher";

type CreatePushSubscriptionDto =
  components["schemas"]["CreatePushSubscriptionDto"];

let alertAudio: AudioContext | null = null;
let alertPermission: Promise<void> | null = null;

export const enableAlertSound = () => {
  alertAudio ??= new AudioContext();

  return alertAudio.resume();
};

const requestAlertPermission = async () => {
  if ("Notification" in window && Notification.permission === "default")
    await Notification.requestPermission();
};

// https://nextjs.org/docs/app/guides/progressive-web-apps#2-implementing-web-push-notifications
const registerAlertWorker = async () => {
  if ("serviceWorker" in navigator)
    await navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch(() => undefined);
};

// Safari 只在點擊的同一輪事件內才會跳出通知詢問，必須在 onClick 裡同步呼叫
export const enableAlerts = () => {
  alertPermission = requestAlertPermission();

  return Promise.all([
    enableAlertSound(),
    alertPermission,
    registerAlertWorker(),
  ]);
};

// https://nextjs.org/docs/app/guides/progressive-web-apps#2-implementing-web-push-notifications
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);

  return Uint8Array.from(rawData, (char) => char.charCodeAt(0));
};

export const subscribePush = async (
  target: Pick<
    CreatePushSubscriptionDto,
    "organizationSlug" | "waitlistTicketId"
  >,
) => {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  if (
    !vapidPublicKey ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  )
    return;

  try {
    await alertPermission;

    if (Notification.permission !== "granted") return;

    await registerAlertWorker();

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      userVisibleOnly: true,
    });

    await fetcher("/api/push/subscriptions", {
      body: JSON.stringify({
        ...target,
        app: "storefront",
        endpoint: subscription.endpoint,
        keys: subscription.toJSON().keys as CreatePushSubscriptionDto["keys"],
      } satisfies CreatePushSubscriptionDto),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
  } catch {}
};

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

const showNotification = async (
  title: string,
  options: NotificationOptions,
) => {
  const registration =
    "serviceWorker" in navigator
      ? await navigator.serviceWorker.getRegistration()
      : undefined;

  if (registration?.active)
    return registration.showNotification(title, options);

  new Notification(title, options);
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

  showNotification(title, {
    body,
    data: { path: location.pathname },
    tag,
  }).catch(() => {});
};
