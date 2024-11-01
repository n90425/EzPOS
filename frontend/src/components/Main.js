import React from 'react';
import { useNavigate } from 'react-router-dom';

function Main() {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const menuItems = [
    { name: '영업 개시', path: '/tables' },
    { name: '매출 요약', path: '/sales-summary' },
    { name: '판매 내역', path: '/sales-history' },
    { name: '영수증 반품', path: '/receipt-return' },
    { name: '마감 정산', path: '/closing-settlement' },
    { name: '영업 준비금', path: '/operating-fund' },
    { name: '고객 조회', path: '/customer-inquiry' },
    { name: '주문 내역', path: '/order-history' },
    { name: '담당자', path: '/person-in-charge' },
    { name: '종료', path: '/exit' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>메인 페이지</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {menuItems.map((item, index) => (
          <button key={index} onClick={() => handleButtonClick(item.path)}>
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Main;
