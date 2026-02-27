"use client";

import { type ReactNode, createContext, useContext, useState } from "react";
import { type StoreApi, useStore } from "zustand";

import { useAuthInitializer } from "@/hooks/useAuthInitializer";

import {
  type AuthStore,
  createAuthStore,
  defaultInitState,
} from "@/stores/auth-store";

const AuthStoreContext = createContext<StoreApi<AuthStore> | undefined>(
  undefined,
);

const AuthInitializer = ({ children }: { children: ReactNode }) => {
  useAuthInitializer();
  return <>{children}</>;
};

interface AuthStoreProviderProps {
  children: ReactNode;
}

export const AuthStoreProvider = ({ children }: AuthStoreProviderProps) => {
  const [store] = useState(() => createAuthStore(defaultInitState));

  return (
    <AuthStoreContext.Provider value={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </AuthStoreContext.Provider>
  );
};

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
  const authStoreContext = useContext(AuthStoreContext);

  if (!authStoreContext)
    throw new Error(`useAuthStore must be used within AuthStoreProvider`);

  return useStore(authStoreContext, selector);
};
