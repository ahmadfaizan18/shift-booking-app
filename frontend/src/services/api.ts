import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error(
    "EXPO_PUBLIC_API_URL environment variable is not set. " +
      "Create a .env file with EXPO_PUBLIC_API_URL=http://<your-laptop-ip>:8080 " +
      "or set it in your environment before starting the app."
  );
}

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});