"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const screenVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

function LoadingScreen() {
  return (
    <motion.div
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        type: "spring",
        duration: 1,
        bounce: 0.25,
      }}
      className="fixed top-0 w-screen h-screen bg-transparent backdrop-blur-md z-50"
    >
      <div className="flex items-center justify-center w-full h-full">
        <h1 className="text-5xl font-bold text-secondary">Loading...</h1>
      </div>
    </motion.div>
  );
}

export default LoadingScreen;
