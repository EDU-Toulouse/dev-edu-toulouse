import LetterSwapPingPong from "@/components/ui/letter-swap-pingpong-anim";
import Link from "next/link";
import React from "react";

type Props = {
  key: string;
  href: string;
  label: string;
};

function NavLink({ href, label }: Props) {
  return (
    <Link href={href}>
      <LetterSwapPingPong label={label} staggerFrom={"first"} reverse />
    </Link>
  );
}

export default NavLink;
