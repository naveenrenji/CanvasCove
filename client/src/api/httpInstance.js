import axios from "axios";
import { getFromStorage } from "../utils";

const httpInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

httpInstance.interceptors.request.use(
  (config) => {
    const accesstoken = getFromStorage(process.env.REACT_APP_USER_ACCESS_TOKEN_KEY);
    config.headers["accesstoken"] = accesstoken || "";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default httpInstance;
