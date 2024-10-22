"use client";
import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormField,
  //   FormError,
  //   FormSuccess,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";

import { CardWrapper } from "@/components/auth/cardWrapper";
import { LoginSchema } from "../../Schemas";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { login } from "@/lib/actions";
import { useTransition, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [onPending, startTransition] = useTransition(false);

  const callbackUrl = searchParams.get("callbackUrl");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });
  const onSubmit = (values) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }
          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <CardWrapper
      backButtonHref={"/auth/register"}
      backButtonLabel={"Don't have an account yet?"}
      label={"Welcome Back"}
      useSocial={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <div className="space-y-3 w-full">
            {showTwoFactor && (
              <FormField
                className="w-full"
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2FA CODE</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        name="code"
                        {...field}
                        placeholder="123456"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-[250px]">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          disabled={onPending}
                          {...field}
                          placeholder="jhon.doe@example.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="******"
                          type="password"
                          disabled={onPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          {<FormError message={error || errorParam} />}
          {<FormSuccess message={success} />}
          <Button disabled={onPending} type="submit" className="w-full">
            {showTwoFactor ? "Confirm 2FA" : "LOGIN"}
          </Button>
        </form>
      </Form>
      <Button asChild className="px-0" variant="link" size="lg">
        <Link href="/auth/new-password">Forgot your password?</Link>
      </Button>
    </CardWrapper>
  );
};
