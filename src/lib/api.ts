// src\lib\api.ts

import axios from "axios";

// You can switch to NEXT_PUBLIC_API_BASE later if needed
const isServer = typeof window === "undefined";
const baseURL = isServer
    ? process.env.API_INTERNAL_BASE || "http://localhost:3000/api"
    : process.env.NEXT_PUBLIC_API_BASE || "/api";

export const api = axios.create({
    baseURL,
    withCredentials: true, // send cookies (for NextAuth)
    headers: {
        "Content-Type": "application/json",
    },
});

// Optional: simple interceptors for debugging or toast integration
api.interceptors.request.use(
    (config) => {
        // console.log("[API] Request:", config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // You could handle global errors here later (401, 403, 500)
        // Example: redirect or show toast
        // if (error.response?.status === 401) router.push("/unauthorized");
        return Promise.reject(error);
    }
);
