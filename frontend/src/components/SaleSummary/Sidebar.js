import React from "react";
import "../../css/cateside.css";

function Sidebar() {
    return (
        <div className="sidebar">
            <h3>매출 리포트</h3>
            <ul>
                <li className="active">매출 현황</li>
                <li>매출 달력</li>
                <li>상품 분석</li>
            </ul>
            <button>엑셀 다운로드</button>
            <button>의견 보내기</button>
        </div>
    )
}

export default Sidebar; 