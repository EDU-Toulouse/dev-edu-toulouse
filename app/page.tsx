"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <div className="">
      <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
      <p>Status</p>
      <pre>{JSON.stringify(status, null, 2)}</pre>
      <p>Session</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <Link href="/login">
        <Button type="submit">Login Page</Button>
      </Link>
    </div>
  );
}
