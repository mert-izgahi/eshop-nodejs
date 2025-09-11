"use client"

import React, { useEffect } from 'react'
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios-client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useAuth } from '@/providers/auth-provider';
import ImageField from '../common/image-field';

interface CategoryFormProps {
    mode: "create" | "update"
    onClose?: () => void
    categoryId?: string
}
function CategoryForm({ mode, categoryId, onClose }: CategoryFormProps) {
    const { signOut } = useAuth();

    const form = useForm<CategorySchema>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            description: "",
            image: "",
        },
    });
    const queryClient = useQueryClient();

    const { data: category, isLoading } = useQuery({
        queryKey: ["get-category", categoryId],
        queryFn: async () => {
            const response = await api.get(`/api/v1/categories/${categoryId}`);
            const { data } = await response.data;
            return data;
        },
        enabled: mode === "update" && !!categoryId,
        retry: false,
    })

    const { mutateAsync: createCategory, isPending: isCreating } = useMutation({
        mutationKey: ["create-category"],
        mutationFn: async (data: CategorySchema) => {
            const response = await api.post("/api/v1/categories", data);
            return response.data;
        },
        onSuccess: (data) => {
            console.log(data);
        },
        onError: async (error: any) => {
            const message = error?.response?.data || "Something went wrong";
            const title = error?.response?.data.title || "Something went wrong";
            if (title === "AdminAccessError") {
                toast.error(message);
                await signOut();
            }

        }
    })

    const { mutateAsync: updateCategory, isPending: isUpdating } = useMutation({
        mutationKey: ["update-category"],
        mutationFn: async (data: CategorySchema) => {
            const response = await api.put(`/api/v1/categories/${categoryId}`, data);
            return response.data;
        },
        onSuccess: (data) => {
            console.log(data);
        },
        onError: async (error: any) => {
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
        }

        if (mode === "update") {
            await updateCategory(data);
            toast.success("Category updated");
        }

        queryClient.invalidateQueries({
            queryKey: ["get-categories"],
            refetchType: "all",
        });

        setTimeout(() => {
            onClose?.();
        }, 2000);

    }

    useEffect(() => {
        if (mode === "update") {
            if (category) {
                form.setValue("name", category.name);
                form.setValue("description", category.description);
                form.setValue("image", category.image);
            }
        }
    }, [mode, category])

    if (isLoading) {
        return <div className='w-full min-h-60 flex items-center justify-center'>
            <Loader2 className="animate-spin" />
        </div>
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
                                <ImageField value={field.value} onChange={field.onChange} />
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