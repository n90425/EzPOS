import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import TabBar from "./TabBar";
import "../../css/salesummary/dashboard.css";
import { getMappingData } from "../../api/apiService";

const Dashboard = ({ revenueData }) => {
  const [chartData, setChartData] = useState(null); // 차트 데이터를 저장
  const [activeTab, setActiveTab] = useState("today");

  const selectedDay = "2015-01-15"
  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const data = await getMappingData("/api/shop/order-sequence-info?searchDate="+selectedDay);
        setChartData(data); // 가져온 데이터를 상태로 설정
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []); // 컴포넌트가 마운트될 때 한 번 실행

  // 로딩 상태 처리
  if (!chartData) {
    return <div>Loading...</div>;
  }
  const getBackgroundColors = () => {
    return chartData.dates.map((date) =>
      date === selectedDay ? "blue" : "#4caf50"
    );
  }
  // 차트에 사용할 데이터
  const graphData = {
    labels: chartData.dates,
    datasets: [
      {
        label: "매출",
        data: chartData.weeklySales,
        backgroundColor: getBackgroundColors(),
      },
    ],
  };

  return (
    <div>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
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
