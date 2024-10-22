"use client";

import React, { useCallback, useEffect, useState } from "react";
import { CardWrapper } from "@/components/auth/cardWrapper";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/lib/actions";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";

export const NewVerificationForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("Missing token");
    }
    await newVerification(token)
      .then((data) => {
        console.log(data);
        setSuccess("Email verified succesfully");
      })
      .catch(() => {
        setError("Something went wrong");
      });
  }, [token]);
  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      label="Confirming your verification"
      backButtonHref={"/auth/login"}
      backButtonLabel={"Back to Login"}
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        <FormError message={error} />
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  );
};
