"use client"
import React, { useState } from 'react'
import { Button } from '../../ui/button'
import Modal from '../modal'
import { DeleteIcon } from '@/lib/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios-client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface DeleteModalProps {
    id: string
}
function DeleteModal({ id }: DeleteModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };
    const queryClient = useQueryClient();
    const { mutateAsync: deleteCategory, isPending: isDeleting } = useMutation({
        mutationKey: ["delete-account", id],
        mutationFn: async () => {
            const response = await api.delete(`/api/v1/admin/accounts/${id}`)
            const { data } = response.data;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["get-accounts"],
            })
            toast.success("Account deleted");
            setTimeout(() => {
                handleClose();
            }, 2000);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to delete account");
        }
    })

    return (
        <>
            <Button size={"icon"} type='button' variant={"ghost"} onClick={handleOpen}>
                <DeleteIcon className='w-4 h-4' />
            </Button>
            <Modal
                title="Delete Customer"
                description="Are you sure you want to delete this customer?"
                isOpen={isOpen}
                onClose={handleClose}
            >
                <h1>Delete Account</h1>
                <p>Are you sure you want to delete this account?</p>
                <div className="flex items-center gap-2">
                    <Button type='button' onClick={handleClose} variant={"outline"} className='w-full'>Close</Button>
                    <Button disabled={isDeleting} onClick={() => deleteCategory()}
                        type='button' className='bg-red-600 hover:bg-red-700 w-full'>
                        {isDeleting && <Loader2 className='animate-spin w-4 h-4 mr-2' />}
                        Delete
                    </Button>
                </div>
            </Modal>
        </>
    )
}

export default DeleteModal