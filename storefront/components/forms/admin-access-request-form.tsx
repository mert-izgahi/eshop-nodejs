"use client"

import React from 'react'
import { AdminAccessRequestSchema, adminAccessRequestSchema } from '@/lib/zod'
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
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

function AdminAccessRequestForm() {
  const { signOut } = useAuth();
  const form = useForm<AdminAccessRequestSchema>({
    resolver: zodResolver(adminAccessRequestSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();
  const { mutate: requestAdminAccess, isPending } = useMutation({
    mutationKey: ["request-admin-access-key"],
    mutationFn: async (args: AdminAccessRequestSchema) => {
      const response = await api.post("/api/v1/auth/request-admin-access", args);
      const data = await response.data;
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
      setTimeout(() => {
        signOut();
      }, 2000);
    },
  })
  const onSubmit = async (data: AdminAccessRequestSchema) => await requestAdminAccess(data);

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

        <div className="flex items-center justify-end">
          <Button type="submit"
            className='bg-red-600 text-white hover:bg-red-600 hover:text-white'
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AdminAccessRequestForm