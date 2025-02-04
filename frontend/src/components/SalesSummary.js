import React, { useEffect, useState } from "react";
import axios from "axios";
import "./main.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
        const fetchSummary = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/pay/today-summary`);
                console.log("API 응답 데이터:", response.data);
                setSummary(response.data);
            } catch (error) {
                console.error("매출 요약 데이터를 가져오지 못했습니다.", error);
                setSummary({
                    totalSales: 0,
                    discountAmount: 0,
                    netSales: 0,
                    vatAmount: 0,
                    receiptCount: 0,
                    cashSales: 0,
                    cardSales: 0,
                });
            }
        };
        fetchSummary();
    }, []);

    return (
        <div className="sales-summary">
            <h2>매출 요약</h2>
            <div className="summary-item">
                <span>총매출액:</span>
                <span>{(summary.totalSales || 0).toLocaleString()}원</span>
            </div>
            <div className="summary-item">
                <span>순매출액:</span>
                <span>{(summary.netSales || 0).toLocaleString()}원</span>
            </div>
            <div className="summary-item">
                <span>부가세액:</span>
                <span>{(summary.vatAmount || 0).toLocaleString()}원</span>
            </div>
            <div className="summary-item">
                <span>영수건수:</span>
                <span>{summary.receiptCount || 0}</span>
            </div>
            <div className="summary-item">
                <span>현금매출액:</span>
                <span>{(summary.cashSales || 0).toLocaleString()}원</span>
            </div>
            <div className="summary-item">
                <span>카드매출액:</span>
                <span>{(summary.cardSales || 0).toLocaleString()}원</span>
            </div>
        </div>
    );
};

export default SalesSummary;
