import { Container } from "@/components/common/container";
import Image from "next/image";
import Link from "next/link";

export const RootFooter: React.FC = () => {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 py-12">
      <Container className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 flex flex-col gap-4">
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
          <div className="flex flex-col">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} E-Shopping
            </p>
            <p className="text-xs text-muted-foreground">
              All rights reserved.
            </p>
          </div>
        </div>
        <div className="col-span-1 md:col-span-2">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">Company</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">Customer Service</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    href="/returns"
                    className="text-sm text-muted-foreground"
                  >
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping"
                    className="text-sm text-muted-foreground"
                  >
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm text-muted-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">Contact Us</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    href="mailto:support@eshopping.com"
                    className="text-sm text-muted-foreground"
                  >
                    support@eshopping.com
                  </Link>
                </li>
                <li>
                  <Link
                    href="tel:+1234567890"
                    className="text-sm text-muted-foreground"
                  >
                    +1 (234) 567-890
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.facebook.com/eshopping"
                    className="text-sm text-muted-foreground"
                  >
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.instagram.com/eshopping"
                    className="text-sm text-muted-foreground"
                  >
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
