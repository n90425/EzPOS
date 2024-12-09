import React, { useEffect, useState } from "react";
import useOrder from "../../hooks/useOrder";
import "./orderHistory.css";

const OrderAll = () => {
    const { orderNo, setOrderNo, fetchOrders } = useOrder();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("");

    // 전체 데이터 조회
    const handleAllSearch = () => {
        setStartDate("");
        setEndDate("");
        setStatus("");
        fetchOrders(null, null, "");
    };

    // 날짜+결제상태를 기반으로 검색
    const handleSearch = () => {
        const start = startDate ? `${startDate}T00:00:00` : null;
        const end = endDate ? `${endDate}T23:59:59` : null;
        console.log(start, end, status)
        fetchOrders(start, end, status);
    }

    // 페이지 로드 시 오늘 날짜로 기본값 설정 및 데이터 조회
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0]; // 오늘 날짜
        const start = `${today}T00:00:00`;
        const end = `${today}T23:59:59`;
        fetchOrders(start, end, ""); // 오늘 날짜로 조회
    }, [fetchOrders]);

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, // 오전오후
        };
        return date.toLocaleString("ko-KR", options);
    };

    const format = (amount) => {
        if(!amount)
            amount = 0;
        return Math.round(amount).toLocaleString("ko-KR");
    };

    return (
        <div className="order-all-container">
            <div className="filter-section">
                {/* 필터 영역 */}
                <div>
                    <label>
                        주문 조회 기간: 
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e)=> setStartDate(e.target.value)}
                        />
                        ~
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e)=> setEndDate(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        상태 선택:
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">전체</option>
                            <option value="PAID">PAID</option>
                            <option value="UNPAID">UNPAID</option>
                        </select>
                    </label>
                </div>
                {/* 오른쪽 버튼 */}
                <div className="filter-buttons">
                    <button className="search-button" onClick={handleAllSearch}>
                        전체 조회
                    </button>
                    <button className="search-button" onClick={handleSearch}>
                        조회하기
                    </button>
                </div>
            </div>

            {orderNo && Array.isArray(orderNo) ? (
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>주문번호</th>
                            <th>주문시간</th>
                            <th>테이블번호</th>
                            <th>상태</th>
                            <th>주문금액</th>
                            <th>부가세</th>
                            <th>합계</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderNo.map((order) => (
                            <tr key={order.orderNo}>
                                <td>{order.orderNo}</td>
                                <td>{formatDateTime(order.orderTime)}</td>
                                <td>{order.tableNo || "-"}</td>
                                <td>{order.orderPayStatus}</td>
                                <td className="amount">{format(order.orderAmount || 0)}</td>
                                <td className="amount">{format(order.orderVat || 0)}</td>
                                <td className="amount">{format((order.orderAmount || 0) + (order.orderVat || 0))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-data">주문 데이터가 없습니다.</p>
            )}
        </div>
    );
};

export default OrderAll;