"use client";
import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/auth/cardWrapper";
import { RegisterSchema } from "../../Schemas";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { register } from "@/lib/actions";
import { useTransition, useState } from "react";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
export const RegisterForm = () => {
  const router = useRouter();
  const [onPending, startTransition] = useTransition(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = (values) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
        // if (data?.success) {
        //   router.push("/auth/login");
        // }
      });
    });
  };

  return (
    <CardWrapper
      backButtonHref={"/auth/login"}
      backButtonLabel={"Already have an account?"}
      label={"Create an account"}
      useSocial={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={onPending}
                      placeholder="Jhon Doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <div className="flex">
                    <FormControl>
                      <Input
                        id="password"
                        {...field}
                        placeholder="******"
                        type="password"
                        disabled={onPending}
                      />
                    </FormControl>
                    <Eye
                      onClick={() => {
                        let input = document.getElementById("password");
                        input.type =
                          input.type == "password" ? "text" : "password";
                      }}
                    />
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}

          <Button disabled={onPending} type="submit" className="w-full">
            Register
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
