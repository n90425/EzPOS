import React from "react";

const OrderDetail = ({orders, removeFromOrder, totalAmount}) => {
    return (
        <div style={{width: "40%", padding:"10px"}}>
            <h2>주문 목록</h2>
            {orders.length === 0 ? (
                <p>주문이 없습니다</p>
            ) : (
                <div>
                    {orders.map((order, orderId) => (
                        <div
                            key={orderId}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "10px",
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                backgroundColor: "#fff",
                            }}
                        >
                            <div>
                                <p>{order.menuName}</p>
                                <p>수량: {order.quantity}</p>
                                <p>가격: {order.price.toLocaleString()}원</p>
                            </div>
                            <button onClick={() => removeFromOrder(order)}>삭제</button>
                        </div>
                    ))}
                    <div style={{marginTop: "20px", fontWeight: "bold"}}>
                        총 금액: {totalAmount.toLocaleString()}원
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetail;