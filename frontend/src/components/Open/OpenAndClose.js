import axios from "axios";
import React, { useEffect, useState } from "react";
import { handleStartOpen, handleClose } from "./shopService";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;


function OpenAndClose() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // 영업개시

    // 현재 영업상태 확인
    const fetchShopStatus = async () => {
        try {
            const res = await axios.post(`${BASE_URL}/shop/current`);
            setIsOpen(res.data.isOpen); // 현재 영업상태를 가져온다
        } catch (error) {
            console.error("가게상태 확인중 오류발생: ", error);
        } finally {
            setLoading(false); // 로딩완료
        }
    }



    useEffect(()=> {
        fetchShopStatus(); // 초기 로딩시 영업상태 확인
    }, []);

    if(loading){
        return <div>로딩 중...</div> // 로딩상태
    }

    return (
        <div>
            {/* isOpen이 true 인경우 영업중, false인경우 닫힘 */}
            <h1>가게상태: {isOpen ? "영업 중": "닫힘"}</h1>
            {isOpen ? (
                <button onClick={()=> handleClose(setIsOpen)}>영업 종료</button> // isOpen true
            ) : (
                <button onClick={() => handleStartOpen(setIsOpen)}>영업 개시</button> // isOpen false
            )}
        </div>
    )
}

export default OpenAndClose;