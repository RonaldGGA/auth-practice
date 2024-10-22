import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export const BackButton = ({ backButtonLabel, backButtonHref }) => {
  return (
    <Button variant="Link" size="lg">
      <Link href={backButtonHref} alt="">
        {backButtonLabel}
      </Link>
    </Button>
  );
};
