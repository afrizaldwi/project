import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

let isRedirectingInactiveTenant = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    const isInactiveTenant =
      status === 403 &&
      typeof message === "string" &&
      message.toLowerCase().includes("penyewa") &&
      message.toLowerCase().includes("tidak aktif");

    if (isInactiveTenant && !isRedirectingInactiveTenant) {
      isRedirectingInactiveTenant = true;

      try {
        await api.post("/logout");
      } catch (error) {
        console.log(error)
      }

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;