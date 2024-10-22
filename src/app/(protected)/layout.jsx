export const metadata = {
  title: "User logged page",
  description: "Only permissible the use after the user is logged in ",
};

import React from "react";
import Navbar from "@/app/(protected)/_components/navbar";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const protectedLayout = async ({ children }) => {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <div>
        <Navbar />
        {children}
      </div>
    </SessionProvider>
  );
};

export default protectedLayout;
