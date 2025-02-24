"use client";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={usePathname()}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", duration: 0.6, bounce: 0.45 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
