"use client";

import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <HeroUIProvider>
        {children}
      </HeroUIProvider>
    </SessionProvider>
  );
} 