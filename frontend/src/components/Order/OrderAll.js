import React, { useEffect } from "react";
import useOrder from "./../../hooks/useOrder";
import "./orderAll.css";

const OrderAll = () => {
    const { orderNo, setOrderNo, fetchOrders } = useOrder();

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <div className="order-all-container">
            <h1 className="order-title">주문 내역</h1>
            <div className="filter-section">
                {/* 필터 영역 */}
                <div>
                    <label>
                        주문 조회 기간: 
                        <input type="date" /> ~ <input type="date" />
                    </label>
                </div>
                <button className="search-button">조회하기</button>
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
                                <td>{order.orderTime}</td>
                                <td>{order.tableNo || "-"}</td>
                                <td>{order.orderPayStatus}</td>
                                <td>{(order.orderAmount || 0).toFixed(0)}</td>
                                <td>{(order.orderVat || 0).toFixed(0)}</td>
                                <td>{((order.orderAmount || 0) + (order.orderVat || 0)).toFixed(0)}</td>
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
