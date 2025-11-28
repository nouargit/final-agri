// src/api/client.ts   ← create this file manually
import { Client } from "@/generated/openapi/client";  // ← path to your generated file

// This is the only place you configure base URL, headers, etc.
export const api = new Client({
  baseUrl: "https://template-lemon-nine.vercel.app/api",
  // You can add default headers later if needed
});