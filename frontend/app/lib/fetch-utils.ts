import axios from "axios";
// This file is used to set up the base URL for API requests.


const BASE = import.meta.env.VITE_API_BASE_URL;


const api = axios.create({
    baseURL: BASE,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

api.interceptors.request.use((config) => {
        // Add any request interceptors here, e.g., adding auth tokens
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        // Handle successful responses
        return response;
    },
    (error) => {
        // Handle errors globally
        if (error.response && error.response.status === 401) {
            window.dispatchEvent(new Event("force-logout"));
        }
        return Promise.reject(error);
    }
);

const postData = async <T>(url: string, data: unknown): Promise<T> => {
    try {
        const response = await api.post(url, data);
        return response.data;
    } catch (error) {
        console.error("Error posting data:", error);
        throw error;
    }
}

const fetchData = async <T>(url: string): Promise<T> => {
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Error getting data:", error);
        throw error;
    }
}

const updateData = async <T>(url: string, data: T): Promise<T> => {
    try {
        const response = await api.put(url, data);
        return response.data;
    } catch (error) {
        console.error("Error putting data:", error);
        throw error;
    }
}

const deleteData = async (url: string): Promise<void> => {
    try {
        await api.delete(url);
        console.log("Data deleted successfully");
    } catch (error) {
        console.error("Error deleting data:", error);
        throw error;
    }
}

export { api, postData, fetchData, updateData, deleteData };