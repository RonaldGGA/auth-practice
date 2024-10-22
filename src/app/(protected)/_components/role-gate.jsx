"use client";
import { FormError } from "@/components/auth/form-error";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserRole } from "@prisma/client";
import React from "react";

const RoleGate = ({ children, allowedRole = UserRole.USER }) => {
  const role = useCurrentUser().role;

  if (role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content" />
    );
  }
  return <>{children}</>;
};

export default RoleGate;
