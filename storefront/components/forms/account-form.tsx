"use client"
import React, { useEffect } from 'react';
import { updateCustomerSchema, UpdateCustomerSchema } from '@/lib/zod'
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
import { isActiveOptions, isVerifiedOptions, roleOptions } from '@/lib/lookups';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios-client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import ImageField from '../common/image-field';
interface Props {
    id: string
}
function AccountForm({ id }: Props) {
    const { data: customer, isLoading } = useQuery({
        queryKey: ["get-account", id],
        queryFn: async () => {
            const response = await api.get(`/api/v1/admin/accounts/${id}`)
            const { data } = response.data;
            return data
        },
        enabled: !!id
    });

    const { isPending: isUpdating, mutateAsync: updateCustomer } = useMutation({
        mutationFn: async (args: UpdateCustomerSchema) => {
            const response = await api.put(`/api/v1/admin/accounts/${id}`, args);
            const { data } = await response.data;
            return data
        },
        onSuccess: () => {
            toast.success("Account updated successfully")
        },
        onError: () => {
            toast.error("Something went wrong")
        }
    })

    const form = useForm<UpdateCustomerSchema>({
        resolver: zodResolver(updateCustomerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            profilePicture: "",
            email: "",
            phoneNumber: "",
            password: "",
            role: "",
            isActive: true,
            verified: true
        },
    });

    const onSubmit = async (data: UpdateCustomerSchema) => await updateCustomer(data);


    useEffect(() => {
        if (customer) {
            form.setValue("firstName", customer.firstName);
            form.setValue("profilePicture", customer.profilePicture);
            form.setValue("lastName", customer.lastName);
            form.setValue("email", customer.email);
            form.setValue("phoneNumber", customer.phoneNumber);
            form.setValue("isActive", customer.isActive);
            form.setValue("role", customer.role);
            form.setValue("verified", customer.verified);
        }
    }, [customer])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input readOnly placeholder="john.doe@example.com" {...field} className='cursor-not-allowed bg-neutral-50' />
                            </FormControl>
                            <FormDescription>
                                Email that used to create the account.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John" {...field} />
                                </FormControl>
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="profilePicture"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Profile Picture</FormLabel>
                            <FormControl>
                                <ImageField onChange={field.onChange} value={field.value} />
                            </FormControl>
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
                                <Input placeholder="08123456789" {...field} />
                            </FormControl>
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
                                <Input placeholder="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={String(field.value)}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roleOptions.map((option) => (
                                            <SelectItem key={option.value} value={String(option.value)}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Active</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Select a state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isActiveOptions.map((option) => (
                                            <SelectItem key={option.value} value={String(option.value)}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="verified"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Verified</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Select a state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isVerifiedOptions.map((option) => (
                                            <SelectItem key={option.value} value={String(option.value)}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center justify-end">
                    <Button type="submit"
                        className='bg-red-600 text-white hover:bg-red-600 hover:text-white'
                        disabled={isUpdating}
                    >
                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default AccountForm