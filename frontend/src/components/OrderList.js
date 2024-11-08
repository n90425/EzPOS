import React, {useEffect, useState} from "react";
import getfetch from "../api/fetch"
import "../css/orderList.css"

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function OrderList(){
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const getOrders = async () => {
            try {
                const data = await getfetch(`${BASE_URL}/order`);
                setOrders(data);
            } catch (error){
                console.error("Order Error", error);
            }
        };

        getOrders();
    }, []);

    return (
        <div className="table-container">
            <h1 className="order-header">주 문 내 역</h1>
            <table className="order-table">
                <thead>
                    <tr>
                        <th>Oder No</th>
                        <th>Table No</th>
                        <th>OrderTime</th>
                        <th>OrderStatus</th>
                        <th>orderAmount</th>
                        <th>OrderVat</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => {
                        return <tr key={order.orderNo}> 
                            <td>{order.orderNo}</td>
                            <td>{order.dining?.tableNo}</td>
                            <td>{order.orderTime}</td>
                            <td>{order.orderPayStatus}</td>
                            <td>{order.orderAmount}</td>
                            <td>{order.orderVat}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default OrderList;