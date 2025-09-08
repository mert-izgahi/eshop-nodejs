"use client";

import Image from "next/image";
import { Button } from "../ui/button";

export const GoogleAuthButton = () => {
  return (
    <Button variant={"outline"} className="cursor-pointer">
      <Image src="/google.svg" alt="Google Logo" width={24} height={24} />
      <span>Continue with Google</span>
    </Button>
  );
};
