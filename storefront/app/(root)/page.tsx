import * as React from "react";
import { axiosClient } from "@/lib/axios-client";

export default async function Home() {
  const checkHealth = async () => {
    try {
      const response = await axiosClient.get("/api/v1/health");
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  await checkHealth();

  return <div></div>;
}
