"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

interface HeaderLinkProps {
  link: string;
  label: string;
}

export default function HeaderLink({ link, label }: HeaderLinkProps) {
  const pathname = usePathname();
  return (
    <Link
      href={link}
      className={cn("text-sm", {
        "text-red-600 font-semibold": link === pathname,
        "text-muted-foreground font-normal": link !== pathname,
      })}
    >
      {label}
    </Link>
  );
}
