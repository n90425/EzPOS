import React, { useEffect, useState } from "react";
import { handleStartOpen, handleClose, fetchShopStatus } from "./shopService";


function OpenAndClose() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // 영업개시
    useEffect(()=> {
        const getShopStatus = async () => {
            const status = await fetchShopStatus();
            setIsOpen(status);
            setLoading(false);
        }
        getShopStatus(); // 초기 로딩시 영업상태 확인
    }, []);


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