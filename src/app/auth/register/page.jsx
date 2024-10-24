import { RegisterForm } from "@/components/auth/registerForm";
import { Suspense } from "react";
import React from "react";

const RegisterPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
};
export default RegisterPage;
