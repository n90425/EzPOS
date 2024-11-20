import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleClose, handleStartOpen } from './Open/shopService';

function Main() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleButtonClick = async (path) => {
    const actions = {
      '/shop/close': async() => {
      const result = await handleClose(setIsOpen);
      alert(result);
      navigate('/');
      },
      '/shop/open': async() => {
        const result = await handleStartOpen(setIsOpen);
        alert(result);
        navigate('/dining');
      },
    };

    try {
      if(actions[path]){
        await actions[path]();
      } else if(path){
        navigate(path);
      }
    } catch (error){
      alert(error);
    }
  }
        
      

  const menuItems = [
    { name: '영업 개시', path: '/shop/open' },
    { name: '매출 요약', path: '/sales-summary' },
    { name: '판매 내역', path: '/sales-history' },
    { name: '영수증 반품', path: '/receipt-return' },
    { name: '마감 정산', path: '/closing-settlement' },
    { name: '영업 준비금', path: '/operating-fund' },
    { name: '고객 조회', path: '/customer-inquiry' },
    { name: '주문 내역', path: '/order' },
    { name: '테이블 생성', path: '/dining' },
    { name: '담당자', path: '/manager' },
    { name: '상품관리', path: '/product-management' },
    { name: '마감정산', path: '/shop/close' },
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
