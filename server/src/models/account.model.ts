import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
interface AccountType extends Document {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  password?: string;
  provider: "credentials" | "google" | "facebook";
  role: "customer" | "staff" | "seller" | "admin";
  createdAt: Date;
  updatedAt: Date;

  comparePassword(password: string): Promise<boolean>;
  generateResetPasswordToken(): Promise<string>;
}

const accountSchema = new mongoose.Schema<AccountType>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String },
  password: { type: String },
  provider: { type: String, required: true, default: "credentials" },
  role: { type: String, required: true, default: "customer" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

accountSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  if (!this.password) return next();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

accountSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

const Account = mongoose.model<AccountType>("Account", accountSchema);

export default Account;
