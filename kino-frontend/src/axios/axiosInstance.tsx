import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  timeout: 5000,
})

export default axiosInstance