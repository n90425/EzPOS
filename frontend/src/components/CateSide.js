import React from "react";

function Sidebar() {
    return (
        <div className="sidebar">
            <h3>상품관리</h3>
            <ul>
                <li>상품</li>
                <li>옵션</li>
                <li className="active">카테고리</li>
                <li>할인</li>
            </ul>
            <button>상품 한번에 등록</button>
        </div>
    )
}

export default Sidebar; 