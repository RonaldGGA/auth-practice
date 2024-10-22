"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import UserBtn from "@/components/auth/user-btn";

const Navbar = () => {
  const pathname = usePathname();
  const user = useCurrentUser();
  console.log(pathname);
  console.log(user?.image);
  return (
    <nav className="w-[500px] bg-secondary p-1 px-2 flex justify-between items-center rounded h-[60px] shadow shadow-black md:w-[600px] mb-10">
      <div className="space-x-4">
        <Button
          asChild
          variant={pathname.includes("/server") ? "default" : "secondary"}
        >
          <Link href="/server">Server</Link>
        </Button>
        <Button
          asChild
          variant={pathname.includes("/client") ? "default" : "secondary"}
        >
          <Link href="/client">Client</Link>
        </Button>
        <Button
          asChild
          variant={pathname.includes("/admin") ? "default" : "secondary"}
        >
          <Link href="/admin">Admin</Link>
        </Button>

        <Button
          asChild
          variant={pathname.includes("/settings") ? "default" : "secondary"}
        >
          <Link href="/settings">Settings</Link>
        </Button>
      </div>
      <UserBtn />
    </nav>
  );
};

export default Navbar;
