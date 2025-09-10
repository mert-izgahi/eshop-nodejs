import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
interface AccountType extends Document {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  password?: string;
  verified?: boolean;
  isActive?: boolean;
  provider: "credentials" | "google" | "facebook";
  role: "customer" | "staff" | "seller" | "admin";
  adminAccessKey?: string;
  adminAccessKeyExpires?: Date;
  adminAccessKeyExpired?: boolean;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(password: string): Promise<boolean>;
  generateResetPasswordToken(): Promise<string>;
}

const accountSchema = new mongoose.Schema<AccountType>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String },
    password: { type: String },
    isActive: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    provider: { type: String, required: true, default: "credentials" },
    role: { type: String, required: true, default: "customer" },
    adminAccessKey: { type: String },
    adminAccessKeyExpires: { type: Date },
    phoneNumber: { type: String },
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  },
);

accountSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  if (!this.password) return next();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

accountSchema.virtual("adminAccessKeyExpired").get(function () {
  return this.adminAccessKeyExpires && this.adminAccessKeyExpires < new Date();
});

accountSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

const Account = mongoose.model<AccountType>("Account", accountSchema);

export default Account;
