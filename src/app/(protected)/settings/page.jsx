"use client";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { settings } from "@/lib/actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, SettingsIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { SettingsSchema } from "@/Schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { FormSuccess } from "@/components/auth/form-success";
import { FormError } from "@/components/auth/form-error";
import { UserRole } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
const SettingsPage = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = useCurrentUser();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition(false);

  const form = useForm({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
      password: undefined,
      role: user?.role || undefined,
      newPassword: undefined,
    },
  });
  const onSubmit = (values) => {
    setSuccess("");
    setError("");
    const { password, newPassword, ...rest } = values;
    if (
      (password === null && !newPassword) ||
      (password === null && !newPassword == null)
    ) {
      values.password = undefined;
      values.newPassword = undefined;
    }
    startTransition(() => {
      console.log({ PASSWORD: values.password });
      settings(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
            form.reset();
          } else {
            form.reset();

            update();
            setSuccess(data?.success);
            toast({
              variant: "success",
              title: "User succesfully updated",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
        });
    });
  };

  return (
    <Card>
      <CardHeader className="flex items-center">
        <p className="flex gap-2 font-bold text-xl">
          <SettingsIcon /> Settings
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholer="jhon Doe"
                        disabled={isPending}
                        type="text"
                        name="name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {user?.isOauth === false && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholer="example@gmail.com"
                            disabled={isPending}
                            type="text"
                            name="email"
                            {...field}
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
                          <div className="flex items-center gap-2">
                            <Input
                              onChange={(e) => {
                                // Usar 'e.target.value' para acceder al valor del input
                                const value = e.target.value;
                                // Si el valor es vacío, puedes manejarlo como desees
                                if (value.length < 1) {
                                  field.onChange(undefined); // o podrías usar `field.onChange("")` para establecer como cadena vacía
                                } else {
                                  field.onChange(value); // Actualizamos el valor del campo
                                }
                              }}
                              id="password"
                              placeholer="*********"
                              disabled={isPending}
                              type="password"
                              name="password"
                              {...field}
                            />
                            <Eye
                              onClick={() => {
                                const passwordInput =
                                  document.getElementById("password");
                                passwordInput.type =
                                  passwordInput.type == "password"
                                    ? "text"
                                    : "password";
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              id="newPassword"
                              placeholer="********"
                              disabled={isPending}
                              type="newPassword"
                              name="newPassword"
                              {...field}
                            />
                            <Eye
                              onClick={() => {
                                const newPasswordInput =
                                  document.getElementById("newPassword");
                                newPasswordInput.type =
                                  newPasswordInput.type == "newPassword"
                                    ? "text"
                                    : "newPassword";
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                        <SelectItem value={UserRole.USER}>User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between flex-row shadow-sm p-3 rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel> 2FA Auhtentication</FormLabel>
                      <FormDescription>
                        Enable two factor authentication for your account
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={
                          (field.onChange,
                          () => {
                            console.log(field);
                          })
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormSuccess message={success} />
            <FormError message={error} />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsPage;
