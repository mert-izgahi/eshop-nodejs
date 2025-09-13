"use client"

import { AlertCircleIcon, FileIcon, UploadIcon, XIcon, FileTextIcon } from "lucide-react"
import { useFileUpload } from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/axios-client"
import { toast } from "sonner"

interface DocFieldProps {
    value?: string
    onChange?: (value: string) => void
}

export default function DocField({ value, onChange }: DocFieldProps) {
    const maxSizeMB = 10 // Increased size limit for documents
    const maxSize = maxSizeMB * 1024 * 1024

    const { mutateAsync: uploadSingle, isPending: isUploading } = useMutation({
        mutationKey: ["doc-upload"],
        mutationFn: async (file: File) => {
            const formData = new FormData()
            formData.append('file', file);
            const res = await api.post("/api/v1/storage/upload-doc", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            const { data } = res.data
            return data
        },
        onSuccess: (data) => {
            console.log('Upload successful:', data)
            // Call onChange with the uploaded document URL
            if (onChange && data?.url) {
                onChange(data.url)
            }
        },
        onError: (error: any) => {
            console.error('Upload error:', error)
            toast.error(error?.response?.data?.message || "Failed to upload document")
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
        accept: ".pdf,.doc,.docx,.txt,.rtf",
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

    // Helper function to get file type icon and display info
    const getFileDisplayInfo = (fileName?: string, mimeType?: string) => {
        if (!fileName && !value) return null

        const name = fileName || value?.split('/').pop() || 'document'
        const extension = name.split('.').pop()?.toLowerCase()

        let icon = <FileIcon className="size-8 opacity-60" />
        let type = 'Document'

        switch (extension) {
            case 'pdf':
                icon = <FileTextIcon className="size-8 opacity-60" />
                type = 'PDF Document'
                break
            case 'doc':
            case 'docx':
                icon = <FileTextIcon className="size-8 opacity-60" />
                type = 'Word Document'
                break
            case 'txt':
                icon = <FileTextIcon className="size-8 opacity-60" />
                type = 'Text Document'
                break
            case 'rtf':
                icon = <FileTextIcon className="size-8 opacity-60" />
                type = 'Rich Text Document'
                break
        }

        return { icon, type, name, extension }
    }

    const currentFile = files[0]
    const fileInfo = getFileDisplayInfo(currentFile?.file?.name, currentFile?.file?.type) ||
        (value ? getFileDisplayInfo(value) : null)

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
                        aria-label="Upload document file"
                        disabled={isUploading}
                    />
                    {fileInfo ? (
                        <div className="flex flex-col items-center justify-center p-4 text-center">
                            <div className="bg-background mb-4 flex size-16 shrink-0 items-center justify-center rounded-full border">
                                {fileInfo.icon}
                            </div>
                            <p className="mb-1 text-sm font-medium truncate max-w-48">
                                {fileInfo.name}
                            </p>
                            <p className="text-muted-foreground text-xs mb-2">
                                {fileInfo.type}
                            </p>
                            {isUploading && (
                                <div className="text-sm text-blue-600 font-medium">
                                    Uploading...
                                </div>
                            )}
                            {!isUploading && currentFile && (
                                <div className="text-xs text-green-600">
                                    Upload complete
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                            <div
                                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                                aria-hidden="true"
                            >
                                <FileIcon className="size-4 opacity-60" />
                            </div>
                            <p className="mb-1.5 text-sm font-medium">Drop your document here</p>
                            <p className="text-muted-foreground text-xs">
                                PDF, DOC, DOCX, TXT or RTF (max. {maxSizeMB}MB)
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
                                {isUploading ? "Uploading..." : "Select document"}
                            </Button>
                        </div>
                    )}
                </div>

                {fileInfo && !isUploading && (
                    <div className="absolute top-4 right-4">
                        <button
                            type="button"
                            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                            onClick={() => {
                                if (currentFile) {
                                    removeFile(currentFile.id)
                                }
                                if (onChange) {
                                    onChange("")
                                }
                            }}
                            aria-label="Remove document"
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