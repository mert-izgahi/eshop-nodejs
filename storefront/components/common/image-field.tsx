"use client"

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react"
import { FileMetadata, useFileUpload } from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/axios-client"
import { toast } from "sonner"

interface ImageFieldProps {
    value?: string
    onChange?: (value: string) => void
}

export default function ImageField({ value, onChange }: ImageFieldProps) {
    const maxSizeMB = 2
    const maxSize = maxSizeMB * 1024 * 1024 // 2MB default
    
    const { mutateAsync: uploadSingle, isPending: isUploading } = useMutation({
        mutationKey: ["image-upload"],
        mutationFn: async (file: File) => {
            const formData = new FormData()
            formData.append('file', file);
            const res = await api.post("/api/v1/storage/upload-image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            const {data} = res.data
            return data
        },
        onSuccess: (data) => {
            console.log('Upload successful:', data)
            // Call onChange with the uploaded image URL
            if (onChange && data?.url) {
                onChange(data.url)
            }
        },
        onError: (error: any) => {
            console.error('Upload error:', error)
            toast.error(error?.response?.data?.message || "Failed to upload image")
        },
    })

    const [
        { files, isDragging, errors },
        {
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            removeFile,
            getInputProps,
        },
    ] = useFileUpload({
        accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
        maxSize,
        onFilesChange: async (files) => {
            if (files.length > 0 && files[0]?.file instanceof File) {
                try {
                    await uploadSingle(files[0].file);
                } catch (error) {
                    console.error('Upload failed:', error)
                }
            }
        },
        maxFiles: 1,
        multiple: false,
        onFilesAdded: (addedFiles) => {
            console.log("Files added:", addedFiles)
        },
    })

    const previewUrl = files[0]?.preview || value || null

    return (
        <div className="flex flex-col gap-2">
            <div className="relative">
                {/* Drop area */}
                <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    data-dragging={isDragging || undefined}
                    className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px]"
                >
                    <input
                        {...getInputProps()}
                        className="sr-only"
                        aria-label="Upload image file"
                        disabled={isUploading}
                    />
                    {previewUrl ? (
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                            <img
                                src={previewUrl}
                                alt={files[0]?.file?.name || "Uploaded image"}
                                className="mx-auto max-h-full rounded object-contain"
                            />
                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                                    <div className="text-white text-sm">Uploading...</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                            <div
                                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                                aria-hidden="true"
                            >
                                <ImageIcon className="size-4 opacity-60" />
                            </div>
                            <p className="mb-1.5 text-sm font-medium">Drop your image here</p>
                            <p className="text-muted-foreground text-xs">
                                SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
                            </p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={openFileDialog}
                                type="button"
                                disabled={isUploading}
                            >
                                <UploadIcon
                                    className="-ms-1 size-4 opacity-60"
                                    aria-hidden="true"
                                />
                                {isUploading ? "Uploading..." : "Select image"}
                            </Button>
                        </div>
                    )}
                </div>

                {previewUrl && !isUploading && (
                    <div className="absolute top-4 right-4">
                        <button
                            type="button"
                            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                            onClick={() => {
                                removeFile(files[0]?.id)
                                if (onChange) {
                                    onChange("")
                                }
                            }}
                            aria-label="Remove image"
                        >
                            <XIcon className="size-4" aria-hidden="true" />
                        </button>
                    </div>
                )}
            </div>

            {errors.length > 0 && (
                <div
                    className="text-destructive flex items-center gap-1 text-xs"
                    role="alert"
                >
                    <AlertCircleIcon className="size-3 shrink-0" />
                    <span>{errors[0]}</span>
                </div>
            )}
        </div>
    )
}