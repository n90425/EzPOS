import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import TabBar from "./TabBar";
import "../../css/salesummary/dashboard.css";
import { getMappingData } from "../../api/apiService";
import { scales } from "chart.js/auto";


const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Dashboard = ({ activeTab: initialTab = "today" }) => {
  const today = new Date();
  const year = today.getFullYear(); // 연도 추출
  const month = String(today.getMonth() + 1).padStart(2, '0'); // 월 추출 (2자리로 보정)
  const day = String(today.getDate()).padStart(2, '0'); // 일 추출 (2자리로 보정)
  const formattedDate = `${year}-${month}-${day}`; // 포맷팅
  const selectedDay = formattedDate; // 오늘 날짜 지정



  const [chartData, setChartData] = useState({ dates: [], weeklySales: [] });
  const [revenueData, setRevenueData] = useState({ totalSales: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);

  
  // 탭에 따른 dateType 반환 함수
  const getDateType = (tab) => {
    switch (tab) {
      case "today":
        return "DAY";
      case "yesterday":
        return "YESTERDAY";
      case "week":
        return "WEEK";
      case "month":
        return "MONTH";
      default:
        return "DAY";
    }
  };

  const getSearchDate = () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    switch (activeTab) {
      case "yesterday":
        return yesterday.toISOString().split("T")[0];
      case "today":
      case "week":
      case "month":
      default:
        return today.toISOString().split("T")[0];
    }
  };
  

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dateType = getDateType(activeTab);
        const searchDate = getSearchDate();
    
        const data = await getMappingData(
          `${BASE_URL}/shop/order-sequence-info?searchDate=${searchDate}&dateType=${dateType}`
        );
    
        console.log("data출력",data)
        setChartData({
          dates: data.dates || [],
          weeklySales: data.weeklySales || [],
        });
    
        setRevenueData({
          totalSales: data.totalSales,
          totalOrders: data.totalOrders,
        });
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab]); // activeTab가 변경될 때 실행

  // 선택된 날짜에 따라 색상을 변경하는 함수
  const getBackgroundColors = () => {
    return chartData.dates.map((date) =>
      date === selectedDay ? "#c4e2c0" : "#D7ECFB"
    );
  };

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

  const options = {
    scales: {
      x: {
        beginAtZero: true,
        scaleLineColor: 'red',
        grid: {
          color: 'transparent',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'transparent',
        },
      }
    }
  }

  return (
    <div>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="stats">
        <div className="stat-box">
          <h3>실매출</h3>
          <p>
            ₩{" "}
            {revenueData.totalSales
              ? revenueData.totalSales.toLocaleString()
              : "0"}
          </p>
        </div>
        <div className="stat-box">
          <h3>주문 건수</h3>
          <p>
            {revenueData.totalOrders
              ? `${revenueData.totalOrders} 건`
              : "0 건"}
          </p>
        </div>
      </div>
      <div className="chart">
        {loading ? (
          <p>로딩 중...</p>
        ) : (
          <Bar data={graphData} options={options}/>
        )}
      </div>
    </div>
  );
};

export default function DashboardContainer() {
  return <Dashboard activeTab="today" />;
}
