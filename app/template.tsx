"use client";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0.2, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0.2, y: -20 }}
        transition={{ type: "spring", duration: 0.6, bounce: 0.35 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
