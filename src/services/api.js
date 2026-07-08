import axios from "axios";

const api = axios.create({
  baseURL: "http://172.12.13.118:8015",
});

export default api;