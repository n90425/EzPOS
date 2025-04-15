import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchShopStatus, handleClose, handleStartOpen } from "./Open/shopService";
import SalesSummary from "./SalesSummary"; // 추가한 SalesSummary 컴포넌트 임포트
import "./main.css";

function Main() {
  const [isOpen, setIsOpen] = useState(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(()=> {
    const getShopStatus = async () => {
      const status = await fetchShopStatus();
      setIsOpen(status);
    };
    getShopStatus();
  }, []);

  const handleButtonClick = async (path) => {
    if (path === "/shop/open") {
        const result = await handleStartOpen(setIsOpen);
        alert(result);
        navigate("/dining");
    } else if (path === "/shop/close") {
        const result = await handleClose(setIsOpen);
        alert(result);
        navigate("/");
    } else {
        navigate(path);
    }
};
  

  const menuItems = [
    { name: isOpen ? '영업 종료':'영업 개시', path: isOpen?'/shop/close':'/shop/open', color: "red" },
    { name: '매출 요약', path: '/sales-summary', color: "blue" },
    { name: '판매 내역', path: '/payment-history', color: "blue" },
    { name: '영수증 반품', path: '/receipt-return', color: "blue" },
    { name: '영업 준비금', path: '/operating-fund', color: "gray"  },
    { name: '고객 조회', path: '/customer-inquiry', color: "gray"  },
    { name: '주문 내역', path: '/order-history', color: "gray"  },
    { name: '테이블 관리', path: '/dining', color: "gray"  },
    { name: '담당자', path: '/manager', color: "gray"  },
    { name: '상품관리', path: '/product-management', color: "gray"  },
    { name: '마감정산', path: '/shop/close', color: "gray" },
    { name: '종료', path: '/exit', color: "gray" },
  ];

  return (
    <div className="mainpage-container">

      {/* 콘텐츠 섹션 */}
      <div className="mainpage-content">
        {/* 메뉴 리스트 */}
        <div className="mainpage-menu-list">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(item.path)}
              className={`mainpage-menu-item ${item.color}`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* 매출 요약 */}
        <SalesSummary /> {/* SalesSummary 컴포넌트를 바로 추가 */}
      </div>
    </div>
  );
}

export default Main;