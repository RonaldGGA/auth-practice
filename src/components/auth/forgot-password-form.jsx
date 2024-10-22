"use client";
import React, { useState, useTransition } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { forgotPasswordEmailSchema } from "@/Schemas";
import { Input } from "@/components/ui/input";
import { generatePasswordToken } from "@/lib/tokens";
import { sendResetPasswordEmail } from "@/lib/mail";
import { Button } from "@/components/ui/button";
const ForgotPasswordForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [onPending, startTransition] = useTransition(false);
  const form = useForm({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      generatePasswordToken(values)
        .then((data) => {
          console.log(data);
          console.log("DATA SHOWED");
          sendResetPasswordEmail(data.email, data.token)
            .then(() => {
              setSuccess("Email sent");
            })
            .catch((error) => {
              setError(error);
            });
        })
        .catch((error) => {
          setError(error);
        });
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-[250px]">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    {...field}
                    disabled={onPending}
                    name="email"
                    placeholder="example@gmail.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormError message={error} />
          <FormSuccess message={success} />
        </div>
        <Button size="lg" className="mt-2 w-full" type="submit">
          Send
        </Button>
      </form>
    </Form>
  );
};
export default ForgotPasswordForm;
