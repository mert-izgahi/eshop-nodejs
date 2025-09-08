import { FacebookAuthButton } from "@/components/buttons/facebook-auth-button";
import { GoogleAuthButton } from "@/components/buttons/google-auth-button";
import { Container } from "@/components/common/container";
import { SigninForm } from "@/components/forms/signin-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <Container className="flex flex-col gap-6 py-12">
      <div className="flex flex-col gap-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-sm text-muted-foreground">
          Please enter your email and password to sign in.
        </p>

        <SigninForm />

        {/*AuthFooter*/}
        <div className="flex flex-col gap-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GoogleAuthButton />
            <FacebookAuthButton />
          </div>

          <div className="w-full flex flex-col gap-y-4">
            <Button asChild variant={"outline"}>
              <Link href="/sign-up">I dont have an account?</Link>
            </Button>
            <Button asChild variant={"outline"}>
              <Link href="/forgot-password">Forgot password?</Link>
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
