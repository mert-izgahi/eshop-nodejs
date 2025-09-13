import mongoose, { Document } from "mongoose";

interface PartnerType extends Document {
    accountId: mongoose.Types.ObjectId;
    partnerAccessKey?: string;
    partnerAccessKeyExpires?: Date;
    partnerAccessKeyExpired?: boolean;
    identityNumber: string;
    businessName?: string;
    businessDescription?: string;
    licenseDocument?: string;
    verified: boolean;
    onboarding: boolean;
    
    // Metrics
    totalSales: number;
    totalCustomers: number;
    totalProducts: number;
    totalOrders: number;
    totalStores: number;

    // Commission Rate in %
    commissionRate: number;

    createdAt: Date;
    updatedAt: Date;
}

const partnerSchema = new mongoose.Schema<PartnerType>({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true, unique: true },
    partnerAccessKey: { type: String },
    partnerAccessKeyExpires: { type: Date },
    businessName: { type: String },
    businessDescription: { type: String },
    licenseDocument: { type: String},
    identityNumber: { type: String },
    totalSales: { type: Number, default: 0 },
    totalCustomers: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalStores: { type: Number, default: 0 },
    commissionRate: { type: Number, default: 5 },
    verified: { type: Boolean, default: false },
    onboarding: { type: Boolean, default: false },
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});


const PartnerProfile = mongoose.model("PartnerProfile", partnerSchema);
export default PartnerProfile;