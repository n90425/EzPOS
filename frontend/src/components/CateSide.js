import React from "react";
import "../css/cateside.css";

function Sidebar({ onCategoryClick, onItemClick }) {
    return (
        <div className="sidebar">
            <h3>상품관리</h3>
            <ul>
                {/*<li onClick={product}>상품</li>  {/*상품등록 모달*/}
                <li>옵션</li>
                <li className="category" onClick={onCategoryClick}>카테고리</li> {/* 카테고리 클릭 시 onCategoryClick 호출 */}
                <li className="item" onClick={onItemClick}>상품등록</li>
            </ul>
            <button>상품 한번에 등록</button>
        </div>
    )
}

export default Sidebar; 