import axios from "axios";

// 환경 변수로부터 API Base URL 설정
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export const getfetch = async (url) => {
    try {
        const response = await axios.get(`${BASE_URL}${url}`);
        return response.data;
    } catch (error) {
        console.error("API 호출 에러:", error);
        throw error;
    }
};


export default getfetch;
