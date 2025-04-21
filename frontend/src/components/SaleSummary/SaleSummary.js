import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import SalesCalendar from "./SalesCalender";
import "../../css/salesummary/salesummary.css";
export function SaleSummary() {
  // 현재 선택된 메뉴를 상태로 관리
    const [selectedMenu, setSelectedMenu] = useState("salesSummary");

  // 상태에 따라 다른 컴포넌트를 렌더링
    const renderContent = () => {
        switch (selectedMenu) {
            case "salesSummary":
                return <Dashboard />;
            case "salesCalendar":
                return <SalesCalendar />;
            case "productAnalysis":
                return <div>상품 분석 컴포넌트</div>;
            default:
                return <Dashboard />;
        }
    };


    return (
        <div>
            <Sidebar onMenuSelect={setSelectedMenu} />
            <div className="main">
                <div className="content">
                            {renderContent()}
                </div>
            </div>
        </div>
    );
}


