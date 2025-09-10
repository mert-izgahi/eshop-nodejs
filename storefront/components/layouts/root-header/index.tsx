"use client";

import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Bell, MessageCircle, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import SearchForm from "./search-form";
import HeaderLink from "./header-link";
import { useGetCurrentAccount } from "@/hooks/use-auth";

const RootHeader: React.FC = () => {
  
  const links = [
    { label: "Home", link: "/" },
    { label: "Products", link: "/products" },
    { label: "Stores", link: "/stores" },
    { label: "About", link: "/about" },
    { label: "Contact", link: "/contact" },
  ];
  
  return (
    <div className="py-4 border-b flex items-center justify-center">
      <Container className="w-full">
        <div className="flex flex-col w-full gap-6">
          {/*TopSection*/}
          <div className="flex flex-row justify-between items-center">
            <Link href="/" className="flex items-center gap-x-1">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={60}
                height={60}
                className="w-10 h-10 object-fill"
              />

              <span className="hidden xl:inline-block text-md font-semibold">
                E-Shopping
              </span>
            </Link>
            {/*Searchform*/}
            <div className="flex-1 hidden md:flex items-center justify-center">
              <SearchForm />
            </div>
            {/*ActionLinks*/}
            <div className="flex flex-row items-center gap-x-1">
              <Button asChild size={"icon"} variant={"ghost"}>
                <Link href="/cart">
                  <ShoppingBag />
                </Link>
              </Button>

              <Button asChild size={"icon"} variant={"ghost"}>
                <Link href="/notifications">
                  <Bell />
                </Link>
              </Button>
              <Button asChild size={"icon"} variant={"ghost"}>
                <Link href="/messages">
                  <MessageCircle />
                </Link>
              </Button>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>

            </div>
          </div>

          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex items-center gap-x-2">
              {links.map((link, index) => (
                <HeaderLink label={link.label} link={link.link} key={index} />
              ))}
            </div>
            <div className="flex items-center gap-x-2">
              <HeaderLink label="Start Selling" link="/start-selling" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RootHeader;
