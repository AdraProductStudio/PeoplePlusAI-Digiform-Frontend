import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_REACT_APP_API_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
});

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
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/refresh`, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`
                    },
                });

                if (response.data && response.data.data.access_token) {
                    const newAccessToken = response.data.data.access_token;
                    sessionStorage.setItem("accessToken", newAccessToken);
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
