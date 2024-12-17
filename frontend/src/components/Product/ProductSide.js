import React, { useState } from "react";

function Sidebar({ onCategoryClick, onItemClick }) {
    const [selectedMenu, setSelectedMenu] = useState("category"); // 선택된 메뉴 관리

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu); // 선택된 메뉴 업데이트
        if (menu === "category") {
            onCategoryClick();
        } else if (menu === "item") {
            onItemClick();
        }
    };

    return (
        <div className="sidebar">
            <ul>
                <li
                    className={`category ${selectedMenu === "category" ? "active" : ""}`}
                    onClick={() => handleMenuClick("category")}
                >
                    카테고리
                </li>
                <li
                    className={`item ${selectedMenu === "item" ? "active" : ""}`}
                    onClick={() => handleMenuClick("item")}
                >
                    상품등록
                </li>
            </ul>
            <button>상품 한번에 등록</button>
        </div>
    );
}

export default Sidebar;
