import React, { useState } from "react";
import "../../css/salesummary/sidebar.css";

function Sidebar({ onMenuSelect }) {
    const [selectedMenu, setSelectedMenu] = useState("salesSummary");

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
        onMenuSelect(menu); // 부모 컴포넌트에 메뉴 선택 전달
    };

    return (
        <div className="sidebar">
            <ul>
                <li 
                    onClick={() => handleMenuClick("salesSummary")}
                    className={selectedMenu === "salesSummary" ? "active" : ""}
                >매출 현황</li>
                
                <li 
                    onClick={() => handleMenuClick("salesCalendar")}
                    className={selectedMenu === "salesCalendar" ? "active" : ""}
                >매출 달력</li>
                
                <li onClick={() => handleMenuClick("productAnalysis")}
                    className={selectedMenu === "productAnalysis" ? "active" : ""}
                >상품 분석</li>
            </ul>
            <button>엑셀 다운로드</button>
            <button>의견 보내기</button>
        </div>
    );
}

export default Sidebar;
