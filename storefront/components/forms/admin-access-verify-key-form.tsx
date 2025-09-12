"use client";

import React from 'react';
import { AdminAccessVerifyKeySchema, adminAccessVerifyKeySchema } from '@/lib/zod';
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
import { useAuth } from '@/providers/auth-provider';
import { toast } from 'sonner';
import { Loader2, Shield } from 'lucide-react';

interface AdminAccessVerifyKeyFormProps {
  onSuccess?: () => void;
}

function AdminAccessVerifyKeyForm({ onSuccess }: AdminAccessVerifyKeyFormProps) {
  const form = useForm<AdminAccessVerifyKeySchema>({
    resolver: zodResolver(adminAccessVerifyKeySchema),
    defaultValues: {
      adminKey: ""
    },
  });

  const router = useRouter();
  const { refreshUser } = useAuth();

  const { mutate: verifyAdminAccess, isPending } = useMutation({
    mutationKey: ["verify-admin-access"],
    mutationFn: async (args: AdminAccessVerifyKeySchema) => {
      const response = await api.post("/api/v1/admin/verify-admin-access", args);
      return response.data;
    },
    onSuccess: async (result) => {
      toast.success(result.message || "Admin access verified successfully!");
      
      // Call onSuccess callback if provided
      onSuccess?.();
      
      // Small delay to ensure user data is updated
      setTimeout(() => {
        router.push('/admin');
      }, 500);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to verify admin access";
      toast.error(errorMessage);
      
      // Clear the form on error
      form.reset();
    },
  });

  const onSubmit = async (data: AdminAccessVerifyKeySchema) => {
    await verifyAdminAccess(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="adminKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admin Access Key
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter 6-digit code (e.g., 123456)" 
                  {...field}
                  disabled={isPending}
                  className="font-mono text-center text-lg tracking-widest"
                  maxLength={6}
                  onChange={(e) => {
                    // Only allow numbers and limit to 6 digits
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormDescription>
                Enter the 6-digit admin access key sent to your email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => form.reset()}
            disabled={isPending}
          >
            Clear
          </Button>
          
          <Button 
            type="submit"
            disabled={isPending || !form.watch('adminKey')}
            className="min-w-[120px] bg-red-600 hover:bg-red-700"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Verify Access
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default AdminAccessVerifyKeyForm;