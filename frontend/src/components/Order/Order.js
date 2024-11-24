import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Order() {

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const {tableNo} = useParams();
  const [orderNo, setOrderNo] = useState(null);
  const [orderDetail, setOrderDetail] = useState([]);
  const [menus, setMenus] = useState([]);

  // 테이블번호로 주문생성 또는 조회
  useEffect(() => {
    const createOrGetOrder = async () => {
      try {
        const res = await axios.post(`${BASE_URL}/order/${tableNo}`, null, {
          params: {tableNo},
        });
        setOrderNo(res.data);
        console.log("ORDER NO: ",res.data);
      } catch(error){
        console.log(error.response?.data || error.message)
        console.error("ERR 생성 또는 조회중 오류발생: ", error)
      }
    };

    createOrGetOrder();
  }, [tableNo]);

  // 주문상세
  const createOrderDetail = async (menuId) => {
    if(!orderNo){
      alert("주문을 먼저 생성");
      return;
    }
    try {
      const res = await axios.post(`${BASE_URL}/order/${orderNo}/ordDetail`, {
        menuId,
        quantity: 1,
      });
      setOrderDetail((prev)=> [...prev, res.data]);
      console.log("createOrderDetail: ",res.data)
    } catch (error) {
      console.log("주문상세 추가중 오류발생: ",error)
    }
  };

  return (
    <div className="order">
      <h1>테이블 {tableNo}</h1>
      <h2>주문번호: {orderNo}</h2>

      {/* 메뉴 리스트 */}
      <div className="menu-list">
        <h2>메뉴</h2>
        {menus.map((menu) => (
          <button
            key={menu.menuId}
            onClick={() => createOrderDetail(menu.menuId)}
            className="menu-button"
          >
            {menu.menuName} - {menu.menuPrice}원
          </button>
        ))}
      </div>

      {/* 주문 상세 */}
      <div className="order-details">
        <h2>주문 상세</h2>
        {orderDetail.length > 0 ? (
          <ul>
            {orderDetail.map((item, index) => (
              <li key={index}>
                {item.menuName} - {item.quantity} x {item.unitPrice} ={' '}
                {item.totalAmount}원
              </li>
            ))}
          </ul>
        ) : (
          <p>주문 내역이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default Order;