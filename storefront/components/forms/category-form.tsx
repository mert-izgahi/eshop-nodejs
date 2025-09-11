"use client"

import React from 'react'
import { CategorySchema, categorySchema } from '@/lib/zod'
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
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { storage } from '@/lib/local-storage';
import { useAuth } from '@/providers/auth-provider';
interface CategoryFormProps {
    mode: "create" | "update"
    onClose?: () => void
}
function CategoryForm({ mode, onClose }: CategoryFormProps) {
    const { signOut } = useAuth();
    const form = useForm<CategorySchema>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            description: "",
            image: ""
        },
    });

    const { mutateAsync: createCategory, isPending: isCreating } = useMutation({
        mutationKey: ["create-category"],
        mutationFn: async (data: CategorySchema) => {
            const response = await api.post("/api/v1/categories", data);
            return response.data;
        },
        onSuccess: (data) => {
            console.log(data);
        },
        onError: async(error: any) => {
            const message = error?.response?.data || "Something went wrong";
            const title = error?.response?.data.title || "Something went wrong";
            if (title === "AdminAccessError") {
                toast.error(message);
                await signOut();
            }

        }
    })

    const onSubmit = async (data: CategorySchema) => {
        if (mode === "create") {
            await createCategory(data);
            toast.success("Category created");
            onClose?.();
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Category name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Category description" {...field} />
                            </FormControl>
                            <FormDescription>
                                Write a short description of the category
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <Input placeholder="Category image" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isCreating} type="submit" className='bg-red-600 hover:bg-red-700 text-white cursor-pointer'>
                    {isCreating && <Loader2 className='animate-spin mr-2' />}
                    {mode === "create" ? "Create" : "Update"}
                </Button>
            </form>
        </Form>
    )
}

export default CategoryForm