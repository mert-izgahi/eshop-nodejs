import mongoose, { Document } from "mongoose";

interface AdminType extends Document {
    account: mongoose.Types.ObjectId;
    adminAccessKey: string;
    adminAccessKeyExpires: Date;
    adminAccessKeyExpired: boolean;
    createdAt: Date;
    updatedAt: Date;

    
}

const adminSchema = new mongoose.Schema<AdminType>({
    account: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true, unique: true },
    adminAccessKey: { type: String },
    adminAccessKeyExpires: { type: Date},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

adminSchema.virtual("adminAccessKeyExpired").get(function () {
  return this.adminAccessKeyExpires && this.adminAccessKeyExpires < new Date();
});





const AdminProfile = mongoose.model("AdminProfile", adminSchema);
export default AdminProfile;