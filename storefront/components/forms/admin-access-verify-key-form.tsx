"use client"

import React from 'react'
import { AdminAccessVerifyKeySchema, adminAccessVerifyKeySchema } from '@/lib/zod'
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

function AdminAccessVerifyKeyForm() {
  const { signOut } = useAuth();
  const form = useForm<AdminAccessVerifyKeySchema>({
    resolver: zodResolver(adminAccessVerifyKeySchema),
    defaultValues: {
      adminKey: ""
    },
  });
  const router = useRouter();
  const { mutate: verifyAdminAccess, isPending } = useMutation({
    mutationKey: ["request-admin-access-key"],
    mutationFn: async (args: AdminAccessVerifyKeySchema) => {
      const response = await api.post("/api/v1/auth/verify-admin-access", args);
      const data = await response.data;
      return data;
    },
    onSuccess: (result) => {
      localStorage.setItem('hasAdminAccess', "true");
      localStorage.setItem('adminAccessKey', result.data.adminAccessKey);
      toast.success(result.message);

      router.push('/admin');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  })
  const onSubmit = async (data: AdminAccessVerifyKeySchema) => await verifyAdminAccess(data);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="adminKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin Access Key</FormLabel>
              <FormControl>
                <Input placeholder="123456" {...field} />
              </FormControl>
              <FormDescription>
                Enter the admin access key provided to you.
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

export default AdminAccessVerifyKeyForm