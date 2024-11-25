import React from 'react';

const OrderItem = ({ detail }) => {
    return (
        <tr>
            <td>{detail.menuName}</td>
            <td>{detail.quantity}</td>
            <td>{detail.unitPrice}원</td>
            <td>{detail.totalAmount}원</td>
            <td>{detail.itemOrderTime}</td>
        </tr>
    );
};

export default OrderItem;
