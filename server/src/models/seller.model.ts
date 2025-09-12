import mongoose, { Document } from "mongoose";

interface SellerType extends Document {
    account: mongoose.Types.ObjectId;
    
    createdAt: Date;
    updatedAt: Date;
}

const sellerSchema = new mongoose.Schema<SellerType>({
    account: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true,unique: true },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});


const SellerProfile = mongoose.model("SellerProfile", sellerSchema);
export default SellerProfile;