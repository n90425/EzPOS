import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;


// 영업개시
export const handleStartOpen = async (setIsOpen) => {
    try {
        const res = await axios.post(`${BASE_URL}/shop/open`);
        setIsOpen(true); // 영업상태를 열림으로 설정
        return res.data;
    } catch (error) {
        console.error("영업 개시중 오류 발생:", error);
        throw error.response?.data || "영업 개시중 오류가 발생했습니다.";
    }
};

// 영업종료
export const handleClose = async (setIsOpen) => {
    try {
        const res = await axios.post(`${BASE_URL}/shop/close`);
        setIsOpen(false);  // 열업상태를 닫힘으로 설정
        return res.data;
    } catch (error) {
        console.error("영업 종료중 오류발생: ", error);
        throw error.response?.data || "영업 종료중 오류가 발생했습니다.";
    }
}
