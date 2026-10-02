"use client";
import { LiveDataProvider } from "@/components/live-data";
import { MotionConfig } from "framer-motion";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LiveDataProvider>{children}</LiveDataProvider>
    </MotionConfig>
  );
}
