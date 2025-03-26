import axios from "axios";
import { BASE_URL_API } from "@/constants/constants";

export const apiBase = axios.create({
  baseURL: BASE_URL_API,
  headers: {
    "Content-Type": "application/json",
  },
}); 