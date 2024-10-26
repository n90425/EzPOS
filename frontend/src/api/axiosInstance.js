import axios from 'axios'; // axios 라이브러리 사용하여 API호출

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // 백엔드 기본 URL
    headers: {
        'Content-Type': 'application/json', // JSON 형식의 데이터를 전송
    },
});

export default axiosInstance; // apiServer.js에서 호출