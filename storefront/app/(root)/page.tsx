import axios from "axios";
import HomePage from "./client";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/health`);
  } catch (error) {
    console.error(error);
  }
};

export default async function Home() {

  await checkHealth();

  return <HomePage />;
}
