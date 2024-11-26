// TabBar.jsx
import React from "react";
import "../../css/salesummary/tabbar.css";
const TabBar = ({ activeTab, onTabChange }) => {
  const tabs = ["yesterday", "today", "week", "month"];
  
  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab ${activeTab === tab ? "active" : ""}`}
          onClick={() => onTabChange(tab)}
        >
          {tab === "yesterday"
            ? "어제"
            : tab === "today"
            ? "오늘"
            : tab === "week"
            ? "이번주"
            : "이번달"}
        </button>
      ))}
    </div>
  );
};

export default TabBar;
