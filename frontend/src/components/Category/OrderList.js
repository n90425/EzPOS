import React from 'react';
import OrderItem from './OrderItem';

const OrderList = ({ orderDetails }) => {
    return (
        <div className="order-list">
            <table>
                <thead>
                    <tr>
                        <th>메뉴</th>
                        <th>수량</th>
                        <th>단가</th>
                        <th>총 금액</th>
                        <th>주문 시간</th>
                    </tr>
                </thead>
                <tbody>
                    {orderDetails.map((detail) => (
                        <OrderItem key={detail.ordDetailNo} detail={detail} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;
