import React, {useEffect, useState} from "react";
import axios from "axios";

function orderList(){
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
                    <li key={order.id}>{order.orderNo}</li>
                })}
            </ul>
        </div>
    )
}

export default orderList;