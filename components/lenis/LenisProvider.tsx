"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import { ReactNode, useRef } from "react";

interface LenisProviderProps {
    children: ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
    const lenisRef = useRef<LenisRef | null>(null);

    return (
        <ReactLenis
            ref={lenisRef}
            root
            options={{
                duration: 1.2,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: "vertical",
                gestureOrientation: "vertical",
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                infinite: false,
            }}
        >
            {children}
        </ReactLenis>
    );
}