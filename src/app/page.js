"use client";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import react from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import Link from "next/link";
export default function Home() {
  react.useEffect(() => {
    redirect("/auth/login");
  });
  return <></>;
  // <div>
  //   <form
  //     className="text-white"
  //     action={async () => {
  //       "use server";
  //       await signIn("github");
  //     }}
  //   >
  //     <Header />
  //     <Button size="lg" className="w-full" variant="secondary">
  //       Sign In with Github
  //     </Button>
  //   </form>
  //   <Button className="mt-4 w-full" size="lg">
  //     <Link href="/auth/login">Sign In with the Page</Link>
  //   </Button>
  // </div>
}
