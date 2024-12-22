import React, { useState, useEffect } from "react";
import axios from "axios";
import "./payhistory.css";

const PaymentHistory = () => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("ALL");

    //날짜로 조회
    const handleSearch = () => {
        const start = startDate ? `${startDate}T00:00:00` : null;
        const end = endDate ? `${endDate}T23:59:59` : null;
        
        fetchPaymentHistory();
    }

    //오늘 날짜로 기본값 설정
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0]; // 오늘 날짜
        const start = `${today}T00:00:00`;
        const end = `${today}T23:59:59`;
        fetchPaymentHistory();
    }, []);

    // const formatDateTime = (dateTime) => {
    //     const date = new Date(dateTime);
    //     const options = {
    //         year: "numeric",
    //         month: "2-digit",
    //         day: "2-digit",
    //         hour: "2-digit",
    //         minute: "2-digit",
    //         hour12: true, // 오전오후
    //     };
    //     return date.toLocaleString("ko-KR", options);
    // };

    const fetchPaymentHistory = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/pay/payhistory", {
                params: {
                    startDate: startDate ? `${startDate}T00:00:00` : null,
                    endDate: endDate ? `${endDate}T23:59:59` : null,
                    status: status || "ALL",
                }
            });
            console.log(response.data);
            setPaymentHistory(response.data);
        } catch (error) {
            console.error("결제 내역 조회 실패:", error);
        }
    };
    

    return (
        <div className="payment-history">
            <h1>결제 내역</h1>
            <div className="filter-section flex">
                <div>
                    <label>
                        조회 기간: 
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        ~
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </label>
                </div>
                <div className="filter-buttons flex">
                    <button className="search-button" onClick={(handleSearch)}>
                        조회하기
                    </button>
                    <button className="search-button" onClick={() => setStatus("ALL")}>
                        전체 조회
                    </button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>결제 시간</th>
                        <th>테이블 번호</th>
                        <th>현금/카드</th>
                        <th>결제 금액</th>
                        <th>영수증 번호</th>
                    </tr>
                </thead>
                <tbody>
                {paymentHistory.map((item, index) => {
                    console.log(item.payMethCd);
                    return (
                        <tr key={index}>
                            <td>{item.paymentTime}</td>
                            <td>{item.tableNumber}</td>
                            <td>{item.payMethCd}</td>
                            <td>{item.paymentAmount.toLocaleString()}원</td>
                            <td>{item.receiptNumber || "N/A"}</td>
                        </tr>
                    );
                })}
                </tbody>
                    
            </table>
        </div>
    );
};

export default PaymentHistory;
