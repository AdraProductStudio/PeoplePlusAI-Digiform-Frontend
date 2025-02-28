import axios from "axios";
import Cookies from "js-cookie"; // Ensure js-cookie is installed

const axiosInstance = axios.create({
    // baseURL: `http://10.10.11.29:5000`,
    baseURL: `https://digiformapi.adraproductstudio.com:5000`,
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
                // const response = await axios.get("http://10.10.11.29:5000/refresh", {
                const response = await axios.get("https://digiformapi.adraproductstudio.com:5000/refresh", {
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





// import axios from "axios";
// import Cookies from "js-cookie"; // Make sure this is imported



// const axiosInstance = axios.create({
//     baseURL: `http://10.10.11.234:5000`,
//     headers: {
//         'Content-Type': 'application/json',
//     }
// });

// axiosInstance.interceptors.request.use((config) => {
//     const token = Cookies.get("accessToken")
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     if (config.data instanceof FormData) {
//         config.headers["Content-Type"] = "multipart/form-data"
//     } else {
//         config.headers["Content-Type"] = "application/json"
//     }
//     return config;
// })

// axiosInstance.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async (error) => {
//         try {
//             const originalRequest = error.config;

//             if (error.response.status === 401 && !originalRequest._retry) {
//                 originalRequest._retry = true;
//                 if (error.response.data.message === "Invalid Token") {
//                     try {
//                         // ✅ Get refresh token from cookies
//                         const refreshToken = Cookies.get("refreshToken");
//                         if (!refreshToken) {
//                             console.error("No refresh token available.");
//                             return Promise.reject(error);
//                         }
//                         const response = await axiosInstance.get("/refresh", {
//                             headers: {
//                                 Authorization: `Bearer ${refreshToken}`
//                             }
//                         });

//                         if (response.data.data.error_code === 200) {
//                             Cookies.set("accessToken", response.data.data.access_token)
//                         } else {
//                             console.error(response.data.message || "Unknown error");
//                         }
//                     } catch (error) {
//                         console.log(error)
//                     }
//                     return axiosInstance(originalRequest);
//                 }
//             }
//         } catch (err) {
//             return Promise.reject(err);
//         }

//         if (error.code === "ERR_BAD_REQUEST") {
//             const errObj = { ...error }
//             errObj.response.data = {
//                 success: false,
//                 data: {},
//                 message: errObj.response.data.message ? errObj.response.data.message : "ERR_BAD_REQUEST"
//             }
//             return Promise.reject(errObj);
//         } else {
//             return Promise.reject(error);
//         }
//     }
// );

// export default axiosInstance





