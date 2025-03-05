import axios from "axios";
import Cookies from "js-cookie"; // Ensure js-cookie is installed

const axiosInstance = axios.create({
    baseURL: `http://10.10.11.29:5000`,
    // baseURL: `https://digiformapi.adraproductstudio.com:5000`,
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Intercept all requests and attach the access token if available
axiosInstance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
    } else {
        config.headers["Content-Type"] = "application/json";
    }
    return config;
}, (error) => Promise.reject(error));

// ✅ Handle 401 errors and refresh token if needed
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = sessionStorage.getItem("refreshToken");
            if (!refreshToken) {
                sessionStorage.removeItem("accessToken");
                sessionStorage.removeItem("refreshToken");
                return Promise.reject(error);
            }

            try {
                const response = await axios.get("http://10.10.11.29:5000/refresh", {
                // const response = await axios.get("https://digiformapi.adraproductstudio.com:5000/refresh", {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`
                    },
                });

                if (response.data && response.data.data.access_token) {
                    const newAccessToken = response.data.data.access_token;
                    sessionStorage.setItem("accessToken", newAccessToken);
                    // ✅ Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                } else {
                    console.error("Failed to refresh token. Logging out...");
                    sessionStorage.removeItem("accessToken");
                    sessionStorage.removeItem("refreshToken");
                }
            } catch (refreshError) {
                console.error("Error refreshing token:", refreshError);
                sessionStorage.removeItem("accessToken");
                sessionStorage.removeItem("refreshToken");
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
