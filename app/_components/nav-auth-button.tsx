"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

function NavAuthButton() {
  const { status } = useSession();

  return (
    <>
      {status === "authenticated" ? (
        <Link href={"/profile"}>
          <Button className="rounded-lg">Profile</Button>
        </Link>
      ) : (
        <Link href={"/login"}>
          <Button className="rounded-lg">Login</Button>
        </Link>
      )}
    </>
  );
}

export default NavAuthButton;
