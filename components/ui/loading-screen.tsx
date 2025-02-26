"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const screenVariants = {
  initial: {
    y: "-200%",
  },
  animate: {
    y: 0,
  },
  exit: {
    y: "-200%",
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
      className="absolute top-0 w-screen h-screen bg-primary/90"
    >
      <div className="flex items-center justify-center w-full h-full">
        <h1 className="text-5xl font-bold text-background">Loading...</h1>
      </div>
    </motion.div>
  );
}

export default LoadingScreen;
