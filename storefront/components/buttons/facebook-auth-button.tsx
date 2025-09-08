"use client";

import Image from "next/image";
import { Button } from "../ui/button";

export const FacebookAuthButton = () => {
  return (
    <Button variant={"outline"} className="cursor-pointer">
      <Image src="/facebook.svg" alt="Facebook Logo" width={24} height={24} />
      <span>Continue with Facebook</span>
    </Button>
  );
};
