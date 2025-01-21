import axios from 'axios'; // axios 라이브러리 사용하여 API호출

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL, // 백엔드 기본 URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance; // apiServer.js에서 호출