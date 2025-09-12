import mongoose, { Document } from "mongoose";

interface AddressType extends Document {
    accountId: mongoose.Types.ObjectId;
    address: string;
    name: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault: boolean;
    coordinates: {
        latitude: number;
        longitude: number;
    }
    createdAt: Date;
    updatedAt: Date;
}

const addressSchema = new mongoose.Schema<AddressType>({
    address: { type: String, required: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});


const Address = mongoose.model("Address", addressSchema);
export default Address;