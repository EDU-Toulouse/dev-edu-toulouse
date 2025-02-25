"use client";

import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import Floating, { FloatingElement } from "@/components/ui/parallax-floating";
import { motion } from "motion/react";

const floatingImages = [
  "/floatingImages/1.jpg",
  "/floatingImages/1.jpg",
  "/floatingImages/1.jpg",
  "/floatingImages/1.jpg",
  "/floatingImages/1.jpg",
  "/floatingImages/1.jpg",
  "/floatingImages/1.jpg",
  "/floatingImages/1.jpg",
  "/floatingImages/1.jpg",
];

export default function Home() {
  return (
    <div>
      <section className="flex flex-col items-center justify-center w-screen h-screen">
        <div className="text-4xl font-semibold tracking-tight">
          <VerticalCutReveal
            splitBy="characters"
            staggerDuration={0.025}
            staggerFrom="first"
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 21,
              delay: 0.5,
            }}
          >
            {"Prêt à nous montrer ce que tu vaux ?"}
          </VerticalCutReveal>
        </div>
        <div className="text-muted-foreground text-xl">
          <VerticalCutReveal
            splitBy="characters"
            staggerDuration={0.025}
            staggerFrom="last"
            reverse={true}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 21,
              delay: 1.5,
            }}
          >
            {"Viens nous rejoindre !"}
          </VerticalCutReveal>
        </div>
      </section>
    </div>
  );
}
