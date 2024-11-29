import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import useCategories from "../../hooks/useCategory"; // Custom Hook 가져오기
import useItem from "../../hooks/useItem"; // 메뉴 가져오는 Custom Hook
import CategoryTabs from "../Category/CategoryTabs";
import OrderDetail from "./OrderDetail";
import "./order.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Order = () => {
  const { categories } = useCategories(); // Custom Hook 사용
  const { items, loading: itemLoading, error: itemError } = useItem(); // 메뉴 데이터 Custom Hook
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리
  const [orderNo, setOrderNo] = useState(null);
  const { tableNo } = useParams();

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/order/${tableNo}`);
      if(res.data) {
        setOrderNo(res.data);
      } 
    } catch (error) {
      console.error("주문조회중 오류발생", error);
    }
  };

  // 테이블 번호로 주문 생성 또는 기존 주문 조회
  const createOrGetOrder = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/order/${tableNo}`);
      setOrderNo(res.data);
      console.log("ORDER NO: ", res.data);
      return res.data;
    } catch (error) {
      console.log(error.data);
      console.error("주문 생성 또는 조회 중 오류 발생: ", error);
    }
  };

  // 선택된 카테고리 초기값 설정
  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(categories[0].categoryId); // 첫 번째 카테고리 선택
    }
  }, [categories]);


  return (
    <div className="order-container">
      {/* 카테고리 탭 */}
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

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
