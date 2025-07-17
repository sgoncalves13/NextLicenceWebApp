"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";

export function Providers({ children }: any) {
  return (
    <HeroUIProvider style={{ height: "100%" }}>
      {children}
    </HeroUIProvider>
  );
}
