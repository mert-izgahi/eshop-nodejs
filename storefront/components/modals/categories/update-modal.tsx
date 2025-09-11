"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '../../ui/button'
import Modal from '../modal'
import CategoryForm from '../../forms/category-form';
import { EditIcon } from '@/lib/icons';
interface UpdateModalProps {
    id: string
}
function UpdateModal({ id }: UpdateModalProps) {

    const [isOpen, setIsOpen] = useState(false);



    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            <Button size={"icon"} type='button' variant={"ghost"} onClick={handleOpen}>
                <EditIcon className='w-4 h-4' />
            </Button>
            <Modal
                title="Update Category"
                description="Update a category"
                isOpen={isOpen}
                onClose={handleClose}
            >
                <CategoryForm mode="update" categoryId={id} onClose={handleClose} />
            </Modal>
        </>
    )
}

export default UpdateModal