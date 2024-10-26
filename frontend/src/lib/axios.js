import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" ? "https://hello-world-backend-mna5.onrender.com/" : "/api/v1",
	withCredentials: true,
});
