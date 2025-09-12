import mongoose, { Document } from "mongoose";

interface CustomerType extends Document {
    account: mongoose.Types.ObjectId;
    
    createdAt: Date;
    updatedAt: Date;
}

const customerSchema = new mongoose.Schema<CustomerType>({
    account: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true,unique: true },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});


const CustomerProfile = mongoose.model("CustomerProfile", customerSchema);
export default CustomerProfile;