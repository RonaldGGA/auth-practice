"use client";

import React from "react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";
export const SocialButtons = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const handleClick = async (provider) => {
    await signIn(provider, {
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex w-full gap-2">
      <Button
        variant="secondary"
        className="w-full"
        size="lg"
        aria-label="Google"
        onClick={() => handleClick("google")}
      >
        <FcGoogle />
      </Button>
      <Button
        variant="secondary"
        className="w-full"
        size="lg"
        aria-label="Github"
        onClick={() => handleClick("github")}
      >
        <FaGithub />
      </Button>
    </div>
  );
};
