"use server";
import { Resend } from "resend";

const resend = new Resend("re_MxhPGVFw_MgmVo8ez5LtaNhUm3H2jb4gW");

export const sendVerificationEmail = async (email, token) => {
  const confirmLink = `${process.env.ORIGIN}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your Email",
    html: `<p>
    Click  
    <a href=${confirmLink}>HERE </a>
    to confirm Email</p>`,
  });
};

export const sendResetPasswordEmail = async (email, token) => {
  console.log("OKEY IM IN THE SENDING PROCESS");
  const resetLink = `${process.env.ORIGIN}/auth/new-password/reset-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your Email",
    html: `<p>
    Click  
    <a href=${resetLink}>HERE </a>
    to change your password</p>`,
  });
  console.log("OKEY I SENDED IT");
};

export const sendTwoFactorTokenEmail = async (email, token) => {
  console.log("OKEY IM IN THE SENDING PROCESS");
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA CODE",
    html: `<p>TWO FA CODE ${token}</p>`,
  });
};
