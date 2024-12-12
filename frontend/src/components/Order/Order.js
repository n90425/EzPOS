import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useCategories from "../../hooks/useCategory"; // Custom Hook 가져오기
import useItem from "../../hooks/useItem"; // 메뉴 가져오는 Custom Hook
import CategoryTabs from "../Category/CategoryTabs";
import OrderDetail from "./OrderDetail";
import useOrder from "./../../hooks/useOrder";
import "./order.css";

const Order = () => {
  const { categories } = useCategories(); // Custom Hook 사용
  const { items, loading: itemLoading, error: itemError } = useItem(); // 메뉴 데이터 Custom Hook
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리
  const { orderNo, setOrderNo, fetchOrder, createOrGetOrder } = useOrder();
  const { tableNo } = useParams();


  // 선택된 카테고리 초기값 설정
  useEffect(() => {
    console.log("Order.JS: ",orderNo);
    if (categories.length > 0) {
      setSelectedCategory(categories[0].categoryId); // 첫 번째 카테고리 선택
    }
  }, [categories]);


  return (
    <div className="order-container">
      <div className="header-row">
        {/* 카테고리 탭 */}
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <div className="table-info">
          테이블 {tableNo}
        </div>
      </div>

      {/* 메뉴 리스트와 주문 상세 */}
      <OrderDetail
        orderNo={orderNo} // 주문 번호 전달
        setOrderNo={setOrderNo}
        menus={items.filter((menu) => menu.categoryId === selectedCategory)} // 선택된 카테고리에 따른 메뉴 필터링
        tableNo={tableNo}
        createOrGetOrder={createOrGetOrder}
        fetchOrder={fetchOrder}
      />
    </div>
  );
};

export default Order;
