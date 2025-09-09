import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
