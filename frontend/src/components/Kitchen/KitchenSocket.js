import { useEffect, useState } from "react";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function KitchenSocket(){
    const [orders, setOrders] = useState([]);

    useEffect(()=> {
        const socket = new WebSocket(`${BASE_URL}/kitchen`);
        
        socket.onopen = () => {
            console.log("주방 webSocket 연결완료");
        };

        socket.onmessage = (event) => {
            console.log(event);
            const data = JSON.parse(event.data);

            if(data.type === "INFO"){
                console.log("받은 메시지: ",data.message);
                return;
            }

            if(data.orderNo && data.items){
                setOrders(prev=>[...prev, data])
            } else {
                console.warn("유효하지않은 주문데이터", data);
            }
        };

        socket.onclose = () => {
            console.log("주방 websocket 연결 종료됨");
        };

        return () => socket.close();
    }, []);

    return (
        <div className="kitchen-dashboard">
            <h2>❤️ 주방 주문 리스트 </h2>
            {orders.length === 0 ? (
                <p>현재 접수된 주문이 없습니다.</p>
            ) : (
                orders.map((order, idx) => (
                    <div key={idx} className="kitchen-order-card">
                        <h3>주문번호: {order.orderNo}</h3>
                        <p>테이블: {order.tableNo}</p>
                        <ul>
                            {order.items.map((item, i) => (
                                <li key={i}>
                                    {item.menuName} - {item.quantity}개 ({item.status})
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    )
}
export default KitchenSocket;