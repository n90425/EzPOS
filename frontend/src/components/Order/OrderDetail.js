import React from "react";
import "./orderDetail.css"; // CSS 파일 연결

const OrderDetail = ({ orders, removeFromOrder, totalAmount }) => {
    return (
        <div className="order-detail-container">
            <h2 className="order-detail-header">주문 목록</h2>
            {orders.length === 0 ? (
                <p>주문이 없습니다</p>
            ) : (
                <div>
                    {orders.map((order, orderId) => (
                        <div key={orderId} className="order-item">
                            <div className="order-item-info">
                                <p>{order.menuName}</p>
                                <p>수량: {order.quantity}</p>
                                <p>가격: {order.price.toLocaleString()}원</p>
                            </div>
                            <button onClick={() => removeFromOrder(order)}>삭제</button>
                        </div>
                    ))}
                    <div className="total-amount">
                        총 금액: {totalAmount.toLocaleString()}원
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetail;
