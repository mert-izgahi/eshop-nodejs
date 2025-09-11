"use client"
import React, { useState } from 'react'
import { Button } from '../../ui/button'
import Modal from '../modal'
import CategoryForm from '../../forms/category-form';

function CreateModal() {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            <Button type='button' onClick={handleOpen} variant={"outline"}>Create Category</Button>
            <Modal
                title="Create Category"
                description="Create a new category"
                isOpen={isOpen}
                onClose={handleClose}
            >
                <CategoryForm mode="create" onClose={handleClose} />
            </Modal>
        </>
    )
}

export default CreateModal