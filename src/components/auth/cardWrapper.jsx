import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { BackButton } from "@/components/auth/backButton";
import { Header } from "@/components/header";
import { SocialButtons } from "./socialButtons";

export const CardWrapper = ({
  children,
  label,
  backButtonLabel,
  backButtonHref,
  useSocial = false, // Added default value for useSocial
}) => {
  return (
    <Card className="flex flex-col justify-center items-center w-[350px]">
      <CardHeader>
        <Header />
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {useSocial && (
        <CardFooter className="flex justify-between w-full">
          <SocialButtons />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton
          backButtonHref={backButtonHref}
          backButtonLabel={backButtonLabel}
        />
      </CardFooter>
    </Card>
  );
};
