import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // 기본 스타일 가져오기
import "../../css/salesummary/salesCalendar.css"; // 사용자 정의 스타일

function SalesCalendar() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // 예제 데이터: 날짜별 매출 정보
    const salesData = {
        "2024-12-20": { totalSales: 150000, itemsSold: 120 },
        "2024-12-21": { totalSales: 250000, itemsSold: 200 },
        "2024-12-22": { totalSales: 175000, itemsSold: 150 },
    };

    // 날짜 변경 핸들러
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // 각 날짜에 추가 콘텐츠 렌더링
    const tileContent = ({ date, view }) => {
        if (view === "month") {
            const dateKey = date.toISOString().split("T")[0]; // 날짜 형식: YYYY-MM-DD
            if (salesData[dateKey]) {
                return (
                    <div className="tile-sales-info">
                        <p>💰 {salesData[dateKey].totalSales}원</p>
                    </div>
                );
            }
        }
        return null;
    };

    return (
        <div className="sales-calendar">
            <h2>매출 달력</h2>
            <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileContent={tileContent}
            />
            <div className="sales-details">
                <h3>선택된 날짜: {selectedDate.toLocaleDateString()}</h3>
                {salesData[selectedDate.toISOString().split("T")[0]] ? (
                    <div>
                        <p>총 매출: {salesData[selectedDate.toISOString().split("T")[0]].totalSales}원</p>
                        <p>판매량: {salesData[selectedDate.toISOString().split("T")[0]].itemsSold}개</p>
                    </div>
                ) : (
                    <p>해당 날짜에 데이터가 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default SalesCalendar;
