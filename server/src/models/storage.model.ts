import mongoose, { Document } from "mongoose";


const storageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    public_id: { type: String, required: true },
    format: { type: String, required: true },
    resource_type: { type: String, required: true },
    url: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    bytes: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    alt: { type: String },
});

const Storage = mongoose.model("Storage", storageSchema);
export default Storage;