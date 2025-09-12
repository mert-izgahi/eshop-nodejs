import mongoose, { Document } from "mongoose";

interface StaffType extends Document {
    account: mongoose.Types.ObjectId;
    
    createdAt: Date;
    updatedAt: Date;
}

const staffSchema = new mongoose.Schema<StaffType>({
    account: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true,unique: true },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});


const StaffProfile = mongoose.model("StaffProfile", staffSchema);
export default StaffProfile;