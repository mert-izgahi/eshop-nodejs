import mongoose, { Document } from "mongoose";
import axios from "axios";
const Nominatim_URL = "https://nominatim.openstreetmap.org/search"
interface StoreType extends Document {
    name: string;
    description?: string;

    // Ownership
    accountId: mongoose.Types.ObjectId;
    partnerId: mongoose.Types.ObjectId;
    followersIds: mongoose.Types.ObjectId[];
    staffIds?: mongoose.Types.ObjectId[];
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
        coordinates?: {
            latitude?: number;
            longitude?: number;
        };
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
        accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
        partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "Partner", required: true },
        followersIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
        staffIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
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
            coordinates: {
                latitude: { type: Number },
                longitude: { type: Number },
            },
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


// GeoCode
// GeoCode
storeSchema.pre("save", async function (next) {
    try {
        console.log("GeoCode");
        console.log(this.address);
        
        if (this.isModified("address") && this.address) {
            // Build query string (flexible if some parts are missing)
            const parts = [
                this.address.street,
                this.address.city,
                this.address.state,
                this.address.country,
            ].filter(Boolean); // remove undefined

            if (parts.length === 0) return next();

            const query = parts.join(", ");

            const response = await axios.get(Nominatim_URL, {
                params: {
                    q: query,
                    format: "json",
                    addressdetails: 1,
                    limit: 1, // only first result
                },
                headers: {
                    "User-Agent": "E-Shopping/1.0 (myemail@example.com)",
                },
            });

            if (response.data && response.data.length > 0) {
                const location = response.data[0];
                this.address.coordinates = {
                    latitude: parseFloat(location.lat),
                    longitude: parseFloat(location.lon),
                };

                // If some fields missing, autofill from Nominatim response
                if (!this.address.city && location.address.city) {
                    this.address.city = location.address.city;
                }
                if (!this.address.state && location.address.state) {
                    this.address.state = location.address.state;
                }
                if (!this.address.country && location.address.country) {
                    this.address.country = location.address.country;
                }
            }
        }
        next();
    } catch (err:any) {
        console.error("Geocoding failed:", err.message);
        next(); // don’t block saving
    }
});


const Store = mongoose.model<StoreType>("Store", storeSchema);

export default Store;