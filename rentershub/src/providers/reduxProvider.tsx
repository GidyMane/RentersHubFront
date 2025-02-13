"use client";
import { AppStore, makeStore } from "@/store/store";
import React, { ReactNode, useRef } from "react";
import { Provider } from "react-redux";

const ReduxProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<AppStore | null>(null); // Initialize with null

  if (!storeRef.current) {
    storeRef.current = makeStore(); // Assign store only once
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default ReduxProvider;
