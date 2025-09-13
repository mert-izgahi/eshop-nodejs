import { promises as fs } from 'fs';
import { type Request, type Response } from "express";
import { BadRequestError } from "../utils/api-errors";
import { sendSuccessResponse } from "../utils";
import Storage from "../models/storage.model";
import cloudinary from '../configs/cloudinary';
// Single file upload
export const uploadSingle = async (req: Request, res: Response) => {
    try {
        const file = req.file;

        if (!file) {
            throw new BadRequestError("No file provided");
        }

        console.log('Uploading file:', file.originalname); // Debug log
        console.log('File path:', file.path); // Debug log

        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'express-uploads',
            resource_type: 'auto',
            transformation: [
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        })
        console.log('Cloudinary upload result:', result);

        console.log('Cloudinary upload result:', result.public_id); // Debug log

        // Delete local file after upload
        await fs.unlink(file.path);

        const args = {
            name: file.originalname,
            public_id: result.public_id,
            url: result.secure_url,
            format: result.format,
            resource_type: result.resource_type,
            bytes: result.bytes,
            width: result.width || 0,
            height: result.height || 0,
        };

        const storage = await Storage.create(args);

        sendSuccessResponse(res, 200, "Image Uploaded Successfully", {
            id: storage._id,
            url: storage.url,
            name: storage.name,
            public_id: storage.public_id
        });
    } catch (error) {
        console.error('Upload error:', error);

        // Clean up file if it exists and upload failed
        if (req.file?.path) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Failed to delete temporary file:', unlinkError);
            }
        }

        throw error;
    }
};

export const uploadDocument = async (req: Request, res: Response) => {
    try {
        const file = req.file;

        if (!file) {
            throw new BadRequestError("No file provided");
        }

        console.log('Uploading document:', file.originalname); // Debug log
        console.log('File path:', file.path); // Debug log

        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'express-uploads/documents',
            resource_type: 'auto',
            transformation: [
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        })
        console.log('Cloudinary upload result:', result);

        console.log('Cloudinary upload result:', result.public_id); // Debug log

        // Delete local file after upload
        await fs.unlink(file.path);

        const args = {
            name: file.originalname,
            public_id: result.public_id,
            url: result.secure_url,
            format: result.format,
            resource_type: result.resource_type,
            bytes: result.bytes,
            width: result.width || 0,
            height: result.height || 0,
        };

        const storage = await Storage.create(args);

        sendSuccessResponse(res, 200, "Document Uploaded Successfully", {
            id: storage._id,
            url: storage.url,
            name: storage.name,
            public_id: storage.public_id
        });
    } catch (error) {
        console.error('Upload error:', error);

        // Clean up file if it exists and upload failed
        if (req.file?.path) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Failed to delete temporary file:', unlinkError);
            }
        }

        throw error;
    }
};
