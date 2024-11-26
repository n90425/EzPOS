import React from "react";
import "../../css/salesummary/sidebar.css";

function Sidebar({ activeSidebar, setActiveSidebar }) {
  // 메뉴 항목 정의
  const menuItems = ["매출 현황", "매출 달력", "상품 분석"];

  return (
    <div className="sidebar">
      {/* 뒤로가기 버튼 */}
      <button className="back-button" onClick={() => setActiveSidebar("")}>
        &lt;
      </button>

      <h3>매출 리포트</h3>

      <ul>
        {menuItems.map((item) => (
          <li
            key={item}
            className={activeSidebar === item ? "active" : ""}
            onClick={() => setActiveSidebar(item)} // 클릭 시 상태 업데이트
          >
            {item}
          </li>
        ))}
      </ul>

      <button>엑셀 다운로드</button>
      <button>의견 보내기</button>
    </div>
  );
}

export default Sidebar;
