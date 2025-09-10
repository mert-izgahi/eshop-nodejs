import mongoose, { Document } from "mongoose";

interface StoreType extends Document {
    name: string;
    description?: string;

    // Ownership
    owner: mongoose.Types.ObjectId;
    followers: mongoose.Types.ObjectId[];
    staff?: mongoose.Types.ObjectId[];
    // Media
    logo?: string;
    banner?: string;
    // Analytics
    rating: number;
    totalReviews: number;
    // Metrics
    totalSales: number;
    totalProducts: number;
    totalVisitors: number;
    totalOrders: number;

    // Social and Contact Info
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
    };
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
    };

    // Returns and Policies
    acceptReturns: boolean;
    returnDays?: number;
    returnPolicy?: string;

    // SEO
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];

    // Vacation Mode
    vacationMode: boolean;
    vacationMessage?: string;
    vacationStartDate?: Date;
    vacationEndDate?: Date;

    // Working hours could be added in future
    // products could be linked in future

    createdAt: Date;
    updatedAt: Date;
}

const storeSchema = new mongoose.Schema<StoreType>(
    {
        name: { type: String, required: true },
        description: { type: String },

        // Ownership
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
        staff: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
        // Media
        logo: { type: String },
        banner: { type: String },

        // Analytics
        rating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },

        // Metrics
        totalSales: { type: Number, default: 0 },
        totalProducts: { type: Number, default: 0 },
        totalVisitors: { type: Number, default: 0 },
        totalOrders: { type: Number, default: 0 },

        // Social and Contact Info
        socialLinks: {
            facebook: { type: String },
            twitter: { type: String },
            instagram: { type: String },
            linkedin: { type: String },
        },
        address: {
            type: { type: String, enum: ["Point"], default: "Point" },
            street: { type: String },
            city: { type: String },
            state: { type: String },
            zipCode: { type: String },
            country: { type: String, default: "USA" },
        },

        // Returns and Policies
        acceptReturns: { type: Boolean, default: false },
        returnDays: { type: Number },
        returnPolicy: { type: String },

        // SEO
        metaTitle: { type: String },
        metaDescription: { type: String },
        metaKeywords: [{ type: String }],

        // Vacation Mode
        vacationMode: { type: Boolean, default: false },
        vacationMessage: { type: String },
        vacationStartDate: { type: Date },
        vacationEndDate: { type: Date },
    },
    {
        timestamps: true,
    }
);

const Store = mongoose.model<StoreType>("Store", storeSchema);

export default Store;