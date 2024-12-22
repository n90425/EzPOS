import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useCategories from "../../hooks/useCategory"; // Custom Hook 가져오기
import useItem from "../../hooks/useItem"; // 메뉴 가져오는 Custom Hook
import CategoryTabs from "../Category/CategoryTabs";
import OrderDetail from "./OrderDetail";
import useOrder from "./../../hooks/useOrder";
import "./order.css";

const Order = () => {
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리
  const { orderNo, setOrderNo, fetchOrder, createOrGetOrder } = useOrder();
  const { tableNo } = useParams();
  const [isPaymentPage] = useState(false); // 결제 페이지 여부

  const { visibleCategories, fetchVisibleCategories } = useCategories();
  const { visibleItem, fetchVisibleItem } = useItem(); // 활성화된 메뉴(Custom Hook)


  // 선택된 카테고리 초기값 설정
  useEffect(() => {
    if (visibleCategories.length > 0) {
      const defaultCategoryId = visibleCategories[0].categoryId; // 기본 카테고리 ID
      setSelectedCategory(defaultCategoryId); // 첫 번째 활성화된 카테고리 선택
    }
  }, [visibleCategories]);


  useEffect(() => {
    fetchVisibleCategories(); // 활성화된 카테고리만 가져오기
    fetchVisibleItem(); // 활성화된 메뉴 가져오기
  }, []);

  return (
    <div className="order-container">
      {!isPaymentPage && (
          <div className="header-row">
          {/* 카테고리 탭 */}
          <CategoryTabs
              categories={visibleCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
          />
            <div className="table-info">
              테이블 {tableNo}
            </div>
          </div>
      )}


      {/* 메뉴 리스트와 주문 상세 */}
      <OrderDetail
        orderNo={orderNo} // 주문 번호 전달
        setOrderNo={setOrderNo}
        menus={visibleItem.filter((menu) => menu.categoryId === selectedCategory)} // 선택된 카테고리에 따른 메뉴 필터링
        tableNo={tableNo}
        createOrGetOrder={createOrGetOrder}
        fetchOrder={fetchOrder}
      />
    </div>
  );
};

export default Order;
