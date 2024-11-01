import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function Order() {
  const { tableId } = useParams(); // URL에서 테이블 ID를 가져옴

  // 예시 메뉴 데이터
  const menuItems = [
    { id: 1, name: '메뉴 1', price: 1000 },
    { id: 2, name: '메뉴 2', price: 2000 },
    { id: 3, name: '메뉴 3', price: 3000 },
    { id: 4, name: '메뉴 4', price: 4000 },
    { id: 5, name: '메뉴 5', price: 5000 },
  ];

  const [selectedItems, setSelectedItems] = useState([]);

  const handleOrder = (item) => {
    // 주문한 메뉴를 상태에 추가
    setSelectedItems((prev) => [...prev, item]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>테이블 {tableId} 메뉴</h1>
      <h2>주문할 메뉴</h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id}>
            {item.name}: {item.price}원
            <button
              style={{ marginLeft: '10px' }}
              onClick={() => handleOrder(item)} // 주문하기 버튼 클릭 시
            >
              주문하기
            </button>
          </li>
        ))}
      </ul>
      <h2>주문 목록</h2>
      {selectedItems.length === 0 ? (
        <p>주문한 메뉴가 없습니다.</p>
      ) : (
        <ul>
          {selectedItems.map((item, index) => (
            <li key={index}>
              {item.name}: {item.price}원
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Order;
