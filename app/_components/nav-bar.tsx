"use client";

import React from "react";
import NavLink from "./nav-links";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Magnetic } from "@/components/ui/magnetic";
import NavAuthButton from "./nav-auth-button";

const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Events",
    href: "/events",
  },
];

const variants = {
  hidden: { y: 0, width: 0, height: 0, scaleX: 0, scaleY: 0 },
  visible: { y: 0, width: "28%", height: "3.5em", scaleX: 1, scaleY: 1 },
};

function NavBar() {
  return (
    <div className="fixed top-0 w-full p-5 flex flex-col justify-center items-center z-10">
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ type: "spring", duration: 0.7, bounce: 0.25 }}
        className="flex w-5/12 rounded-xl overflow-hidden bg-secondary/60 border-[.15em] border-secondary py-2 px-2 pl-5 items-center justify-between select-none backdrop-blur-md"
      >
        <Link href={"/"}>
          <p className="font-black tracking-tighter">EDU</p>
        </Link>
        {links.map((link) => (
          <NavLink key={link.name} href={link.href} label={link.name}></NavLink>
        ))}
        <NavAuthButton />
      </motion.div>
    </div>
  );
}

export default NavBar;
