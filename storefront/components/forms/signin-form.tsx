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
import { signInSchema, SignInSchema } from "@/lib/zod";
import { signIn } from "next-auth/react";

export const SigninForm: React.FC = () => {
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInSchema) => {
    const res = await signIn("credentials", {
      redirect: false, // important for handling errors manually
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      // setError(res.error); // will be "Email not found" or any server message
      console.log(res.error);
    } else {
      // Redirect or refresh
      window.location.href = "/";
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
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

        <Button
          type="submit"
          className="bg-red-600 hover:bg-red-700 cursor-pointer"
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
};
