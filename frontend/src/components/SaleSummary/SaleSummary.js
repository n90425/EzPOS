import React, {useState} from "react";
import Sidebar from "./Sidebar";
import TabBar from "./TabBar";
import Dashboard from "./Dashboard";
import "../../css/salesummary/salesummary.css";
export function SaleSummary() {
  const [activeTab, setActiveTab] = useState("today");

  const revenueData = {
    today: { sales: 120000, orders: 15 },
    yesterday: { sales: 158000, orders: 12 },
    week: { sales: 1730000, orders: 120 },
    month: { sales: 320000000, orders: 450 },
  };
  return (
  <div>
    <Sidebar />
    <div className="main">
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <Dashboard activeTab={activeTab} revenueData={revenueData} />
    </div>
  </div>

  );
}


