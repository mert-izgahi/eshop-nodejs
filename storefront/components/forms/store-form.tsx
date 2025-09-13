"use client"
import React, { useEffect } from 'react'
import { storeSchema, StoreSchema } from '@/lib/zod'
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
import { Loader2 } from "lucide-react";
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import ImageField from '../common/image-field';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Props {
    onSuccess?: () => void
    mode: "create" | "update"
    storeId?: string
}

function StoreForm({ onSuccess, mode, storeId }: Props) {
    const form = useForm<StoreSchema>({
        resolver: zodResolver(storeSchema),
        defaultValues: {
            name: "متجر الشام",
            description: "متجر متخصص ببيع المنتجات المحلية السورية.",
            street: "شارع الحمرا",
            city: "دمشق",
            state: "محافظة دمشق",
            logo: "/images/default-logo.png",
            banner: "/images/default-banner.jpg",
        }
    });
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutate: createStore, isPending: isCreating } = useMutation({
        mutationKey: ["create-store"],
        mutationFn: async (args: StoreSchema) => {
            const response = await api.post("/api/v1/partner/stores", args);
            const { data } = await response.data;
            return data
        },
        onSuccess: (data) => {
            toast.success("Store created successfully");
            onSuccess?.()

            // Small delay to ensure user data is updated
            setTimeout(() => {
                router.push(`/partner`);
            }, 500);
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    })

    const { mutate: updateStore, isPending: isUpdating } = useMutation({
        mutationKey: ["create-store"],
        mutationFn: async (args: StoreSchema) => {
            const response = await api.put(`/api/v1/partner/stores/${storeId}`, args);
            const { data } = await response.data;
            return data
        },
        onSuccess: (data) => {
            toast.success("Store updated successfully");
            onSuccess?.()
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    });

    const storeQuery = useQuery({
        queryKey: ["get-store", storeId],
        queryFn: async () => {
            const response = await api.get(`/api/v1/partner/stores/${storeId}`);
            const { data } = await response.data;
            return data;
        },
        enabled: mode === "update" && !!storeId,
        retry: false,
    })

    const onSubmit = async (data: StoreSchema) => {
        if (mode === "create") {
            await createStore(data);
        }

        if (mode === "update") {
            await updateStore(data);
        }

        queryClient.invalidateQueries({
            queryKey: ["get-stores"],
            refetchType: "all",
        });

        queryClient.invalidateQueries({
            queryKey: ["get-store", storeId],
            refetchType: "all",
        });
    }

    useEffect(() => {
        if (mode === "update" && storeId && storeQuery.isSuccess) {
            form.reset(storeQuery.data);
        }
    }, [mode, storeId, storeQuery.isSuccess]);
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
            >
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-xl font-bold">Let us know about your store</h1>
                    <p className="text-muted-foreground max-w-2xl text-sm">
                        {mode === "create" ? "This information will be used to create your store profile." : "This information will be used to update your store profile."}
                    </p>
                </div>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Store Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Store Name" {...field} />
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
                                <Textarea placeholder="Store Description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Separator />
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-xl font-bold">Your Store Address</h1>
                    <p className="text-muted-foreground max-w-2xl text-sm">
                        This information will be used to create your store profile.
                    </p>
                </div>
                <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Street</FormLabel>
                            <FormControl>
                                <Input placeholder="Store Street Address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="Store City" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Input placeholder="Store State" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Separator />
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-xl font-bold">Store Logo and Banner</h1>
                    <p className="text-muted-foreground max-w-2xl text-sm">
                        This information will be used to create your store profile.
                    </p>
                </div>
                <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Store Logo</FormLabel>
                            <FormControl>
                                <ImageField onChange={field.onChange} value={field.value} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="banner"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Store Banner</FormLabel>
                            <FormControl>
                                <ImageField onChange={field.onChange} value={field.value} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <Button type="submit">Submit</Button>
                </div>


            </form>
        </Form>
    )
}

export default StoreForm