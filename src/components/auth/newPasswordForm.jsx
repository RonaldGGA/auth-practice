"use client";
import React, { startTransition, useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema } from "@/Schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { setNewPassword } from "@/lib/actions";
const NewPasswordForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  const params = useSearchParams();
  const token = params.get("token");
  const onSubmit = async (values) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      setNewPassword(values, token)
        .then((data) => {
          setSuccess("Password changed");
          router.push("/settings");
        })
        .catch((error) => {
          setError(error);
        });
    });
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-[250px]">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full"
                      {...field}
                      name="password"
                      placeholder="*********"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Set password</Button>
        </form>
      </Form>
      <FormError message={error} />
      <FormSuccess message={success} />
    </>
  );
};
export default NewPasswordForm;
