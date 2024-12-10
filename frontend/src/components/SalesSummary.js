import React, { useEffect, useState } from "react";
import axios from "axios";
import "./main.css";

const SalesSummary = () => {
    const [summary, setSummary] = useState({
        totalSales: 0,
        discountAmount: 0,
        netSales: 0,
        vatAmount: 0,
        receiptCount: 0,
        cashSales: 0,
        cardSales: 0,
    });

    useEffect(() => {
        // 서버에서 매출 요약 정보 가져오기
        const fetchSummary = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/sales/summary");
            setSummary(response.data);
        } catch (error) {
            console.error("매출 요약 데이터를 가져오지 못했습니다.", error);
        }
        };
        fetchSummary();
    }, []);

    return (
        <div className="sales-summary">
        <h2>매출 요약</h2>
        <div className="summary-item">
            <span>총매출액:</span>
            <span>{summary.totalSales.toLocaleString()}원</span>
        </div>
        <div className="summary-item">
            <span>할인금액:</span>
            <span>{summary.discountAmount.toLocaleString()}원</span>
        </div>
        <div className="summary-item">
            <span>순매출액:</span>
            <span>{summary.netSales.toLocaleString()}원</span>
        </div>
        <div className="summary-item">
            <span>부가세액:</span>
            <span>{summary.vatAmount.toLocaleString()}원</span>
        </div>
        <div className="summary-item">
            <span>영수건수/고객수:</span>
            <span>{summary.receiptCount}</span>
        </div>
        <div className="summary-item">
            <span>현금매출액:</span>
            <span>{summary.cashSales.toLocaleString()}원</span>
        </div>
        <div className="summary-item">
            <span>카드매출액:</span>
            <span>{summary.cardSales.toLocaleString()}원</span>
        </div>
        </div>
    );
};

export default SalesSummary;
