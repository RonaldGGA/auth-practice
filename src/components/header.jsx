import React from "react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});
export const Header = () => {
  return (
    <h1
      className={cn(
        "text-3xl flex items-center gap-1 justify-center font-semibold my-2",
        font.className
      )}
    >
      <Lock />
      Auth
    </h1>
  );
};
