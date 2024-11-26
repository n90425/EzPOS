import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import MyCalendar from "./MyCalender";
import "../../css/salesummary/salesummary.css";

export function SaleSummary() {
  // 사이드바에서 선택된 메뉴 상태
  const [activeSidebar, setActiveSidebar] = useState("매출 현황");

  // 매출 데이터
  const revenueData = {
    today: { sales: 120000, orders: 15 },
    yesterday: { sales: 158000, orders: 12 },
    week: { sales: 1730000, orders: 120 },
    month: { sales: 320000000, orders: 450 },
  };

  // 선택된 메뉴에 따라 렌더링할 컴포넌트
  const renderContent = () => {
    switch (activeSidebar) {
      case "매출 현황":
        return <Dashboard revenueData={revenueData} />;
      case "매출 달력":
        return <MyCalendar />;
      case "상품 분석":
        return <MyCalendar />;
      default:
        return <Dashboard revenueData={revenueData} />;
    }
  };

  return (
    <div className="sales-summary">
      {/* 사이드바: 상태 관리 전달 */}
      <Sidebar activeSidebar={activeSidebar} setActiveSidebar={setActiveSidebar} />
      {/* 메인 컨텐츠 영역 */}
      <div className="main">{renderContent()}</div>
    </div>
  );
}
