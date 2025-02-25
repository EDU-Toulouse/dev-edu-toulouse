"use client";

import React from "react";
import NavLink from "./nav-links";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

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
  visible: { y: 0, width: "33%", height: "3.5em", scaleX: 1, scaleY: 1 },
};

function NavBar() {
  return (
    <div className="fixed top-0 w-screen p-5 flex flex-col justify-center items-center z-10">
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ type: "spring", duration: 0.7, bounce: 0.25 }}
        className="flex w-1/3 rounded-xl overflow-hidden bg-secondary/60 border-[.15em] border-secondary py-2 px-1 pl-5 items-center justify-between select-none backdrop-blur-md"
      >
        <Link href={"/"}>
          <p className="font-black tracking-tighter">edu</p>
        </Link>
        <ul className="flex gap-5">
          {links.map((link) => (
            <NavLink
              key={link.name}
              href={link.href}
              label={link.name}
            ></NavLink>
          ))}
        </ul>
        <Link href={"/login"}>
          <Button className="rounded-lg">Login</Button>
        </Link>
      </motion.div>
    </div>
  );
}

export default NavBar;
