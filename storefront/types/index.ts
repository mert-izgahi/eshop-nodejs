export interface IAccount {
  _id: string;
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
}

export interface CategoryType {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}