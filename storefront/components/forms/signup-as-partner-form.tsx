"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SignUpAsPartnerSchema, signUpAsPartnerSchema } from "@/lib/zod";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import DocField from "../common/doc-field";


export const SignupAsPartnerForm = () => {
  const form = useForm<SignUpAsPartnerSchema>({
    resolver: zodResolver(signUpAsPartnerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptPrivacyAndTerms: false,
      acceptMarketing: false,
      role: "partner",
      phoneNumber: "",
      identityNumber: "",
      licenseDocument: "",
    },
  });

  const { signUpAsPartner } = useAuth();
  const router = useRouter();
  const onSubmit = async (data: SignUpAsPartnerSchema) => {
    await signUpAsPartner(data);
    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormDescription>Please type your first name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormDescription>Please type your last name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormDescription>
                We will use this email to send you important updates and
                notifications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormDescription>
                Your password must be at least 8 characters long and contain at
                least one uppercase letter, one lowercase letter, one number,
                and one special character.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormDescription>
                Please enter the same password as above.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="123-456-7890" {...field} />
              </FormControl>
              <FormDescription>
                Please enter your phone number.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="identityNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identity Number</FormLabel>
              <FormControl>
                <Input placeholder="123-456-7890" {...field} />
              </FormControl>
              <FormDescription>
                Please enter your identity number.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="licenseDocument"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Document</FormLabel>
              <FormControl>
                <DocField value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription>
                Please upload your license document.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptPrivacyAndTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="space-y-0.5 leading-none cursor-pointer">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="underline underline-offset-4 text-red-600"
                >
                  Terms of Service
                </Link>
                and{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 text-red-600"
                >
                  Privacy Policy
                </Link>
                .
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="acceptMarketing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="space-y-0.5 leading-none cursor-pointer">
                I agree to receive marketing emails.
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-red-600 hover:bg-red-700 cursor-pointer"
        >
          Create Account
        </Button>
      </form>
    </Form>
  );
};
