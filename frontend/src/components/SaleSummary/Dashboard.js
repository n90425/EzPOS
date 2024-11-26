import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../../css/salesummary/dashboard.css";

const Dashboard = ({ activeTab, revenueData }) => {
  const graphData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue",
        data: [100000, 150000, 1500000, 350000, 500000, 600000, 700000],
        backgroundColor: "#4caf50",
      },
    ],
  };

  return (
    <div>
      <div className="stats">
        <div className="stat-box">
          <h3>실매출</h3>
          <p>₩ {revenueData[activeTab].sales.toLocaleString()}</p>
        </div>
        <div className="stat-box">
          <h3>주문 건수</h3>
          <p>{revenueData[activeTab].orders} 건</p>
        </div>
      </div>
      <div className="chart">
        <Bar data={graphData} />
      </div>
    </div>
  );
};

export default Dashboard;
