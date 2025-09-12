export interface AccountType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  password?: string;
  verified?: boolean;
  isActive?: boolean;
  provider: "credentials" | "google" | "facebook";
  role: "customer" | "staff" | "partner" | "admin";
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

export interface IResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface IPagination {
  page: number;
  limit: number;
  totalResults: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IResponseWithPagination<T> {
  results: T[];
  pagination: IPagination
}

export interface CustomerType {
  _id: string
  accountId: string
  account: AccountType
  createdAt: Date
  updatedAt: Date
}