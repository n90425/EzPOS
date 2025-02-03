import React, { useState, useEffect } from "react";
import axios from "axios";
import "./payhistory.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PaymentHistory = () => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null); // 선택된 행의 인덱스 저장
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // 결제 내역 가져오기
    const fetchPaymentHistory = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/pay/payhistory`, {
                params: {
                    startDate: startDate ? `${startDate}T00:00:00` : null,
                    endDate: endDate ? `${endDate}T23:59:59` : null,
                },
            });

            // 최신 데이터가 위로 오도록 정렬
            const sortedData = response.data.sort(
                (a, b) => new Date(b.paymentTime) - new Date(a.paymentTime)
            );
            setPaymentHistory(sortedData);
        } catch (error) {
            console.error("결제 내역 조회 실패:", error);
        }
    };

    useEffect(() => {
        fetchPaymentHistory();
    }, []);

    // 날짜 포맷
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        };
        return date.toLocaleString("ko-KR", options);
    };

    return (
        <div className="payment-history-container">
            <div className="left-section">
                {/* 필터 섹션 */}
                <div className="filter-section">
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
                    <div className="filter-buttons">
                        <button onClick={fetchPaymentHistory}>조회하기</button>
                    </div>
                </div>

                {/* 테이블 섹션 */}
                <div className="payment-his-table-container">
                    <table className="payment-table">
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
                            {paymentHistory.map((item, index) => (
                                <tr
                                    key={index} // 인덱스를 키로 사용
                                    onClick={() => setSelectedRowIndex(index)} // 선택된 행 인덱스 설정
                                    className={
                                        selectedRowIndex === index ? "selected" : "" // 선택 상태 확인
                                    }
                                >
                                    <td>{formatDateTime(item.paymentTime)}</td>
                                    <td>{item.tableNumber}</td>
                                    <td>{item.payMethCd === "CASH" ? "현금" : "카드"}</td>
                                    <td>{item.paymentAmount.toLocaleString()}원</td>
                                    <td>{item.receiptNumber || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 오른쪽 영수증 섹션 */}
            <div className="right-section">
                <h2>영수증 상세</h2>
                {selectedRowIndex !== null ? (
                    <div className="receipt">
                        {paymentHistory[selectedRowIndex] && (
                            <>
                                <p>
                                    <span>결제 시간:</span>{" "}
                                    {formatDateTime(paymentHistory[selectedRowIndex].paymentTime)}
                                </p>
                                <p>
                                    <span>테이블 번호:</span>{" "}
                                    {paymentHistory[selectedRowIndex].tableNumber}
                                </p>
                                <p>
                                    <span>결제 금액:</span>{" "}
                                    {paymentHistory[selectedRowIndex].paymentAmount.toLocaleString()}원
                                </p>
                                <p>
                                    <span>결제 수단:</span>{" "}
                                    {paymentHistory[selectedRowIndex].payMethCd === "CASH" ? "현금" : "카드"}
                                </p>
                                <p>
                                    <span>영수증 번호:</span>{" "}
                                    {paymentHistory[selectedRowIndex].receiptNumber || "N/A"}
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <p>선택된 결제 내역이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default PaymentHistory;
