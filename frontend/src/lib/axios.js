// src/lib/axios.js

import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:4000/api
  withCredentials: true, // if using cookies for auth
});

export default instance;
