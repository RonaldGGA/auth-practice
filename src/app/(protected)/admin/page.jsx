"use client";

import React from "react";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RoleGate from "../_components/role-gate";
import { FormSuccess } from "@/components/auth/form-success";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { admin } from "@/lib/actions";
const AdminPage = () => {
  const role = useCurrentUser().role;

  const onApiRouteClick = () => {
    fetch("/api/admin").then((response) => {
      if (response.status === "200") {
        toast({
          variant: "success",
          title: "You are allowed",
        });
      } else {
        toast({
          variant: "destructive",
          title: "You are not allowed",
          action: <ToastAction altText="Log in as an Admin">OK</ToastAction>,
        });
      }
    });
  };
  const onServerActionClick = () => {
    admin().then((data) => {
      if (data.error) {
        toast({
          variant: "destructive",
          title: data.error,
        });
      } else {
        toast({
          variant: "success",
          title: data.success,
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader className="text-center w-full">
        You are logged as <br />
        {role}
      </CardHeader>
      <CardContent>
        <RoleGate>
          <FormSuccess message="You are allowed to see this content"></FormSuccess>
        </RoleGate>
        <div className="flex justify-between items-center my-2">
          <p>
            Admin-Only <b>Api Route</b>
          </p>
          <Button onClick={onApiRouteClick}>click to test</Button>
        </div>
        <div className="flex justify-between items-center my-2">
          <p>
            Admin-only <b>Server Action</b>
          </p>
          <Button onClick={onServerActionClick}>click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
