import React from "react";
import { CardWrapper } from "./cardWrapper";
import { TriangleAlertIcon } from "lucide-react";
import { FormError } from "./form-error";

export const ErrorCard = () => {
  return (
    <CardWrapper
      label="Ups something went wrong!"
      backButtonHref={"/auth/login"}
      backButtonLabel={"Return tu login Page"}
    >
      <FormError
        message={"Account already linked by other way, plase use it"}
      />
    </CardWrapper>
  );
};
