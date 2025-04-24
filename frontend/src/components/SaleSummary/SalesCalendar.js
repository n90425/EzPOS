import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // 기본 스타일 가져오기
import "../../css/salesummary/salesCalendar.css"; // 사용자 정의 스타일
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function SalesCalendar() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [salesData, setSalesData] = useState({});

    const fetchMonthlySales = async (year, month) => {
        try {
            const res = await axios.get(`${BASE_URL}/shop/calendar`, { params: { year, month }});
            console.log("res====",res);
            const formatted = {};
            res.data.forEach((item) => {
                const dateStr = item.date;
                formatted[dateStr] = {
                    totalSales: item.totalSales,
                    itemsSold: item.totalOrders
                };
            });

            setSalesData(formatted);
        } catch (error){
            console.error("월간 매출 데이터를 불러오는 중 오류 발생:", error);
        }
    };


useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    fetchMonthlySales(year, month);
}, []);

//날짜 클릭
const handleDateChange = (date) => {
    setSelectedDate(date);
};

//각 타일에 매출 표시
const tileContent = ({ date, view }) => {
    if (view === "month") {
        const dateKey = date.toLocaleDateString('sv-SE'); 
        const sale = salesData[dateKey];
        if (sale) {
            return (
                <div className="tile-sales-info">
                    <p>💰 {sale.totalSales.toLocaleString()}원</p>
                </div>
            );
        }
    }
    return null;
};

const selectedKey = selectedDate.toLocaleDateString('sv-SE'); 

const selectedSales = salesData[selectedKey];

return (
    <div className="sales-calendar">
        <h2>📅 매출 달력</h2>
        <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileContent={tileContent}
        />
        
        <div className="sales-details">
            <h3>선택된 날짜: {selectedDate.toLocaleDateString()}</h3>
            {selectedSales ? (
                <div>
                    <p>총 매출: {selectedSales.totalSales.toLocaleString()}원</p>
                    <p>주문 수량: {selectedSales.itemsSold}건</p>
                </div>
            ) : (
                <p>📭 해당 날짜의 매출 데이터가 없습니다.</p>
            )}
        </div>
    </div>
);
}

export default SalesCalendar;
