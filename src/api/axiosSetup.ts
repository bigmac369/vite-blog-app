import axios from "axios";
import { store } from "../redux/store"; // import your Redux store
import { logout } from "../features/user/userSlice";

const api = axios.create({
  baseURL: "/api", // or your full backend URL if not using proxy
  withCredentials: true, // send cookies with requests
});

// Intercept responses
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      
      store.dispatch(logout());
    }
    return Promise.reject(err);
  }
);

export default api;
