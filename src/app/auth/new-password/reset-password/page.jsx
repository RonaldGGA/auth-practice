import NewPasswordForm from "@/components/auth/newPasswordForm";
import { Suspense } from "react";
import React from "react";

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPasswordForm />
    </Suspense>
  );
};
export default ResetPasswordPage;
