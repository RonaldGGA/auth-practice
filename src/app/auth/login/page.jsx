import { LoginForm } from "@/components/auth/loginForm";
import { Suspense } from "react";
import React from "react";

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
};
export default LoginPage;
