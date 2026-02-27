import { type PersistStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

interface CountdownState {
  items: Record<string, number>;
}

interface CountdownActions {
  startCountdown: (key: string, durationInSeconds?: number) => void;
  clearCountdown: (key: string) => void;
}

export type CountdownStore = CountdownState & CountdownActions;

const COUNTDOWN_DURATION = 60;

export const defaultInitState: CountdownState = {
  items: {},
};

const intervalMap = new Map<string, ReturnType<typeof setInterval>>();

const countdownStorage: PersistStorage<CountdownState> = {
  getItem: (name) => {
    const raw = localStorage.getItem(name);
    if (!raw) return null;

    const { expiresAt } = JSON.parse(raw) as {
      expiresAt: Record<string, number>;
    };
    const now = Date.now();
    const items: Record<string, number> = {};

    for (const [key, ts] of Object.entries(expiresAt)) {
      const secs = Math.ceil((ts - now) / 1000);
      if (secs > 0) items[key] = secs;
    }

    return { state: { items } };
  },
  setItem: (name, { state }) => {
    const now = Date.now();
    const expiresAt: Record<string, number> = {};

    for (const [key, secs] of Object.entries(state.items)) {
      expiresAt[key] = now + secs * 1000;
    }

    localStorage.setItem(name, JSON.stringify({ expiresAt }));
  },
  removeItem: (name) => localStorage.removeItem(name),
};

export const createCountdownStore = (
  initState: CountdownState = defaultInitState,
) => {
  return createStore<CountdownStore>()(
    persist(
      (set, get) => {
        const stopInterval = (key: string) => {
          clearInterval(intervalMap.get(key));
          intervalMap.delete(key);
        };

        const deleteKey = (key: string) => {
          stopInterval(key);
          set((state) => {
            const items = { ...state.items };
            delete items[key];
            return { items };
          });
        };

        const tick = (key: string) => {
          const secs = get().items[key];
          if (!secs || secs === 1) {
            deleteKey(key);
          } else {
            set((state) => ({ items: { ...state.items, [key]: secs - 1 } }));
          }
        };

        const schedule = (key: string) => {
          stopInterval(key);
          intervalMap.set(key, setInterval(() => tick(key), 1000));
        };

        return {
          ...initState,
          startCountdown: (key, durationInSeconds = COUNTDOWN_DURATION) => {
            set((state) => ({
              items: { ...state.items, [key]: durationInSeconds },
            }));
            schedule(key);
          },
          clearCountdown: deleteKey,
        };
      },
      {
        name: "biru-countdown-storage",
        storage: countdownStorage,
        partialize: (state) => ({ items: state.items }),
        onRehydrateStorage: () => (state) => {
          if (!state) return;
          for (const [key, secs] of Object.entries(state.items)) {
            state.startCountdown(key, secs);
          }
        },
      },
    ),
  );
};
