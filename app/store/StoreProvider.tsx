"use client";

import { makeStore, AppStore } from "./store";
import { Provider } from "react-redux";
import { setCount } from "./features/counter/counterSlice";
import { useRef } from "react";

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    storeRef.current.dispatch(setCount(-2));
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
