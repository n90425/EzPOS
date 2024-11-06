import React, {useEffect, useState} from "react";
import axios from "axios";

function OrderList(){
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/order')
        .then(response => {
            setOrders(response.data);
        })
        .catch(error => {
            console.error("Order Error", error);
        });
    }, []);

    return (
        <div>
            <h1>Order List</h1>
            <ul>
                {orders.map(order => {
                    return <li key={order.orderNo}> 
                        Order No: {order.orderNo}
                        Table No: {order.dining?.tableNo}
                        orderTime: {order.orderTime}
                        orderStatus: {order.orderPayStatus}
                        orderAmount: {order.orderAmount}
                        orderVat: {order.orderVat}
                    </li>
                })}
            </ul>
        </div>
    )
}

export default OrderList;